import { describe, it, expect } from '@jest/globals';
import { compareText, formatDuration, indexLetter, pluralize, stripAccents } from '@/library/text';

describe('texto', () => {
  it('ordena sin distinguir mayúsculas ni tildes', () => {
    const list = ['zebra', 'Árbol', 'abeja', 'éxito', 'Bravo'].sort(compareText);
    expect(list).toEqual(['abeja', 'Árbol', 'Bravo', 'éxito', 'zebra']);
  });

  it('asigna la letra del índice A–Z', () => {
    expect(indexLetter('Árbol')).toBe('A');
    expect(indexLetter('ñandú')).toBe('N');
    expect(indexLetter('99 Luftballons')).toBe('#');
  });

  it('formatea duraciones', () => {
    expect(formatDuration(215000)).toBe('3:35');
    expect(formatDuration(3725000)).toBe('1:02:05');
    expect(formatDuration(0)).toBe('0:00');
  });

  it('pluraliza', () => {
    expect(pluralize(1, 'canción', 'canciones')).toBe('1 canción');
    expect(pluralize(3, 'canción', 'canciones')).toBe('3 canciones');
  });

  it('quita tildes', () => {
    expect(stripAccents('Canción Ñandú')).toBe('Cancion Nandu');
  });
});
