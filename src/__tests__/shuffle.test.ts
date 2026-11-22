import { describe, it, expect } from '@jest/globals';
import { shuffledStartingWith } from '@/player/shuffle';

describe('aleatorio', () => {
  const items = Array.from({ length: 20 }, (_, i) => i);

  it('empieza por la canción elegida y no pierde ni repite ninguna', () => {
    for (let k = 0; k < 10; k++) {
      const result = shuffledStartingWith(items, 7);
      expect(result[0]).toBe(7);
      expect([...result].sort((a, b) => a - b)).toEqual(items);
    }
  });

  it('sin canción elegida, conserva todas', () => {
    expect([...shuffledStartingWith(items)].sort((a, b) => a - b)).toEqual(items);
  });

  it('no modifica la lista original', () => {
    const copy = [...items];
    shuffledStartingWith(items, 3);
    expect(items).toEqual(copy);
  });
});
