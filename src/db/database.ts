/**
 * Base de datos local (SQLite). Esquema: docs/04-arquitectura.md (sección 4.3).
 * Las migraciones se aplican en orden según `PRAGMA user_version`.
 */
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

const MIGRATIONS: string[] = [
  // 1 — Etapa 2: canciones
  `
  CREATE TABLE IF NOT EXISTS songs (
    id            TEXT PRIMARY KEY NOT NULL,
    uri           TEXT NOT NULL,
    filename      TEXT NOT NULL,
    folder        TEXT NOT NULL,
    title         TEXT NOT NULL,
    artist        TEXT NOT NULL,
    album         TEXT NOT NULL,
    album_artist  TEXT NOT NULL,
    album_id      TEXT NOT NULL,
    duration_ms   INTEGER NOT NULL,
    track_number  INTEGER,
    year          INTEGER,
    artwork_path  TEXT,
    date_added    INTEGER NOT NULL,
    modified_at   INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_songs_album ON songs(album_id);
  CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
  `,
  // 2 — Etapa 5: favoritos y listas de reproducción
  `
  CREATE TABLE IF NOT EXISTS favorites (
    song_id   TEXT PRIMARY KEY NOT NULL,
    added_at  INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS playlists (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    created_at  INTEGER NOT NULL,
    updated_at  INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id  INTEGER NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    song_id      TEXT NOT NULL,
    position     INTEGER NOT NULL,
    PRIMARY KEY (playlist_id, song_id)
  );
  CREATE INDEX IF NOT EXISTS idx_playlist_songs_order ON playlist_songs(playlist_id, position);
  `,
];

let db: SQLiteDatabase | null = null;

export function getDb(): SQLiteDatabase {
  if (db) return db;
  db = openDatabaseSync('melarmonia.db');
  db.execSync('PRAGMA journal_mode = WAL;');
  db.execSync('PRAGMA foreign_keys = ON;');
  migrate(db);
  return db;
}

function migrate(database: SQLiteDatabase) {
  const row = database.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  while (version < MIGRATIONS.length) {
    const sql = MIGRATIONS[version];
    database.withTransactionSync(() => {
      database.execSync(sql);
    });
    version += 1;
    database.execSync(`PRAGMA user_version = ${version}`);
  }
}
