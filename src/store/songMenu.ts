import { create } from 'zustand';

import type { Song } from '@/library/types';

/** Desde dónde se abrió el menú: en una lista aparece "Quitar de la lista". */
export interface SongMenuContext {
  playlistId?: number;
}

/** Canción cuyo menú ⋮ está abierto. La hoja se monta una sola vez en la raíz. */
interface SongMenuState {
  song: Song | null;
  context: SongMenuContext;
  open: (song: Song, context?: SongMenuContext) => void;
  close: () => void;
}

export const useSongMenu = create<SongMenuState>((set) => ({
  song: null,
  context: {},
  open: (song, context = {}) => set({ song, context }),
  close: () => set({ song: null }),
}));

export function openSongMenu(song: Song, context?: SongMenuContext) {
  useSongMenu.getState().open(song, context);
}
