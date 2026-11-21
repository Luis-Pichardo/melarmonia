import type { Song } from '@/library/types';

import { getDb } from './database';

interface SongRow {
  id: string;
  uri: string;
  filename: string;
  folder: string;
  title: string;
  artist: string;
  album: string;
  album_artist: string;
  album_id: string;
  duration_ms: number;
  track_number: number | null;
  year: number | null;
  artwork_path: string | null;
  date_added: number;
  modified_at: number;
}

function fromRow(r: SongRow): Song {
  return {
    id: r.id,
    uri: r.uri,
    filename: r.filename,
    folder: r.folder,
    title: r.title,
    artist: r.artist,
    album: r.album,
    albumArtist: r.album_artist,
    albumId: r.album_id,
    durationMs: r.duration_ms,
    trackNumber: r.track_number,
    year: r.year,
    artworkPath: r.artwork_path,
    dateAdded: r.date_added,
    modifiedAt: r.modified_at,
  };
}

export function getAllSongs(): Song[] {
  return getDb().getAllSync<SongRow>('SELECT * FROM songs').map(fromRow);
}

/** id → fecha de modificación, para saber qué canciones cambiaron. */
export function getSongVersions(): Map<string, number> {
  const rows = getDb().getAllSync<{ id: string; modified_at: number }>(
    'SELECT id, modified_at FROM songs',
  );
  return new Map(rows.map((r) => [r.id, r.modified_at]));
}

/** Guarda canciones nuevas o modificadas y borra las que ya no existen. */
export function saveSongs(upserts: Song[], removedIds: string[]) {
  const db = getDb();
  db.withTransactionSync(() => {
    const insert = db.prepareSync(
      `INSERT OR REPLACE INTO songs
        (id, uri, filename, folder, title, artist, album, album_artist, album_id,
         duration_ms, track_number, year, artwork_path, date_added, modified_at)
       VALUES ($id, $uri, $filename, $folder, $title, $artist, $album, $albumArtist, $albumId,
         $durationMs, $trackNumber, $year, $artworkPath, $dateAdded, $modifiedAt)`,
    );
    try {
      for (const s of upserts) {
        insert.executeSync({
          $id: s.id,
          $uri: s.uri,
          $filename: s.filename,
          $folder: s.folder,
          $title: s.title,
          $artist: s.artist,
          $album: s.album,
          $albumArtist: s.albumArtist,
          $albumId: s.albumId,
          $durationMs: s.durationMs,
          $trackNumber: s.trackNumber,
          $year: s.year,
          $artworkPath: s.artworkPath,
          $dateAdded: s.dateAdded,
          $modifiedAt: s.modifiedAt,
        });
      }
    } finally {
      insert.finalizeSync();
    }

    const remove = db.prepareSync('DELETE FROM songs WHERE id = $id');
    try {
      for (const id of removedIds) remove.executeSync({ $id: id });
    } finally {
      remove.finalizeSync();
    }
  });
}

/** Carátulas ya extraídas: albumId → ruta. */
export function getAlbumArtwork(): Map<string, string> {
  const rows = getDb().getAllSync<{ album_id: string; artwork_path: string }>(
    'SELECT album_id, MAX(artwork_path) AS artwork_path FROM songs WHERE artwork_path IS NOT NULL GROUP BY album_id',
  );
  return new Map(rows.map((r) => [r.album_id, r.artwork_path]));
}
