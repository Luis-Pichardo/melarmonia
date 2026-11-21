/**
 * Espaciado, medidas y bordes. Fuente: docs/02-guia-de-diseno.md (sección 2.4).
 */

/** Escala de espaciado: múltiplos de 4. */
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  round: 999,
} as const;

export const sizes = {
  screenPadding: spacing.md,
  sectionGap: spacing.lg,
  songRowHeight: 64,
  listArtwork: 48,
  miniPlayerArtwork: 40,
  playButton: 72,
  miniPlayButton: 40,
  minTouchTarget: 48,
  icon: 24,
  playerIcon: 32,
  playIcon: 40,
} as const;

/** Duración de las animaciones (guía de diseño, 2.7). */
export const motion = {
  fast: 200,
  normal: 250,
  slow: 300,
} as const;
