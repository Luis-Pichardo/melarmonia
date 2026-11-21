import { create } from 'zustand';

/** Avisos breves en la parte inferior (guía de diseño, 2.6): 2,5 s. */
interface ToastState {
  message: string | null;
  tone: 'info' | 'success' | 'error';
  key: number;
  show: (message: string, tone?: ToastState['tone']) => void;
  hide: () => void;
}

export const TOAST_DURATION_MS = 2500;

export const useToast = create<ToastState>((set) => ({
  message: null,
  tone: 'info',
  key: 0,
  show: (message, tone = 'info') => set((s) => ({ message, tone, key: s.key + 1 })),
  hide: () => set({ message: null }),
}));

export function showToast(message: string, tone?: ToastState['tone']) {
  useToast.getState().show(message, tone);
}
