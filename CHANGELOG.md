# Registro de cambios

Todos los cambios importantes de Melarmonía se apuntan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado [SemVer](https://semver.org/lang/es/).

## [Sin publicar]

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
