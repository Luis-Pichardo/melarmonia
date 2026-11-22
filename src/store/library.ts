import { create } from 'zustand';

import { getAllSongs } from '@/db/songs';
import {
  getAudioPermission,
  requestAudioPermission,
  scanLibrary,
  type AudioPermission,
  type ScanProgress,
  type ScanResult,
} from '@/library/scanner';
import { getLibrarySort, setLibrarySort, type LibrarySort } from '@/storage/settings';
import type { Song } from '@/library/types';

interface LibraryState {
  permission: AudioPermission | 'checking';
  /** `loading`: leyendo la base de datos; `scanning`: buscando música en el teléfono. */
  status: 'idle' | 'loading' | 'scanning' | 'ready' | 'error';
  progress: ScanProgress | null;
  /** Hay una búsqueda en marcha iniciada por el usuario (deslizar hacia abajo). */
  refreshing: boolean;
  songs: Song[];
  sort: LibrarySort;
  error: string | null;
  /** Resultado de la última búsqueda de música (se muestra en Ajustes). */
  lastScan: (ScanResult & { at: number }) | null;

  checkPermission: () => Promise<AudioPermission>;
  requestPermission: () => Promise<AudioPermission>;
  /** Carga lo guardado y luego busca cambios en el teléfono. */
  init: () => Promise<void>;
  rescan: (options?: { userInitiated?: boolean }) => Promise<void>;
  setSort: (sort: LibrarySort) => void;
}

let scanInFlight: Promise<void> | null = null;

export const useLibrary = create<LibraryState>((set, get) => ({
  permission: 'checking',
  status: 'idle',
  progress: null,
  refreshing: false,
  songs: [],
  sort: getLibrarySort(),
  error: null,
  lastScan: null,

  checkPermission: async () => {
    const permission = await getAudioPermission();
    set({ permission });
    return permission;
  },

  requestPermission: async () => {
    const permission = await requestAudioPermission();
    set({ permission });
    return permission;
  },

  init: async () => {
    if (get().status !== 'idle') return;
    set({ status: 'loading' });
    try {
      set({ songs: getAllSongs() });
    } catch (e) {
      set({ status: 'error', error: String(e) });
      return;
    }
    await get().rescan();
  },

  rescan: async ({ userInitiated = false } = {}) => {
    if (scanInFlight) return scanInFlight;
    set({ status: 'scanning', refreshing: userInitiated, progress: null, error: null });
    scanInFlight = (async () => {
      try {
        const result = await scanLibrary((progress) => set({ progress }));
        set({ songs: getAllSongs(), status: 'ready', lastScan: { ...result, at: Date.now() } });
      } catch (e) {
        set({ status: 'error', error: String(e) });
      } finally {
        set({ refreshing: false, progress: null });
        scanInFlight = null;
      }
    })();
    return scanInFlight;
  },

  setSort: (sort) => {
    setLibrarySort(sort);
    set({ sort });
  },
}));
