import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import {
  getAccentChoice,
  getAccentCustom,
  getThemePreference,
  setAccentChoice,
  setAccentCustom,
  setThemePreference,
} from '@/storage/settings';

import {
  buildColors,
  resolveBrand,
  type AccentChoice,
  type ThemeColors,
  type ThemeMode,
  type ThemePreference,
} from './colors';

interface ThemeContextValue {
  /** Tema que se está mostrando ahora mismo. */
  mode: ThemeMode;
  /** Lo que eligió el usuario: oscuro, claro o según el sistema. */
  preference: ThemePreference;
  accent: AccentChoice;
  customAccent?: string;
  colors: ThemeColors;
  setPreference: (value: ThemePreference) => void;
  setAccent: (value: AccentChoice, customHex?: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function MelarmoniaThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(getThemePreference);
  const [accent, setAccentState] = useState<AccentChoice>(getAccentChoice);
  const [customAccent, setCustomAccentState] = useState<string | undefined>(getAccentCustom);

  const mode: ThemeMode =
    preference === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      preference,
      accent,
      customAccent,
      colors: buildColors(mode, resolveBrand(accent, customAccent)),
      setPreference: (next) => {
        setThemePreference(next);
        setPreferenceState(next);
      },
      setAccent: (next, customHex) => {
        setAccentChoice(next);
        setAccentState(next);
        if (next === 'custom' && customHex) {
          setAccentCustom(customHex);
          setCustomAccentState(customHex);
        }
      },
    }),
    [mode, preference, accent, customAccent],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de MelarmoniaThemeProvider');
  return ctx;
}
