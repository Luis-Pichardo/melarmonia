/** Búsquedas recientes (pantallas y flujos, 3.2): las 10 últimas, sin repetir. */
import { storage } from './settings';

const KEY = 'recentSearches';
const MAX = 10;

export function getRecentSearches(): string[] {
  const raw = storage.getString(KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function save(list: string[]) {
  storage.set(KEY, JSON.stringify(list));
}

export function addRecentSearch(query: string): string[] {
  const q = query.trim();
  if (!q) return getRecentSearches();
  const lower = q.toLowerCase();
  const next = [q, ...getRecentSearches().filter((r) => r.toLowerCase() !== lower)].slice(0, MAX);
  save(next);
  return next;
}

export function removeRecentSearch(query: string): string[] {
  const next = getRecentSearches().filter((r) => r !== query);
  save(next);
  return next;
}

export function clearRecentSearches(): string[] {
  save([]);
  return [];
}
