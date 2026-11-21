/**
 * Búsqueda de música en el teléfono.
 *
 * 1. Pide al MediaStore de Android todos los audios (expo-media-library).
 * 2. Descarta los cortos y los de carpetas excluidas.
 * 3. Compara con la base de datos: solo lee metadatos de lo nuevo o modificado.
 * 4. Lee título, artista, álbum y pista de cada archivo.
 * 5. Extrae una carátula por álbum y la guarda en la app.
 */
import {
  getBulkMetadata,
  saveArtwork,
  SaveFormat,
} from '@missingcore/react-native-metadata-retriever';
import { Directory, File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library/legacy';

import { getAlbumArtwork, getSongVersions, saveSongs } from '@/db/songs';
import { getExcludedFolders, getMinDurationSec } from '@/storage/settings';

import { UNKNOWN_ALBUM, UNKNOWN_ARTIST, type Song } from './types';

const PAGE_SIZE = 500;
const METADATA_BATCH = 40;
const METADATA_FIELDS = [
  'title',
  'artist',
  'albumArtist',
  'albumTitle',
  'trackNumber',
  'year',
] as const;

export interface ScanProgress {
  phase: 'listing' | 'reading' | 'artwork';
  done: number;
  total: number;
}

export interface ScanResult {
  total: number;
  added: number;
  removed: number;
}

type AudioAsset = MediaLibrary.Asset;

async function listAudioAssets(onPage: (count: number) => void): Promise<AudioAsset[]> {
  const assets: AudioAsset[] = [];
  let after: string | undefined;
  for (;;) {
    const page = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: PAGE_SIZE,
      after,
    });
    assets.push(...page.assets);
    onPage(assets.length);
    if (!page.hasNextPage) break;
    after = page.endCursor;
  }
  return assets;
}

function folderOf(uri: string): string {
  const path = decodeURIComponent(uri.replace(/^file:\/\//, ''));
  return path.slice(0, path.lastIndexOf('/'));
}

function isExcluded(folder: string, excluded: string[]): boolean {
  const lower = folder.toLowerCase();
  return excluded.some((rule) => rule && lower.includes(rule.toLowerCase()));
}

function titleFromFilename(filename: string): string {
  return (
    filename
      .replace(/\.[^.]+$/, '')
      .replace(/_/g, ' ')
      .trim() || filename
  );
}

function clean(value: string | null | undefined): string | null {
  const v = value?.trim();
  return v ? v : null;
}

/** Clave estable del álbum: misma combinación de artista y álbum = mismo álbum. */
function albumKey(albumArtist: string, album: string): string {
  return `${albumArtist.toLowerCase()}\u0000${album.toLowerCase()}`;
}

function artworkDirectory(): Directory {
  const dir = new Directory(Paths.document, 'artwork');
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  return dir;
}

/** Nombre de archivo seguro para la carátula de un álbum. */
function artworkFileName(key: string): string {
  let hash = 5381;
  for (let i = 0; i < key.length; i++) hash = ((hash << 5) + hash + key.charCodeAt(i)) | 0;
  return `album_${(hash >>> 0).toString(36)}.jpg`;
}

export async function scanLibrary(onProgress?: (p: ScanProgress) => void): Promise<ScanResult> {
  const minDurationSec = getMinDurationSec();
  const excluded = getExcludedFolders();

  // 1–2. Listar y filtrar
  const assets = (
    await listAudioAssets((count) => onProgress?.({ phase: 'listing', done: count, total: 0 }))
  ).filter((a) => a.duration >= minDurationSec && !isExcluded(folderOf(a.uri), excluded));

  // 3. Comparar con lo guardado
  const known = getSongVersions();
  const currentIds = new Set(assets.map((a) => a.id));
  const removedIds = [...known.keys()].filter((id) => !currentIds.has(id));
  const pending = assets.filter((a) => known.get(a.id) !== a.modificationTime);

  // 4. Leer metadatos de lo nuevo o modificado
  const songs: Song[] = [];
  for (let i = 0; i < pending.length; i += METADATA_BATCH) {
    const batch = pending.slice(i, i + METADATA_BATCH);
    const { results } = await getBulkMetadata(
      batch.map((a) => a.uri),
      [...METADATA_FIELDS],
    );
    const byUri = new Map(results.map((r) => [r.uri, r.data]));

    for (const asset of batch) {
      const meta = byUri.get(asset.uri);
      const artist = clean(meta?.artist) ?? clean(meta?.albumArtist) ?? UNKNOWN_ARTIST;
      const albumArtist = clean(meta?.albumArtist) ?? artist;
      const album = clean(meta?.albumTitle) ?? UNKNOWN_ALBUM;
      songs.push({
        id: asset.id,
        uri: asset.uri,
        filename: asset.filename,
        folder: folderOf(asset.uri),
        title: clean(meta?.title) ?? titleFromFilename(asset.filename),
        artist,
        album,
        albumArtist,
        albumId: albumKey(albumArtist, album),
        durationMs: Math.round(asset.duration * 1000),
        trackNumber: meta?.trackNumber ?? null,
        year: meta?.year ?? null,
        artworkPath: null,
        dateAdded: asset.creationTime,
        modifiedAt: asset.modificationTime,
      });
    }
    onProgress?.({
      phase: 'reading',
      done: Math.min(i + METADATA_BATCH, pending.length),
      total: pending.length,
    });
  }

  // 5. Carátulas: una por álbum
  const artwork = getAlbumArtwork();
  const firstSongOfAlbum = new Map<string, Song>();
  for (const s of songs) if (!firstSongOfAlbum.has(s.albumId)) firstSongOfAlbum.set(s.albumId, s);

  const albumsToExtract = [...firstSongOfAlbum.entries()].filter(([id]) => !artwork.has(id));
  if (albumsToExtract.length > 0) {
    const dir = artworkDirectory();
    let done = 0;
    for (const [id, song] of albumsToExtract) {
      const target = new File(dir, artworkFileName(id));
      try {
        const saved = target.exists
          ? target.uri
          : await saveArtwork(song.uri, {
              format: SaveFormat.JPEG,
              compress: 0.85,
              saveUri: target.uri,
            });
        if (saved) artwork.set(id, saved);
      } catch {
        // Sin carátula: se usa el marcador de la guía de diseño.
      }
      done += 1;
      onProgress?.({ phase: 'artwork', done, total: albumsToExtract.length });
    }
  }
  for (const s of songs) s.artworkPath = artwork.get(s.albumId) ?? null;

  saveSongs(songs, removedIds);
  return {
    total: assets.length,
    added: songs.filter((s) => !known.has(s.id)).length,
    removed: removedIds.length,
  };
}

// --- Permiso ----------------------------------------------------------------

export type AudioPermission = 'granted' | 'denied' | 'undetermined';

function toPermission(r: MediaLibrary.PermissionResponse): AudioPermission {
  if (r.granted) return 'granted';
  return r.canAskAgain ? 'undetermined' : 'denied';
}

export async function getAudioPermission(): Promise<AudioPermission> {
  return toPermission(await MediaLibrary.getPermissionsAsync(false, ['audio']));
}

export async function requestAudioPermission(): Promise<AudioPermission> {
  const r = await MediaLibrary.requestPermissionsAsync(false, ['audio']);
  if (r.granted) return 'granted';
  return 'denied';
}

/** Avisa cuando cambian los audios del teléfono (canciones nuevas o borradas). */
export function onMediaLibraryChange(listener: () => void): { remove: () => void } {
  return MediaLibrary.addListener(() => listener());
}
