/** Mezcla Fisher–Yates (no modifica la lista original). */
export function shuffled<T>(items: T[]): T[] {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/**
 * Cola aleatoria que empieza por la canción elegida.
 * Si no se indica canción, empieza por una al azar.
 */
export function shuffledStartingWith<T>(items: T[], firstIndex?: number): T[] {
  if (firstIndex === undefined || firstIndex < 0 || firstIndex >= items.length)
    return shuffled(items);
  const first = items[firstIndex];
  const rest = items.filter((_, i) => i !== firstIndex);
  return [first, ...shuffled(rest)];
}
