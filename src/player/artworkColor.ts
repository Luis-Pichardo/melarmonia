/**
 * Color de fondo del reproductor tomado de la carátula (guía de diseño, 2.7).
 *
 * La carátula se reduce a 32×32 con expo-image-manipulator, se guarda como PNG en base64,
 * se descomprime con pako y se calcula el color medio. El resultado se guarda en MMKV
 * para no repetir el cálculo.
 */
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useEffect, useState } from 'react';

import { storage } from '@/storage/settings';
import { hexToHsl, hslToHex, type ThemeMode } from '@/theme/colors';

import { averageColorFromPng, base64ToBytes } from './png';

const SAMPLE_SIZE = 32;
const CACHE_PREFIX = 'artColor:';

function toHex([r, g, b]: [number, number, number]): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

async function computeColor(uri: string): Promise<string | null> {
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width: SAMPLE_SIZE, height: SAMPLE_SIZE });
  const image = await context.renderAsync();
  const result = await image.saveAsync({ format: SaveFormat.PNG, base64: true });
  if (!result.base64) return null;
  const rgb = averageColorFromPng(base64ToBytes(result.base64));
  return rgb ? toHex(rgb) : null;
}

/**
 * Ajusta el color de la carátula para usarlo de fondo: más oscuro en el tema oscuro y
 * siempre lo bastante oscuro para que el texto blanco de la barra superior se lea.
 */
export function backgroundTone(hex: string, mode: ThemeMode): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, Math.min(s, 60), Math.min(l, mode === 'dark' ? 28 : 34));
}

/** Color medio de una carátula (o null si no hay carátula o no se pudo calcular). */
export function useArtworkColor(uri: string | null | undefined): string | null {
  const cached = uri ? (storage.getString(CACHE_PREFIX + uri) ?? null) : null;
  const [result, setResult] = useState<{ uri: string; color: string | null } | null>(null);

  useEffect(() => {
    if (!uri || cached) return;
    let cancelled = false;
    computeColor(uri)
      .then((color) => {
        if (color) storage.set(CACHE_PREFIX + uri, color);
        if (!cancelled) setResult({ uri, color });
      })
      .catch(() => {
        if (!cancelled) setResult({ uri, color: null });
      });
    return () => {
      cancelled = true;
    };
  }, [uri, cached]);

  if (!uri) return null;
  if (cached) return cached;
  return result?.uri === uri ? result.color : null;
}
