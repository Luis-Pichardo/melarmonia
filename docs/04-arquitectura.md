# 4. Arquitectura técnica

## 4.1 Tecnologías

| Área | Elección | Motivo |
|---|---|---|
| Framework | React Native + **Expo SDK 58** | Un solo código, compilación en la nube con EAS |
| Lenguaje | **TypeScript** | Menos errores y mejor autocompletado |
| Navegación | Expo Router (`expo-router/js-tabs` para el menú inferior) | Navegación basada en archivos |
| Audio | `expo-audio` (`AudioPlaylist`) | Librería oficial de Expo: lista nativa, segundo plano, notificación, pantalla de bloqueo, auriculares y pausa al desconectarlos |
| Barra de progreso | `@react-native-community/slider` | Control nativo de Android |
| Gestos | `react-native-gesture-handler` + `react-native-reanimated` | Deslizar la carátula, cerrar el reproductor y deslizar para quitar de la cola |
| Reordenar | `react-native-reorderable-list` | Arrastrar canciones en la cola |
| Lectura de la música | `expo-media-library` (API `expo-media-library/legacy`) | Consulta el MediaStore de Android, con páginas de 500 audios |
| Metadatos y carátulas | `@missingcore/react-native-metadata-retriever` | Lee las etiquetas con el lector nativo de Android (Media3): título, artista, álbum, pista, año y carátula |
| Archivos | `expo-file-system` | Guarda las carátulas en la carpeta de la app |
| Imágenes | `expo-image` | Carátulas con caché y transiciones suaves |
| Estado de la app | Zustand | Simple y ligero |
| Base de datos local | `expo-sqlite` | Canciones, listas, favoritos, historial |
| Ajustes | `react-native-mmkv` v4 (con `react-native-nitro-modules`) | Lectura instantánea al abrir la app |
| Iconos | `@expo/vector-icons` (MaterialIcons) | Incluidos con Expo |
| Degradados | `expo-linear-gradient` | Degradado de marca |
| Color de la carátula | `expo-image-manipulator` + `pako` | Reduce la carátula a 32×32 en PNG y calcula su color medio en JavaScript (`src/player/png.ts`) |
| Listas largas | `@shopify/flash-list` | Fluidez con miles de canciones |
| Fuentes | `@expo-google-fonts/poppins`, `@expo-google-fonts/inter` | Tipografía de la guía de diseño |

> Como el reproductor usa módulos nativos, no funciona en Expo Go: se usa un **development build** (`expo-dev-client`).

> **Por qué `expo-audio` y no `react-native-track-player`:** la documentación inicial proponía `react-native-track-player`, pero lleva meses sin actualizarse y da problemas con la arquitectura nueva de React Native que usa Expo SDK 58. `expo-audio` es la librería oficial, se actualiza con cada versión de Expo y su `AudioPlaylist` ya resuelve la lista, el segundo plano y los controles del sistema.

## 4.2 Estructura de carpetas

```
melarmonia/
├── src/
│   ├── app/                    # Pantallas (Expo Router): cada archivo es una pantalla
│   │   ├── _layout.tsx         # Raíz: fuentes, tema, permiso, avisos
│   │   ├── bienvenida.tsx      # Bienvenida y permiso de música
│   │   ├── reproductor.tsx     # Reproductor completo
│   │   ├── cola.tsx            # Cola de reproducción
│   │   └── (tabs)/
│   │       ├── _layout.tsx     # Menú inferior + mini reproductor
│   │       ├── (biblioteca)/   # Pila de la Biblioteca
│   │       │   ├── index.tsx
│   │       │   ├── album/[id].tsx
│   │       │   └── artista/[name].tsx
│   │       ├── buscar.tsx
│   │       ├── listas/         # Pila de Listas
│   │       │   ├── index.tsx
│   │       │   ├── [id].tsx    # Detalle de una lista o de Favoritos
│   │       │   └── agregar/[id].tsx
│   │       └── ajustes/        # Pila de Ajustes
│   │           ├── index.tsx
│   │           ├── color.tsx   # Color personalizado
│   │           ├── carpetas.tsx
│   │           └── licencias.tsx
│   ├── components/             # AppText, Screen, fila de canción, mini reproductor…
│   ├── theme/                  # colors.ts, typography.ts, spacing.ts, ThemeProvider.tsx
│   ├── storage/                # Ajustes y última reproducción (MMKV)
│   ├── player/                 # Motor de reproducción y cola
│   ├── library/                # Búsqueda de música, metadatos y listas derivadas
│   ├── db/                     # SQLite: esquema y consultas
│   ├── store/                  # Estado global (Zustand): biblioteca, listas, avisos y hojas
│   └── utils/
├── assets/images/              # Icono, pantalla de carga
├── docs/                       # Esta documentación
├── app.json                    # Configuración de Expo (nombre, paquete, icono, plugins)
├── eas.json                    # Perfiles de compilación (development, preview, production)
└── CHANGELOG.md
```

