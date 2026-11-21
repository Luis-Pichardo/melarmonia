import { useMemo } from 'react';

import { useLibrary } from '@/store/library';
import { FAVORITES_ID, usePlaylists, type Playlist } from '@/store/playlists';

import type { Song } from './types';

export function useSongsById(): Map<string, Song> {
  const songs = useLibrary((s) => s.songs);
  return useMemo(() => new Map(songs.map((s) => [s.id, s])), [songs]);
}

/** Convierte ids en canciones, descartando las que ya no están en el teléfono. */
export function resolveSongs(ids: string[], byId: Map<string, Song>): Song[] {
  const out: Song[] = [];
  for (const id of ids) {
    const song = byId.get(id);
    if (song) out.push(song);
  }
  return out;
}

export interface ResolvedPlaylist {
  /** `null` para Favoritos. */
  playlist: Playlist | null;
  title: string;
  songs: Song[];
  isFavorites: boolean;
  exists: boolean;
}

/** Canciones de una lista (o de Favoritos) listas para mostrar. */
export function useResolvedPlaylist(routeId: string): ResolvedPlaylist {
  const byId = useSongsById();
  const favorites = usePlaylists((s) => s.favorites);
  const playlists = usePlaylists((s) => s.playlists);

  return useMemo(() => {
    if (routeId === FAVORITES_ID) {
      return {
        playlist: null,
        title: 'Favoritos',
        songs: resolveSongs(favorites, byId),
        isFavorites: true,
        exists: true,
      };
    }
    const playlist = playlists.find((p) => String(p.id) === routeId) ?? null;
    return {
      playlist,
      title: playlist?.name ?? '',
      songs: playlist ? resolveSongs(playlist.songIds, byId) : [],
      isFavorites: false,
      exists: !!playlist,
    };
  }, [routeId, favorites, playlists, byId]);
}

/** Hasta 4 carátulas distintas para el mosaico de una lista. */
export function mosaicArtwork(songs: Song[]): (string | null)[] {
  const seen = new Set<string>();
  const out: (string | null)[] = [];
  for (const s of songs) {
    if (s.artworkPath && !seen.has(s.artworkPath)) {
      seen.add(s.artworkPath);
      out.push(s.artworkPath);
      if (out.length === 4) break;
    }
  }
  return out;
}
