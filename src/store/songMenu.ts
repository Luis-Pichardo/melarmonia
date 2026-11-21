import { create } from 'zustand';

import type { Song } from '@/library/types';

/** Canción cuyo menú ⋮ está abierto. La hoja se monta una sola vez en la raíz. */
interface SongMenuState {
  song: Song | null;
  open: (song: Song) => void;
  close: () => void;
}

export const useSongMenu = create<SongMenuState>((set) => ({
  song: null,
  open: (song) => set({ song }),
  close: () => set({ song: null }),
}));

export function openSongMenu(song: Song) {
  useSongMenu.getState().open(song);
}