> Las carpetas `android/` e `ios/` **no** se guardan en el repositorio: Expo las genera al compilar (Continuous Native Generation). Toda la configuración nativa va en `app.json`.

## 4.3 Cómo se busca la música (etapa 2)

Archivo: `src/library/scanner.ts`.

1. **Listar:** se piden al MediaStore todos los audios, en páginas de 500.
2. **Filtrar:** se descartan los de menos de 30 s y los que están en carpetas excluidas.
3. **Comparar:** con la base de datos. Solo se leen los archivos nuevos o con fecha de modificación distinta, y se borran los que ya no existen. Por eso, la segunda vez es casi instantánea.
4. **Leer etiquetas:** en lotes de 40 archivos. Si falta el título se usa el nombre del archivo; si falta el artista, "Artista desconocido"; si falta el álbum, "Álbum desconocido".
5. **Carátulas:** se extrae **una por álbum** y se guarda como JPG en `documentos/artwork/`.

**Cuándo se busca:** al abrir la app (primero se muestra lo guardado y se actualiza en segundo plano), al volver a la app, cuando Android avisa de cambios en los audios, y al deslizar hacia abajo en la Biblioteca.

**Agrupación:** un álbum es la combinación de *artista del álbum* + *nombre del álbum*. Los artistas y los álbumes se calculan en memoria a partir de las canciones (`src/library/selectors.ts`).

## 4.4 Cómo funciona el reproductor (etapa 3)

Archivo: `src/player/player.ts`.

- La cola vive en el estado `usePlayer` y se pasa entera a un `AudioPlaylist` nativo. Así, el paso de una canción a otra, la notificación, la pantalla de bloqueo y los botones de los auriculares funcionan aunque la app esté en segundo plano.
- **Aleatorio:** se reordena la cola dejando primero la canción actual, y se guarda la cola original para poder quitarlo. Al activarlo o quitarlo, la lista nativa se vuelve a crear en la misma posición.
- **Repetir:** desactivado / todas / una, que corresponden a `none` / `all` / `single` en la lista nativa.
- **Anterior:** si van más de 3 s, vuelve al inicio de la canción.
- **Errores:** si un archivo no se puede reproducir, se avisa y se pasa a la siguiente. Tras 5 errores seguidos, se detiene.
- **Reanudar:** la cola, la canción, la posición, el aleatorio y la repetición se guardan cada 5 s, al pausar y al cambiar de canción. Al abrir la app se recuperan en pausa.
- **Pantalla de bloqueo:** se activa con la primera reproducción y muestra título, artista, álbum y carátula, con los botones anterior y siguiente.
- **Auriculares:** la pausa al desconectarlos la hace Android (`setHandleAudioBecomingNoisy`) y está siempre activa.
- **Batería:** la lista nativa informa del progreso cada 1 s (`updateInterval: 1000`), suficiente para la barra y con menos trabajo en segundo plano.
- **Color de fondo:** `src/player/artworkColor.ts` calcula el color medio de cada carátula una sola vez y lo guarda en MMKV (`artColor:<ruta>`).
- **Cola (etapa 4):** *Reproducir a continuación* inserta detrás de la actual, *Añadir a la cola* añade al final, y también se puede quitar, mover o vaciar lo que queda. Cada cambio se aplica a la vez en el estado y en la lista nativa (`insert`, `add`, `remove`), sin cortar la canción que suena; por eso la canción actual no se puede mover ni quitar. Cada elemento de la cola tiene una clave propia, porque una canción puede estar dos veces. Con el aleatorio activo, los cambios también se aplican a la cola original.

### Búsqueda (etapa 6)

Archivo: `src/library/search.ts`. Se crea en memoria un índice con el texto normalizado (sin tildes y en minúsculas) de cada canción, artista y álbum, y se vuelve a crear cuando cambia la biblioteca. Cada palabra buscada debe aparecer en el título, el artista o el álbum. El orden es: empieza por el texto → una palabra empieza por él → lo contiene → solo coincide el artista o el álbum. Con 8.000 canciones, cada búsqueda tarda menos de 1 ms.

### Rendimiento (etapa 8)

Pruebas con bibliotecas sintéticas (Node.js):

