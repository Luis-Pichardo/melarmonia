/** Una canción de la biblioteca (tabla `songs`). */
export interface Song {
  id: string;
  uri: string;
  filename: string;
  /** Carpeta donde está el archivo (para excluir carpetas). */
  folder: string;
  title: string;
  artist: string;
  album: string;
  albumArtist: string;
  /** Clave del álbum: artista del álbum + nombre del álbum. */
  albumId: string;
  durationMs: number;
  trackNumber: number | null;
  year: number | null;
  artworkPath: string | null;
  /** Fecha de añadido (ms). */
  dateAdded: number;
  /** Fecha de modificación del archivo (ms), para detectar cambios. */
  modifiedAt: number;
}

export interface Artist {
  /** El nombre del artista sirve de identificador. */
  id: string;
  name: string;
  songCount: number;
  albumCount: number;
  artworkPath: string | null;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number | null;
  songCount: number;
  artworkPath: string | null;
}

export const UNKNOWN_ARTIST = 'Artista desconocido';
export const UNKNOWN_ALBUM = 'Álbum desconocido';
