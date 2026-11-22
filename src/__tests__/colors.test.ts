import { describe, it, expect } from '@jest/globals';
import {
  accentPresets,
  brandFromCustom,
  buildColors,
  contrastRatio,
  hexToHsl,
  hslToHex,
  resolveBrand,
} from '@/theme/colors';

describe('colores', () => {
  it('el morado de marca tiene buen contraste con texto blanco', () => {
    expect(contrastRatio('#FFFFFF', accentPresets.purple.primary)).toBeGreaterThanOrEqual(4.5);
  });

  it('los textos de los temas cumplen el contraste mínimo', () => {
    for (const mode of ['dark', 'light'] as const) {
      const c = buildColors(mode, accentPresets.purple);
      expect(contrastRatio(c.textPrimary, c.background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.textSecondary, c.background)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('usa texto oscuro sobre colores claros', () => {
    expect(brandFromCustom('#F5E050').onPrimary).toBe('#1C1622');
    expect(brandFromCustom('#2F6FD0').onPrimary).toBe('#FFFFFF');
  });

  it('calcula un tono más oscuro y otro más claro', () => {
    const b = brandFromCustom('#2F6FD0');
    expect(hexToHsl(b.primaryDark).l).toBeLessThan(hexToHsl(b.primary).l);
    expect(hexToHsl(b.primaryLight).l).toBeGreaterThan(hexToHsl(b.primary).l);
  });

  it('convierte entre HSL y hexadecimal', () => {
    const { h, s, l } = hexToHsl('#2F6FD0');
    expect(hslToHex(h, s, l)).toBe('#2F6FD0');
  });

  it('vuelve al morado si el color personalizado no es válido', () => {
    expect(resolveBrand('custom', 'nada')).toEqual(accentPresets.purple);
  });
});
