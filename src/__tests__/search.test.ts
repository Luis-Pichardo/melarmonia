import { describe, it, expect } from '@jest/globals';
import { buildSearchIndex, search } from '@/library/search';
import type { Song } from '@/library/types';

const song = (id: string, title: string, artist: string, album: string): Song => ({
  id,
  uri: `file:///${id}.mp3`,
  filename: `${id}.mp3`,
  folder: '/Music',
  title,
  artist,
  album,
  albumArtist: artist,
  albumId: `${artist}|${album}`,
  durationMs: 1000,
  trackNumber: null,
  year: null,
  artworkPath: null,
  dateAdded: 0,
  modifiedAt: 0,
});

const songs = [
  song('1', 'Canción del mariachi', 'Antonio Banderas', 'Desperado'),
  song('2', 'La Bachata', 'Manuel Turizo', '2000'),
  song('3', 'Bachata Rosa', 'Juan Luis Guerra', 'Bachata Rosa'),
  song('4', 'Ojalá que llueva café', 'Juan Luis Guerra', 'Ojalá'),
  song('5', 'Mi canción', 'Bachata Boys', 'Mix'),
];
const index = buildSearchIndex(
  songs,
  [
    {
      id: 'Juan Luis Guerra',
      name: 'Juan Luis Guerra',
      songCount: 2,
      albumCount: 2,
      artworkPath: null,
    },
  ],
  [
    {
      id: 'x',
      title: 'Bachata Rosa',
      artist: 'Juan Luis Guerra',
      year: null,
      songCount: 1,
      artworkPath: null,
    },
  ],
);

describe('búsqueda', () => {
  it('no distingue tildes ni mayúsculas', () => {
    expect(search(index, 'CANCION').songs.map((s) => s.id)).toEqual(['1', '5']);
  });

  it('pone primero lo que empieza por el texto', () => {
    expect(search(index, 'bachata').songs.map((s) => s.id)).toEqual(['3', '2', '5']);
  });

  it('exige todas las palabras', () => {
    expect(search(index, 'juan cafe').songs.map((s) => s.id)).toEqual(['4']);
  });

  it('encuentra artistas y álbumes', () => {
    const r = search(index, 'guerra');
    expect(r.artists).toHaveLength(1);
    expect(r.albums).toHaveLength(1);
  });

  it('devuelve vacío sin texto o sin coincidencias', () => {
    expect(search(index, '   ').total).toBe(0);
    expect(search(index, 'zzz').total).toBe(0);
  });
});
