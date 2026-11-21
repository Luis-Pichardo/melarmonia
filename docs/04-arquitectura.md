# 4. Arquitectura técnica

## 4.1 Tecnologías

| Área | Elección | Motivo |
|---|---|---|
| Framework | React Native + **Expo SDK 58** | Un solo código, compilación en la nube con EAS |
| Lenguaje | **TypeScript** | Menos errores y mejor autocompletado |
| Navegación | Expo Router (`expo-router/js-tabs` para el menú inferior) | Navegación basada en archivos |
| Audio | `react-native-track-player` | Segundo plano, notificación, pantalla de bloqueo, Bluetooth |
| Lectura de la música | `expo-media-library` | Consulta el MediaStore de Android |
| Metadatos y carátulas | Módulo nativo para leer etiquetas (por definir al implementar) | Título, artista, álbum y carátula |
| Estado de la app | Zustand | Simple y ligero |
| Base de datos local | `expo-sqlite` | Canciones, listas, favoritos, historial |
| Ajustes | `react-native-mmkv` v4 (con `react-native-nitro-modules`) | Lectura instantánea al abrir la app |
| Iconos | `@expo/vector-icons` (MaterialIcons) | Incluidos con Expo |
| Degradados | `expo-linear-gradient` | Degradado de marca |
| Listas largas | `@shopify/flash-list` | Fluidez con miles de canciones |
| Fuentes | `@expo-google-fonts/poppins`, `@expo-google-fonts/inter` | Tipografía de la guía de diseño |

> Como el reproductor usa módulos nativos, no funciona en Expo Go: se usa un **development build** (`expo-dev-client`).

## 4.2 Estructura de carpetas

```
melarmonia/
├── src/
│   ├── app/                    # Pantallas (Expo Router): cada archivo es una pantalla
│   │   ├── _layout.tsx         # Raíz: fuentes, tema, pantalla de carga
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx     # Menú inferior con 4 pestañas
│   │   │   ├── index.tsx       # Biblioteca
│   │   │   ├── buscar.tsx
│   │   │   ├── listas.tsx
│   │   │   └── ajustes.tsx
│   │   ├── reproductor.tsx     # (etapa 3)
│   │   ├── cola.tsx            # (etapa 4)
│   │   └── bienvenida.tsx      # (etapa 2)
│   ├── components/             # AppText, Screen, fila de canción, mini reproductor…
│   ├── theme/                  # colors.ts, typography.ts, spacing.ts, ThemeProvider.tsx
│   ├── storage/                # Ajustes guardados (MMKV)
│   ├── player/                 # Servicio de reproducción y cola (etapa 3)
│   ├── library/                # Búsqueda de música y metadatos (etapa 2)
│   ├── db/                     # SQLite: esquema y consultas (etapa 2)
│   ├── store/                  # Estado global (Zustand)
│   └── utils/
├── assets/images/              # Icono, pantalla de carga
├── docs/                       # Esta documentación
├── app.json                    # Configuración de Expo (nombre, paquete, icono, plugins)
├── eas.json                    # Perfiles de compilación (development, preview, production)
└── CHANGELOG.md
```

> Las carpetas `android/` e `ios/` **no** se guardan en el repositorio: Expo las genera al compilar (Continuous Native Generation). Toda la configuración nativa va en `app.json`.

## 4.3 Base de datos

**songs**
| Campo | Tipo | Nota |
|---|---|---|
| id | TEXT PK | ID del MediaStore |
| uri | TEXT | Ruta del archivo |
| title, artist, album | TEXT | |
| album_id | TEXT | Para agrupar los álbumes |
| duration_ms | INTEGER | |
| track_number | INTEGER | Orden dentro del álbum |
| artwork_path | TEXT | Carátula guardada en caché |
| date_added | INTEGER | |

**playlists**: `id`, `name`, `created_at`, `updated_at`
**playlist_songs**: `playlist_id`, `song_id`, `position`
**favorites**: `song_id`, `added_at`
**play_history**: `song_id`, `played_at` (para "Recientes" en el futuro)

## 4.4 Ajustes guardados (MMKV)

| Clave | Valores | Predeterminado |
|---|---|---|
| `theme` | `dark` / `light` / `system` | `dark` |
| `accentPreset` | `purple` / `blue` / `green` / `red` / `orange` / `pink` / `custom` | `purple` |
| `accentCustom` | hex | — |
| `excludedFolders` | lista de rutas | `[]` |
| `minDurationSec` | número | `30` |
| `pauseOnDisconnect` | booleano | `true` |
| `crossfadeSec` | 0–5 | `0` |
| `lastQueue`, `lastPosition` | — | Para reanudar donde se quedó |

## 4.5 Permisos de Android

| Permiso | Para qué |
|---|---|
| `READ_MEDIA_AUDIO` (Android 13+) / `READ_EXTERNAL_STORAGE` (≤12) | Leer la música |
| `FOREGROUND_SERVICE` y `FOREGROUND_SERVICE_MEDIA_PLAYBACK` | Seguir sonando en segundo plano |
| `POST_NOTIFICATIONS` (Android 13+) | Mostrar los controles en la notificación |
| `WAKE_LOCK` | Que no se corte con la pantalla apagada |

La app **no** pide el permiso de internet para nada propio.

## 4.6 Compilación y distribución

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
