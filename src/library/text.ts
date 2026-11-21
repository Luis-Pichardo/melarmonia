/** Utilidades de texto para ordenar y agrupar sin distinguir mayúsculas ni tildes. */

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });

export function compareText(a: string, b: string): number {
  return collator.compare(a, b);
}

export function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Letra del índice A–Z para un texto. Lo que no empieza por letra va a "#". */
export function indexLetter(text: string): string {
  const first = stripAccents(text.trim()).charAt(0).toUpperCase();
  return first >= 'A' && first <= 'Z' ? first : '#';
}

/** Duración en formato m:ss o h:mm:ss. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
