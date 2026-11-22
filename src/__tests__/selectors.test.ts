import { describe, it, expect, jest } from '@jest/globals';
import {
  buildAlbums,
  buildArtists,
  buildLetterIndex,
  sortAlbumTracks,
  sortSongs,
} from '@/library/selectors';
import type { Song } from '@/library/types';

jest.mock('@/store/library', () => ({ useLibrary: jest.fn() }));

const song = (
  id: string,
  title: string,
  artist: string,
  album: string,
  track: number | null,
  added = 0,
): Song => ({
  id,
  uri: '',
  filename: '',
  folder: '',
  title,
  artist,
  album,
  albumArtist: artist,
  albumId: `${artist}|${album}`,
  durationMs: Number(id) * 1000,
  trackNumber: track,
  year: null,
  artworkPath: null,
  dateAdded: added,
  modifiedAt: 0,
});

const songs = [
  song('1', 'Zafiro', 'Ana', 'Uno', 2, 10),
  song('2', 'árbol', 'Ana', 'Uno', 1, 30),
  song('3', 'Bruma', 'Beto', 'Dos', null, 20),
];

describe('biblioteca', () => {
  it('ordena por nombre, recientes y duración', () => {
    expect(sortSongs(songs, 'title').map((s) => s.id)).toEqual(['2', '3', '1']);
    expect(sortSongs(songs, 'dateAdded').map((s) => s.id)).toEqual(['2', '3', '1']);
    expect(sortSongs(songs, 'duration').map((s) => s.id)).toEqual(['3', '2', '1']);
  });

  it('ordena las pistas de un álbum por número', () => {
    expect(sortAlbumTracks(songs.slice(0, 2)).map((s) => s.id)).toEqual(['2', '1']);
  });

  it('agrupa álbumes y artistas', () => {
    expect(buildAlbums(songs).map((a) => [a.title, a.songCount])).toEqual([
      ['Dos', 1],
      ['Uno', 2],
    ]);
    expect(buildArtists(songs).map((a) => [a.name, a.songCount, a.albumCount])).toEqual([
      ['Ana', 2, 1],
      ['Beto', 1, 1],
    ]);
  });

  it('crea el índice A–Z', () => {
    const sorted = sortSongs(songs, 'title');
    expect(buildLetterIndex(sorted, (s) => s.title)).toEqual([
      { letter: 'A', position: 0 },
      { letter: 'B', position: 1 },
      { letter: 'Z', position: 2 },
    ]);
  });
});
