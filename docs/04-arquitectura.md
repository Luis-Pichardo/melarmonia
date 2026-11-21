# 4. Arquitectura técnica

## 4.1 Tecnologías

| Área | Elección | Motivo |
|---|---|---|
| Framework | React Native + **Expo** (SDK más reciente) | Un solo código, compilación en la nube con EAS |
| Lenguaje | **TypeScript** | Menos errores y mejor autocompletado |
| Navegación | Expo Router | Navegación basada en archivos |
| Audio | `react-native-track-player` | Segundo plano, notificación, pantalla de bloqueo, Bluetooth |
| Lectura de la música | `expo-media-library` | Consulta el MediaStore de Android |
| Metadatos y carátulas | Módulo nativo para leer etiquetas (por definir al implementar) | Título, artista, álbum y carátula |
| Estado de la app | Zustand | Simple y ligero |
| Base de datos local | `expo-sqlite` | Canciones, listas, favoritos, historial |
| Ajustes | `react-native-mmkv` | Lectura instantánea al abrir la app |
| Listas largas | `@shopify/flash-list` | Fluidez con miles de canciones |
| Fuentes | `@expo-google-fonts/poppins`, `@expo-google-fonts/inter` | Tipografía de la guía de diseño |

> Como el reproductor usa módulos nativos, no funciona en Expo Go: se usa un **development build** (`expo-dev-client`).

## 4.2 Estructura de carpetas

```
melarmonia/
├── app/                    # Pantallas (Expo Router)
│   ├── (tabs)/
│   │   ├── biblioteca/
│   │   ├── buscar.tsx
│   │   ├── listas/
│   │   └── ajustes.tsx
│   ├── reproductor.tsx
│   ├── cola.tsx
│   └── bienvenida.tsx
├── src/
│   ├── components/         # Fila de canción, mini reproductor, tarjetas…
│   ├── theme/              # Colores, tipografía, espaciado (tokens de la guía)
│   ├── player/             # Servicio de reproducción y control de la cola
│   ├── library/            # Búsqueda de música y lectura de metadatos
│   ├── db/                 # SQLite: esquema y consultas
│   ├── store/              # Estado global (Zustand)
│   └── utils/
├── assets/                 # Icono, fuentes, ilustraciones
├── docs/                   # Esta documentación
└── CHANGELOG.md
```

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

- **Desarrollo:** `npx expo run:android` o un development build con EAS.
- **APK para instalar:** perfil `preview` de EAS Build, que genera un `.apk` descargable.
- **Versionado:** SemVer (`1.0.0`). Cada versión se apunta en `CHANGELOG.md`.
- **Identificador de la app:** `com.luispichardo.melarmonia` (por confirmar).
