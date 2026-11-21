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

export function getAccentCustom(): string | undefined {
  return storage.getString(SettingsKeys.accentCustom);
}

export function setAccentCustom(hex: string): void {
  storage.set(SettingsKeys.accentCustom, hex);
}
