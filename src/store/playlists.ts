import { create } from 'zustand';

import * as db from '@/db/playlists';
import type { Song } from '@/library/types';

import { showToast } from './toast';

export type Playlist = db.PlaylistRecord;

/** Id de ruta de la lista fija de Favoritos. */
export const FAVORITES_ID = 'favoritos';

interface PlaylistsState {
  loaded: boolean;
  /** Ids de favoritos, del más reciente al más antiguo. */
  favorites: string[];
  favoriteSet: Set<string>;
  playlists: Playlist[];

  load: () => void;
  toggleFavorite: (song: Song) => void;
  create: (name: string) => number;
  rename: (id: number, name: string) => void;
  remove: (id: number) => void;
  /** Añade canciones al final; las que ya están se ignoran. Devuelve cuántas se añadieron. */
  addSongs: (id: number, songIds: string[]) => number;
  removeSong: (id: number, songId: string) => void;
  /**
   * Guarda el nuevo orden de las canciones visibles. Las que ya no están en el teléfono
   * (no se muestran) se conservan al final por si vuelven.
   */
  reorder: (id: number, visibleOrder: string[]) => void;
}

function withSongIds(state: PlaylistsState, id: number, songIds: string[]): Playlist[] {
  return state.playlists
    .map((p) => (p.id === id ? { ...p, songIds, updatedAt: Date.now() } : p))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export const usePlaylists = create<PlaylistsState>((set, get) => ({
  loaded: false,
  favorites: [],
  favoriteSet: new Set(),
  playlists: [],

  load: () => {
    if (get().loaded) return;
    const favorites = db.getFavorites();
    set({
      loaded: true,
      favorites,
      favoriteSet: new Set(favorites),
      playlists: db.getPlaylists(),
    });
  },

  toggleFavorite: (song) => {
    const { favoriteSet, favorites } = get();
    if (favoriteSet.has(song.id)) {
      db.removeFavorite(song.id);
      const next = favorites.filter((id) => id !== song.id);
      set({ favorites: next, favoriteSet: new Set(next) });
      showToast('Quitada de favoritos');
    } else {
      db.addFavorite(song.id);
      const next = [song.id, ...favorites];
      set({ favorites: next, favoriteSet: new Set(next) });
      showToast('Añadida a favoritos', 'success');
    }
  },

  create: (name) => {
    const id = db.createPlaylist(name);
    const now = Date.now();
    set({
      playlists: [{ id, name, createdAt: now, updatedAt: now, songIds: [] }, ...get().playlists],
    });
    showToast(`Lista «${name}» creada`, 'success');
    return id;
  },

  rename: (id, name) => {
    db.renamePlaylist(id, name);
    set({ playlists: get().playlists.map((p) => (p.id === id ? { ...p, name } : p)) });
  },

  remove: (id) => {
    const name = get().playlists.find((p) => p.id === id)?.name;
    db.deletePlaylist(id);
    set({ playlists: get().playlists.filter((p) => p.id !== id) });
    if (name) showToast(`Lista «${name}» borrada`);
  },

  addSongs: (id, songIds) => {
    const list = get().playlists.find((p) => p.id === id);
    if (!list) return 0;
    const existing = new Set(list.songIds);
    const added = [...new Set(songIds)].filter((s) => !existing.has(s));
    if (added.length === 0) return 0;
    const next = [...list.songIds, ...added];
    db.setPlaylistSongs(id, next);
    set({ playlists: withSongIds(get(), id, next) });
    return added.length;
  },

  removeSong: (id, songId) => {
    const list = get().playlists.find((p) => p.id === id);
    if (!list) return;
    const next = list.songIds.filter((s) => s !== songId);
    db.setPlaylistSongs(id, next);
    set({ playlists: withSongIds(get(), id, next) });
  },

  reorder: (id, visibleOrder) => {
    const list = get().playlists.find((p) => p.id === id);
    if (!list) return;
    const visible = new Set(visibleOrder);
    const next = [...visibleOrder, ...list.songIds.filter((s) => !visible.has(s))];
    db.setPlaylistSongs(id, next);
    set({ playlists: withSongIds(get(), id, next) });
  },
}));

export function useIsFavorite(songId: string | undefined): boolean {
  return usePlaylists((s) => (songId ? s.favoriteSet.has(songId) : false));
}
