/** Favoritos y listas de reproducción (arquitectura, 4.5). */
import { getDb } from './database';

export interface PlaylistRecord {
  id: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  /** Canciones en su orden. */
  songIds: string[];
}

// --- Favoritos ----------------------------------------------------------------

/** Favoritos, del más reciente al más antiguo. */
export function getFavorites(): string[] {
  return getDb()
    .getAllSync<{ song_id: string }>('SELECT song_id FROM favorites ORDER BY added_at DESC')
    .map((r) => r.song_id);
}

export function addFavorite(songId: string) {
  getDb().runSync(
    'INSERT OR IGNORE INTO favorites (song_id, added_at) VALUES (?, ?)',
    songId,
    Date.now(),
  );
}

export function removeFavorite(songId: string) {
  getDb().runSync('DELETE FROM favorites WHERE song_id = ?', songId);
}

// --- Listas -------------------------------------------------------------------

export function getPlaylists(): PlaylistRecord[] {
  const db = getDb();
  const lists = db.getAllSync<{ id: number; name: string; created_at: number; updated_at: number }>(
    'SELECT * FROM playlists ORDER BY updated_at DESC',
  );
  const rows = db.getAllSync<{ playlist_id: number; song_id: string }>(
    'SELECT playlist_id, song_id FROM playlist_songs ORDER BY playlist_id, position',
  );
  const byList = new Map<number, string[]>();
  for (const r of rows) {
    const ids = byList.get(r.playlist_id);
    if (ids) ids.push(r.song_id);
    else byList.set(r.playlist_id, [r.song_id]);
  }
  return lists.map((l) => ({
    id: l.id,
    name: l.name,
    createdAt: l.created_at,
    updatedAt: l.updated_at,
    songIds: byList.get(l.id) ?? [],
  }));
}

export function createPlaylist(name: string): number {
  const now = Date.now();
  const result = getDb().runSync(
    'INSERT INTO playlists (name, created_at, updated_at) VALUES (?, ?, ?)',
    name,
    now,
    now,
  );
  return result.lastInsertRowId;
}

export function renamePlaylist(id: number, name: string) {
  getDb().runSync(
    'UPDATE playlists SET name = ?, updated_at = ? WHERE id = ?',
    name,
    Date.now(),
    id,
  );
}

export function deletePlaylist(id: number) {
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM playlist_songs WHERE playlist_id = ?', id);
    db.runSync('DELETE FROM playlists WHERE id = ?', id);
  });
}

/** Guarda el orden completo de una lista (añadir, quitar y reordenar pasan por aquí). */
export function setPlaylistSongs(id: number, songIds: string[]) {
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM playlist_songs WHERE playlist_id = ?', id);
    const insert = db.prepareSync(
      'INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id, position) VALUES (?, ?, ?)',
    );
    try {
      songIds.forEach((songId, position) => insert.executeSync(id, songId, position));
    } finally {
      insert.finalizeSync();
    }
    db.runSync('UPDATE playlists SET updated_at = ? WHERE id = ?', Date.now(), id);
  });
}
