/**
 * Estado de reproducción guardado para reanudar donde se quedó (arquitectura, 4.5).
 */
import { storage } from './settings';

export type RepeatMode = 'off' | 'all' | 'one';

export interface SavedPlayback {
  /** Cola en el orden en que suena. */
  queueIds: string[];
  /** Cola en su orden original (para desactivar el aleatorio). */
  originalIds: string[];
  index: number;
  positionSec: number;
  shuffle: boolean;
  repeat: RepeatMode;
  sourceLabel: string;
}

const KEY = 'lastPlayback';

export function loadPlayback(): SavedPlayback | null {
  const raw = storage.getString(KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<SavedPlayback>;
    if (!Array.isArray(data.queueIds) || data.queueIds.length === 0) return null;
    return {
      queueIds: data.queueIds,
      originalIds: Array.isArray(data.originalIds) ? data.originalIds : data.queueIds,
      index: typeof data.index === 'number' ? data.index : 0,
      positionSec: typeof data.positionSec === 'number' ? data.positionSec : 0,
      shuffle: data.shuffle === true,
      repeat: data.repeat === 'all' || data.repeat === 'one' ? data.repeat : 'off',
      sourceLabel: typeof data.sourceLabel === 'string' ? data.sourceLabel : '',
    };
  } catch {
    return null;
  }
}

export function savePlayback(data: SavedPlayback): void {
  storage.set(KEY, JSON.stringify(data));
}

export function clearPlayback(): void {
  storage.remove(KEY);
}