| Operación | 5.000 canciones | 10.000 canciones |
|---|---|---|
| Ordenar por nombre | 13 ms | 25 ms |
| Ordenar por artista | 5 ms | 11 ms |
| Agrupar álbumes / artistas | 1 ms | 3 ms |
| Índice A–Z | 14 ms | 29 ms |
| Buscar | < 1 ms | < 1 ms |

Todo se calcula solo cuando cambia la biblioteca (`useMemo`), y las listas usan FlashList, que solo dibuja las filas visibles.

## 4.5 Base de datos

Archivos: `src/db/`. Las migraciones se aplican en orden con `PRAGMA user_version`.

**songs** (etapa 2)
| Campo | Tipo | Nota |
|---|---|---|
| id | TEXT PK | ID del MediaStore |
| uri | TEXT | Ruta del archivo |
| filename, folder | TEXT | Nombre del archivo y carpeta (para las exclusiones) |
| title, artist, album | TEXT | |
| album_artist | TEXT | Artista del álbum (o el artista, si falta) |
| album_id | TEXT | Clave del álbum: artista del álbum + álbum |
| duration_ms | INTEGER | |
| track_number, year | INTEGER | Orden dentro del álbum y año |
| artwork_path | TEXT | Carátula guardada en la app |
| date_added | INTEGER | |
| modified_at | INTEGER | Para detectar archivos modificados |

**favorites** (etapa 5): `song_id` (PK), `added_at`. Se muestran del más reciente al más antiguo.

**playlists** (etapa 5): `id` (autoincremental), `name`, `created_at`, `updated_at`. Se ordenan por la última modificación.

**playlist_songs** (etapa 5): `playlist_id`, `song_id`, `position`. Clave primaria (`playlist_id`, `song_id`): una canción no se repite en la misma lista. Al añadir, quitar o reordenar se reescribe el orden completo de la lista en una transacción.

**play_history**: `song_id`, `played_at` (para "Recientes" en el futuro; aún no creada).

> Si una canción de una lista o de favoritos ya no está en el teléfono, no se muestra, pero se conserva por si vuelve. Al reordenar, esas canciones quedan al final.

## 4.6 Ajustes guardados (MMKV)

| Clave | Valores | Predeterminado |
|---|---|---|
| `theme` | `dark` / `light` / `system` | `dark` |
| `accentPreset` | `purple` / `blue` / `green` / `red` / `orange` / `pink` / `custom` | `purple` |
| `accentCustom` | hex | — |
| `excludedFolders` | lista de textos que se buscan en la ruta | WhatsApp Voice Notes, WhatsApp Audio, Telegram Audio, Recordings, Call recordings, Notifications, Ringtones, Alarms |
| `librarySort` | `title` / `artist` / `dateAdded` / `duration` | `title` |
| `minDurationSec` | `0` / `15` / `30` / `60` | `30` |
| `lastPlayback` | JSON: cola, cola original, canción, posición, aleatorio, repetir, origen | Para reanudar donde se quedó |
| `askedNotifications` | booleano | Para pedir el permiso de notificaciones una sola vez |
| `recentSearches` | lista de textos (máx. 10) | `[]` |

## 4.7 Permisos de Android

| Permiso | Para qué |
|---|---|
| `READ_MEDIA_AUDIO` (Android 13+) / `READ_EXTERNAL_STORAGE` (≤12) | Leer la música |
| `FOREGROUND_SERVICE` y `FOREGROUND_SERVICE_MEDIA_PLAYBACK` | Seguir sonando en segundo plano |
| `POST_NOTIFICATIONS` (Android 13+) | Mostrar los controles en la notificación |

La app **no** pide el permiso de internet para nada propio.

Se bloquean de forma expresa los permisos que añaden otras librerías y que no hacen falta: fotos, vídeos, ubicación de los archivos, escritura en el almacenamiento, superposición de ventanas y micrófono (`android.blockedPermissions` en `app.json`).

## 4.8 Compilación y distribución

| Comando | Para qué |
|---|---|
| `npm install` | Instalar las dependencias |
| `npm run build:dev` | APK de desarrollo (EAS), se instala una vez en el teléfono |
| `npm start` | Servidor de desarrollo; el APK de desarrollo se conecta a él y recarga al guardar |
| `npm run build:apk` | APK de prueba independiente (perfil `preview`) para instalar y compartir |
| `npm run android` | Compilar en local (requiere Android Studio) |
| `npm run typecheck` / `npm run lint` / `npm run format` | Revisar tipos, revisar el código y darle formato |

- Las compilaciones con EAS necesitan una cuenta gratuita de Expo (`npx eas-cli@latest login`).
- **Versionado:** SemVer (`1.0.0`). Cada versión se apunta en `CHANGELOG.md`.
- **Identificador de la app:** `com.luispichardo.melarmonia`.
