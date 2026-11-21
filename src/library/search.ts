/**
 * Búsqueda en la biblioteca (etapa 6).
 *
 * - Sin distinguir mayúsculas ni tildes: "cancion" encuentra "Canción".
 * - Varias palabras: todas deben aparecer (en el título, el artista o el álbum).
 * - Orden: primero lo que empieza por el texto buscado, luego lo que tiene una palabra que
 *   empieza por él y, al final, lo que lo contiene en cualquier parte.
 */
import { compareText, stripAccents } from './text';
import type { Album, Artist, Song } from './types';

export function normalize(text: string): string {
  return stripAccents(text).toLowerCase().replace(/\s+/g, ' ').trim();
}

function tokens(query: string): string[] {
  return normalize(query).split(' ').filter(Boolean);
}

/** 0: empieza por la búsqueda · 1: una palabra empieza por ella · 2: la contiene · -1: no está. */
function rank(name: string, query: string): number {
  if (name.startsWith(query)) return 0;
  if (name.includes(` ${query}`)) return 1;
  if (name.includes(query)) return 2;
  return -1;
}

interface Indexed<T> {
  item: T;
  /** Nombre principal normalizado (título de la canción, nombre del artista o del álbum). */
  name: string;
  /** Todo el texto buscable normalizado. */
  haystack: string;
}

export interface SearchIndex {
  songs: Indexed<Song>[];
  artists: Indexed<Artist>[];
  albums: Indexed<Album>[];
}

export function buildSearchIndex(songs: Song[], artists: Artist[], albums: Album[]): SearchIndex {
  return {
    songs: songs.map((s) => ({
      item: s,
      name: normalize(s.title),
      haystack: normalize(`${s.title} ${s.artist} ${s.album} ${s.albumArtist}`),
    })),
    artists: artists.map((a) => ({
      item: a,
      name: normalize(a.name),
      haystack: normalize(a.name),
    })),
    albums: albums.map((a) => ({
      item: a,
      name: normalize(a.title),
      haystack: normalize(`${a.title} ${a.artist}`),
    })),
  };
}

function searchIn<T>(
  list: Indexed<T>[],
  query: string,
  words: string[],
  label: (item: T) => string,
): T[] {
  const hits: { item: T; score: number; label: string }[] = [];
  for (const entry of list) {
    if (!words.every((w) => entry.haystack.includes(w))) continue;
    const r = rank(entry.name, query);
    // Si el nombre no coincide pero sí el artista o el álbum, va detrás.
    hits.push({ item: entry.item, score: r === -1 ? 3 : r, label: label(entry.item) });
  }
  hits.sort((a, b) => a.score - b.score || compareText(a.label, b.label));
  return hits.map((h) => h.item);
}

export interface SearchResults {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  total: number;
}

export const EMPTY_RESULTS: SearchResults = { songs: [], artists: [], albums: [], total: 0 };

export function search(index: SearchIndex, rawQuery: string): SearchResults {
  const query = normalize(rawQuery);
  if (!query) return EMPTY_RESULTS;
  const words = tokens(rawQuery);
  const songs = searchIn(index.songs, query, words, (s) => s.title);
  const artists = searchIn(index.artists, query, words, (a) => a.name);
  const albums = searchIn(index.albums, query, words, (a) => a.title);
  return { songs, artists, albums, total: songs.length + artists.length + albums.length };
}
