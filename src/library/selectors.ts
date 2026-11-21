/** Listas derivadas de las canciones: orden, artistas, álbumes e índice A–Z. */
import { useMemo } from 'react';

import { useLibrary } from '@/store/library';
import type { LibrarySort } from '@/storage/settings';

import { compareText, indexLetter } from './text';
import type { Album, Artist, Song } from './types';

export function sortSongs(songs: Song[], sort: LibrarySort): Song[] {
  const list = [...songs];
  switch (sort) {
    case 'title':
      return list.sort((a, b) => compareText(a.title, b.title));
    case 'artist':
      return list.sort(
        (a, b) =>
          compareText(a.artist, b.artist) ||
          compareText(a.album, b.album) ||
          (a.trackNumber ?? 0) - (b.trackNumber ?? 0),
      );
    case 'dateAdded':
      return list.sort((a, b) => b.dateAdded - a.dateAdded);
    case 'duration':
      return list.sort((a, b) => b.durationMs - a.durationMs);
  }
}

/** Canciones de un álbum en su orden (número de pista, luego título). */
export function sortAlbumTracks(songs: Song[]): Song[] {
  return [...songs].sort(
    (a, b) =>
      (a.trackNumber ?? Number.MAX_SAFE_INTEGER) - (b.trackNumber ?? Number.MAX_SAFE_INTEGER) ||
      compareText(a.title, b.title),
  );
}

export function buildAlbums(songs: Song[]): Album[] {
  const map = new Map<string, Album>();
  for (const s of songs) {
    const album = map.get(s.albumId);
    if (album) {
      album.songCount += 1;
      album.artworkPath ??= s.artworkPath;
      album.year ??= s.year;
    } else {
      map.set(s.albumId, {
        id: s.albumId,
        title: s.album,
        artist: s.albumArtist,
        year: s.year,
        songCount: 1,
        artworkPath: s.artworkPath,
      });
    }
  }
  return [...map.values()].sort((a, b) => compareText(a.title, b.title));
}

export function buildArtists(songs: Song[]): Artist[] {
  const map = new Map<string, Artist & { albums: Set<string> }>();
  for (const s of songs) {
    const artist = map.get(s.artist);
    if (artist) {
      artist.songCount += 1;
      artist.albums.add(s.albumId);
      artist.artworkPath ??= s.artworkPath;
    } else {
      map.set(s.artist, {
        id: s.artist,
        name: s.artist,
        songCount: 1,
        albumCount: 0,
        artworkPath: s.artworkPath,
        albums: new Set([s.albumId]),
      });
    }
  }
  return [...map.values()]
    .map(({ albums, ...a }) => ({ ...a, albumCount: albums.size }))
    .sort((a, b) => compareText(a.name, b.name));
}

/** Primera posición de cada letra en una lista ya ordenada. */
export function buildLetterIndex<T>(items: T[], getText: (item: T) => string) {
  const index: { letter: string; position: number }[] = [];
  let last = '';
  items.forEach((item, position) => {
    const letter = indexLetter(getText(item));
    if (letter !== last) {
      index.push({ letter, position });
      last = letter;
    }
  });
  return index;
}

// --- Hooks ------------------------------------------------------------------

export function useSortedSongs(): Song[] {
  const songs = useLibrary((s) => s.songs);
  const sort = useLibrary((s) => s.sort);
  return useMemo(() => sortSongs(songs, sort), [songs, sort]);
}

export function useAlbums(): Album[] {
  const songs = useLibrary((s) => s.songs);
  return useMemo(() => buildAlbums(songs), [songs]);
}

export function useArtists(): Artist[] {
  const songs = useLibrary((s) => s.songs);
  return useMemo(() => buildArtists(songs), [songs]);
}

export function useAlbum(albumId: string) {
  const songs = useLibrary((s) => s.songs);
  return useMemo(() => {
    const tracks = sortAlbumTracks(songs.filter((s) => s.albumId === albumId));
    const album = buildAlbums(tracks)[0] ?? null;
    return { album, tracks };
  }, [songs, albumId]);
}

export function useArtist(name: string) {
  const songs = useLibrary((s) => s.songs);
  return useMemo(() => {
    const own = songs.filter((s) => s.artist === name);
    return {
      songs: sortSongs(own, 'title'),
      albums: buildAlbums(own),
    };
  }, [songs, name]);
}
