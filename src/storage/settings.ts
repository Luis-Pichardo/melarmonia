/**
 * Ajustes guardados en el teléfono con MMKV.
 * Claves y valores predeterminados: docs/04-arquitectura.md (sección 4.4).
 */
import { createMMKV } from 'react-native-mmkv';

import { DEFAULT_ACCENT, type AccentChoice, type ThemePreference } from '@/theme/colors';

export const storage = createMMKV({ id: 'melarmonia-settings' });

export const SettingsKeys = {
  theme: 'theme',
  accentPreset: 'accentPreset',
  accentCustom: 'accentCustom',
} as const;

const THEME_VALUES: ThemePreference[] = ['dark', 'light', 'system'];
const ACCENT_VALUES: AccentChoice[] = [
  'purple',
  'blue',
  'green',
  'red',
  'orange',
  'pink',
  'custom',
];

export function getThemePreference(): ThemePreference {
  const value = storage.getString(SettingsKeys.theme) as ThemePreference | undefined;
  return value && THEME_VALUES.includes(value) ? value : 'dark';
}

export function setThemePreference(value: ThemePreference): void {
  storage.set(SettingsKeys.theme, value);
}

export function getAccentChoice(): AccentChoice {
  const value = storage.getString(SettingsKeys.accentPreset) as AccentChoice | undefined;
  return value && ACCENT_VALUES.includes(value) ? value : DEFAULT_ACCENT;
}

export function setAccentChoice(value: AccentChoice): void {
  storage.set(SettingsKeys.accentPreset, value);
}

// --- Biblioteca -------------------------------------------------------------

/**
 * Carpetas excluidas por defecto: audios que no son música (notas de voz, grabaciones).
 * Se comparan como texto dentro de la ruta del archivo, sin distinguir mayúsculas.
 */
export const DEFAULT_EXCLUDED_FOLDERS = [
  'WhatsApp Voice Notes',
  'WhatsApp Audio',
  'Telegram Audio',
  'Recordings',
  'Call recordings',
  'Notifications',
  'Ringtones',
  'Alarms',
];

const LIBRARY_KEYS = {
  minDurationSec: 'minDurationSec',
  excludedFolders: 'excludedFolders',
  librarySort: 'librarySort',
} as const;

export const MIN_DURATION_OPTIONS = [0, 15, 30, 60] as const;

export function getMinDurationSec(): number {
  return storage.getNumber(LIBRARY_KEYS.minDurationSec) ?? 30;
}

export function setMinDurationSec(value: number): void {
  storage.set(LIBRARY_KEYS.minDurationSec, value);
}

export function getExcludedFolders(): string[] {
  const raw = storage.getString(LIBRARY_KEYS.excludedFolders);
  if (!raw) return DEFAULT_EXCLUDED_FOLDERS;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return DEFAULT_EXCLUDED_FOLDERS;
  }
}

export function setExcludedFolders(folders: string[]): void {
  storage.set(LIBRARY_KEYS.excludedFolders, JSON.stringify(folders));
}

export type LibrarySort = 'title' | 'artist' | 'dateAdded' | 'duration';
const SORT_VALUES: LibrarySort[] = ['title', 'artist', 'dateAdded', 'duration'];

export function getLibrarySort(): LibrarySort {
  const value = storage.getString(LIBRARY_KEYS.librarySort) as LibrarySort | undefined;
  return value && SORT_VALUES.includes(value) ? value : 'title';
}

export function setLibrarySort(value: LibrarySort): void {
  storage.set(LIBRARY_KEYS.librarySort, value);
}

// --- Color ------------------------------------------------------------------

export function getAccentCustom(): string | undefined {
  return storage.getString(SettingsKeys.accentCustom);
}

export function setAccentCustom(hex: string): void {
  storage.set(SettingsKeys.accentCustom, hex);
}
