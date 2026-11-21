/**
 * Colores de Melarmonía.
 * Fuente: docs/02-guia-de-diseno.md (sección 2.2). Si cambias un valor aquí, actualiza la guía.
 */

export type ThemeMode = 'dark' | 'light';
export type ThemePreference = ThemeMode | 'system';

export type AccentPresetId = 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'pink';
export type AccentChoice = AccentPresetId | 'custom';

export interface BrandColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  onPrimary: string;
}

/** Colores de marca preparados. El morado es el predeterminado. */
export const accentPresets: Record<AccentPresetId, { label: string } & BrandColors> = {
  purple: {
    label: 'Morado',
    primary: '#6B3FA0',
    primaryDark: '#4A2575',
    primaryLight: '#9B6FD6',
    onPrimary: '#FFFFFF',
  },
  blue: {
    label: 'Azul',
    primary: '#2F6FD0',
    primaryDark: '#1D4A94',
    primaryLight: '#6FA0EC',
    onPrimary: '#FFFFFF',
  },
  green: {
    label: 'Verde',
    primary: '#2E9E6A',
    primaryDark: '#1E6E49',
    primaryLight: '#62C996',
    onPrimary: '#FFFFFF',
  },
  red: {
    label: 'Rojo',
    primary: '#C8394B',
    primaryDark: '#8E2433',
    primaryLight: '#E87584',
    onPrimary: '#FFFFFF',
  },
  orange: {
    label: 'Naranja',
    primary: '#E07A2E',
    primaryDark: '#A6541A',
    primaryLight: '#F2A66B',
    onPrimary: '#FFFFFF',
  },
  pink: {
    label: 'Rosa',
    primary: '#C9468F',
    primaryDark: '#902E64',
    primaryLight: '#E883BA',
    onPrimary: '#FFFFFF',
  },
};

export const DEFAULT_ACCENT: AccentPresetId = 'purple';

/** Colores base de cada tema (no cambian con el color de marca). */
export const baseColors = {
  dark: {
    background: '#121016',
    surface: '#1E1A26',
    surfaceVariant: '#2A2434',
    textPrimary: '#F2EEF7',
    textSecondary: '#A99DB8',
    divider: '#2E2838',
  },
  light: {
    background: '#FAF8FC',
    surface: '#FFFFFF',
    surfaceVariant: '#EFEAF5',
    textPrimary: '#1C1622',
    textSecondary: '#6B6276',
    divider: '#E4DEEC',
  },
} as const;

/** Colores de estado (iguales en ambos temas). */
export const statusColors = {
  success: '#3FA06B',
  warning: '#E0A030',
  error: '#D9534F',
  favorite: '#E0457B',
} as const;

export type ThemeColors = BrandColors &
  (typeof baseColors)[ThemeMode] &
  typeof statusColors & {
    /** Color de los elementos activos: primaryLight en oscuro, primary en claro. */
    accent: string;
  };

export function buildColors(mode: ThemeMode, brand: BrandColors): ThemeColors {
  return {
    ...baseColors[mode],
    ...statusColors,
    ...brand,
    accent: mode === 'dark' ? brand.primaryLight : brand.primary,
  };
}

// ---------------------------------------------------------------------------
// Color personalizado: cálculo de tonos y contraste (guía de diseño, 2.2)
// ---------------------------------------------------------------------------

const DARK_TEXT = '#1C1622';

export function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const hue = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue(p, q, h + 1 / 3) * 255, hue(p, q, h) * 255, hue(p, q, h - 1 / 3) * 255];
}

/** Cambia la luminosidad de un color en un porcentaje relativo (-0.3 = 30 % más oscuro). */
export function adjustLightness(hex: string, amount: number): string {
  const [h, s, l] = rgbToHsl(...hexToRgb(hex));
  const next = Math.min(1, Math.max(0, l * (1 + amount)));
  return rgbToHex(...hslToRgb(h, s, next));
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Genera los colores de marca a partir de un color elegido por el usuario. */
export function brandFromCustom(hex: string): BrandColors {
  const primary = hex.toUpperCase();
  return {
    primary,
    primaryDark: adjustLightness(primary, -0.3),
    primaryLight: adjustLightness(primary, 0.25),
    onPrimary: contrastRatio('#FFFFFF', primary) >= 4.5 ? '#FFFFFF' : DARK_TEXT,
  };
}

export function resolveBrand(choice: AccentChoice, customHex?: string): BrandColors {
  if (choice === 'custom' && customHex && isValidHex(customHex)) return brandFromCustom(customHex);
  if (choice !== 'custom') return accentPresets[choice];
  return accentPresets[DEFAULT_ACCENT];
}
