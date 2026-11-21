/**
 * Tipografía de Melarmonía. Fuente: docs/02-guia-de-diseno.md (sección 2.3).
 * Poppins para títulos, Inter para texto.
 */
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import type { TextStyle } from 'react-native';

/** Fuentes que se cargan al abrir la app. */
export const fontAssets = {
  Inter_400Regular,
  Inter_500Medium,
  Poppins_500Medium,
  Poppins_600SemiBold,
};

export type TypographyVariant = 'display' | 'h1' | 'h2' | 'body' | 'bodySmall' | 'caption';

export const typography: Record<TypographyVariant, TextStyle> = {
  display: { fontFamily: 'Poppins_600SemiBold', fontSize: 28, lineHeight: 36 },
  h1: { fontFamily: 'Poppins_600SemiBold', fontSize: 24, lineHeight: 32 },
  h2: { fontFamily: 'Poppins_500Medium', fontSize: 18, lineHeight: 26 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 22 },
  bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 16 },
};
