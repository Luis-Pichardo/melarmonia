import { create } from 'zustand';

/** Canciones que se van a añadir a una lista. La hoja se monta una vez en la raíz. */
interface PlaylistPickerState {
  songIds: string[] | null;
  open: (songIds: string[]) => void;
  close: () => void;
}

export const usePlaylistPicker = create<PlaylistPickerState>((set) => ({
  songIds: null,
  open: (songIds) => set({ songIds }),
  close: () => set({ songIds: null }),
}));

export function openPlaylistPicker(songIds: string[]) {
  usePlaylistPicker.getState().open(songIds);
}
