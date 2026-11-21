# Registro de cambios

Todos los cambios importantes de Melarmonía se apuntan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado [SemVer](https://semver.org/lang/es/).

## [Sin publicar]

## [0.6.0] — Etapa 6: búsqueda

### Añadido
- Pestaña **Buscar** con resultados en vivo agrupados en Canciones, Artistas y Álbumes.
- Búsqueda sin mayúsculas ni tildes, con varias palabras y orden por relevancia.
- **Ver todos** en Canciones y Artistas.
- Búsquedas recientes (las 10 últimas), con opción de quitar una o borrarlas todas.
- Mensaje cuando no hay resultados.

## [0.5.0] — Etapa 5: favoritos y listas

### Añadido
- Favoritos: botón ❤ en el reproductor y en el menú ⋮; lista fija **Favoritos**.
- Listas de reproducción: crear, renombrar y borrar (con confirmación).
- Detalle de lista: reproducir, aleatorio, reordenar arrastrando y quitar deslizando.
- Pantalla **Añadir canciones** con buscador y selección múltiple.
- **Añadir a lista…** desde el menú ⋮, con opción de crear una lista nueva.
- Mosaico de 4 carátulas por lista.
- Tablas `favorites`, `playlists` y `playlist_songs` (migración 2).

## [0.4.0] — Etapa 4: cola de reproducción

### Añadido
- Pantalla **Cola** (desde el reproductor): "Reproduciendo ahora" y "A continuación".
- Reordenar arrastrando, quitar deslizando, tocar para saltar a una canción y **Vaciar**.
- Menú ⋮ en todas las canciones y en el reproductor: **Reproducir a continuación**, **Añadir a la cola**, **Ir al álbum** e **Ir al artista**.
- Botones ⋮ y **Cola** en el reproductor completo.
- Componente de hoja inferior reutilizable.

## [0.3.0] — Etapa 3: reproductor

### Añadido
- Reproducción con `expo-audio`: en segundo plano, con controles en la notificación y en la pantalla de bloqueo (título, artista, álbum y carátula).
- Botones de los auriculares y del Bluetooth; pausa al desconectarlos.
- Tocar una canción la reproduce y deja el resto de la lista a continuación.
- Botones **Reproducir** y **Aleatorio** en Canciones, álbumes y artistas.
- Mini reproductor fijo sobre el menú inferior, con barra de progreso.
- Reproductor completo: carátula grande, barra de progreso, aleatorio, repetir (desactivado / todas / una), deslizar la carátula para cambiar de canción y deslizar hacia abajo para cerrar.
- Ecualizador animado en la canción que suena.
- Aviso y salto a la siguiente si un archivo no se puede reproducir.
- Continuar donde te quedaste: la última cola y la posición se recuperan al abrir la app.

### Cambiado
- `expo-audio` sustituye a `react-native-track-player` en la arquitectura.
- La Biblioteca tiene su propia pila de pantallas, para que el menú inferior y el mini reproductor se vean en los detalles.
- Se pide el permiso de notificaciones (Android 13+) y se bloquea el de micrófono.

### Quitado del alcance de la 1.0
- Transición suave entre canciones y reanudar al conectar el Bluetooth: pasan a ideas futuras.

## [0.2.0] — Etapa 2: biblioteca de música

### Añadido
- Pantalla de bienvenida con el degradado de marca y la solicitud del permiso de música (incluido el caso de rechazo).
- Búsqueda de la música del teléfono: lectura de título, artista, álbum, pista, año y carátula.
- Base de datos SQLite de canciones; las búsquedas siguientes solo leen lo nuevo o modificado.
- Filtro de audios de menos de 30 s y de carpetas de notas de voz, grabaciones y tonos.
- Biblioteca con Canciones, Artistas y Álbumes; detalle de álbum y de artista.
- Orden de las canciones (nombre, artista, recientes, duración), índice A–Z y deslizar para actualizar.
- Actualización automática al abrir la app, al volver a ella y cuando cambian los audios del teléfono.
- Estados: buscando música, biblioteca vacía y canción sin carátula.

### Cambiado
- Solo se pide el permiso de audio; se bloquean los de fotos, vídeos y otros que no hacen falta.

## [0.1.0] — Etapa 1: base del proyecto

### Añadido
- Proyecto Expo SDK 58 con TypeScript y Expo Router.
- Sistema de temas: colores de la guía de diseño (oscuro y claro), colores de marca preparados y cálculo del color personalizado.
- Tipografía Poppins + Inter, escala de espaciado y bordes.
- Ajustes guardados con MMKV (tema y color).
- Menú inferior con 4 pestañas: Biblioteca, Buscar, Listas y Ajustes.
- Ajustes: selector de tema y vista de la paleta actual.
- Icono provisional y pantalla de carga con el degradado de marca.
- Configuración de EAS Build para generar APK, ESLint y Prettier.

## [0.0.0] — Etapa 0: documentación

### Añadido
- Documentación inicial: visión general, guía de diseño, pantallas y flujos, arquitectura técnica y manual de usuario.
- Plan del proyecto dividido en 10 etapas (`docs/06-plan-por-etapas.md`).
