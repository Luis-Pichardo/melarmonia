# 6. Plan por etapas

El proyecto se construye en **etapas independientes**. Cada etapa se empieza **solo cuando Luis lo indica** (por ejemplo: *"empieza la etapa 2"*), y no se pasa a la siguiente hasta que la actual está revisada y aprobada.

## Cómo trabajamos cada etapa

1. Luis indica qué etapa empezar.
2. Se crea una rama `etapa-N-nombre` (por ejemplo, `etapa-1-base`).
3. Se completan las tareas de la etapa y se marcan en este archivo (`[x]`).
4. Se actualizan la documentación afectada y el `CHANGELOG.md`.
5. Se abre un **pull request** con el resumen de lo hecho y cómo probarlo.
6. Luis revisa y prueba el APK de la etapa. Si todo está bien, se aprueba y se une a `main`.

## Resumen

| Etapa | Nombre | Estado |
|---|---|---|
| 0 | Documentación | ✅ Completada |
| 1 | Base del proyecto | ✅ Completada |
| 2 | Biblioteca de música | ✅ Completada |
| 3 | Reproductor | ✅ Completada |
| 4 | Cola de reproducción | ✅ Completada |
| 5 | Favoritos y listas | ✅ Completada |
| 6 | Búsqueda | ✅ Completada |
| 7 | Ajustes y personalización | ✅ Completada |
| 8 | Pulido visual y rendimiento | ✅ Completada |
| 9 | Pruebas y lanzamiento 1.0 | 🚧 En curso: faltan las pruebas en el teléfono |

Estados: ⏳ Pendiente · 🚧 En curso · 👀 En revisión · ✅ Completada

---

## Etapa 0 — Documentación ✅

- [x] Visión general
- [x] Guía de diseño (colores, tipografía, espaciados, iconos, componentes)
- [x] Pantallas y flujos
- [x] Arquitectura técnica
- [x] Manual de usuario
- [x] Registro de cambios
- [x] Plan por etapas (este archivo)

---

## Etapa 1 — Base del proyecto ✅

**Objetivo:** tener el proyecto funcionando en el teléfono, con la estructura, los temas y la navegación vacía.

- [x] Crear el proyecto Expo con TypeScript y Expo Router
- [x] Configurar el development build (`expo-dev-client`) y EAS Build (perfil `preview` para APK)
- [x] Crear la estructura de carpetas según la arquitectura
- [x] Configurar ESLint y Prettier
- [x] Añadir las fuentes Poppins e Inter
- [x] Crear `src/theme/`: tokens de colores (temas oscuro y claro), tipografía y espaciado de la guía de diseño
- [x] Crear el proveedor de tema (oscuro / claro / sistema) con el morado como color principal
- [x] Crear el menú inferior con las 4 pestañas vacías: Biblioteca, Buscar, Listas, Ajustes
- [x] Icono provisional y pantalla de carga (splash) con el degradado de marca
- [x] Identificador de la app: `com.luispichardo.melarmonia`

**Entregable:** un APK que se instala y abre, con las 4 pestañas y el tema oscuro morado.
**Aceptación:** la app abre sin errores, se navega entre pestañas y los colores coinciden con la guía.

**Notas de la etapa:**
- Expo SDK 58. Las pantallas están en `src/app/` (la estructura recomendada por Expo).
- Ajustes ya permite cambiar entre tema oscuro, claro y sistema, y muestra la paleta activa para comprobar los colores. El resto de los ajustes llega en la etapa 7.
- El sistema de color personalizado (cálculo de tonos y contraste) ya está en `src/theme/colors.ts`; su pantalla llega en la etapa 7.
- El APK se genera con `npm run build:apk` (requiere una cuenta gratuita de Expo).

---

## Etapa 2 — Biblioteca de música ✅

**Objetivo:** que la app encuentre y muestre toda la música del teléfono.

- [x] Pantalla de bienvenida y solicitud del permiso de audio (incluido el caso de rechazo)
- [x] Búsqueda de canciones en el MediaStore de Android
- [x] Lectura de metadatos (título, artista, álbum, número de pista) y de las carátulas
- [x] Base de datos SQLite (`songs`) y caché de carátulas
- [x] Filtro de audios de menos de 30 s y de carpetas excluidas
- [x] Pestaña Biblioteca con las secciones Canciones, Artistas y Álbumes
- [x] Componentes: fila de canción, fila de artista y tarjeta de álbum
- [x] Detalle de artista y detalle de álbum
- [x] Orden (nombre, artista, fecha, duración) y saltos rápidos A–Z
- [x] Deslizar hacia abajo para actualizar
- [x] Estados: buscando música, biblioteca vacía, canción sin carátula

**Entregable:** APK que muestra toda la música del teléfono, organizada.
**Aceptación:** aparecen todas las canciones del teléfono con sus datos y carátulas, y la lista se desplaza con fluidez aunque haya miles.

**Notas de la etapa:**
- Metadatos y carátulas con `@missingcore/react-native-metadata-retriever` (lector nativo de Android). Se extrae una carátula por álbum.
- Las búsquedas siguientes solo leen archivos nuevos o modificados.
- La app vuelve a buscar sola al abrirse, al volver a ella y cuando Android avisa de cambios.
- Las carpetas excluidas tienen una lista predeterminada (WhatsApp, Telegram, grabaciones, tonos…); la pantalla para editarla llega en la etapa 7.
- Tocar una canción todavía no la reproduce (etapa 3). El botón ⋮ se activa en la etapa 4.
- Solo se pide el permiso de audio; los de fotos y vídeos se bloquean.

---

## Etapa 3 — Reproductor ✅

**Objetivo:** escuchar música, también con la pantalla apagada.

- [x] Configurar la reproducción en segundo plano con `expo-audio` (`AudioPlaylist`)
- [x] Botones **▶ Reproducir todo** y **🔀 Aleatorio** en Canciones, álbumes y artistas
- [x] Tocar una canción reproduce esa canción y deja las demás a continuación
- [x] Mini reproductor fijo con barra de progreso
- [x] Reproductor completo: carátula, título, artista, barra de progreso y controles
- [x] Aleatorio y repetir (desactivado / todas / una)
- [x] Deslizar la carátula para cambiar de canción y deslizar hacia abajo para cerrar
- [x] Controles en la notificación y en la pantalla de bloqueo
- [x] Botones de los auriculares y del Bluetooth, y pausa al desconectarlos
- [x] Indicador animado en la canción que suena
- [x] Manejo de archivos dañados o borrados (aviso y salto a la siguiente)
- [x] Recordar la última canción y la posición al reabrir la app

**Entregable:** APK que reproduce música completa en segundo plano.
**Aceptación:** la música sigue con la pantalla apagada y se controla desde la notificación y los auriculares.

**Notas de la etapa:**
- Se usa `expo-audio` en lugar de `react-native-track-player`: es la librería oficial de Expo y la otra da problemas con la arquitectura nueva de React Native (ver arquitectura, 4.1).
- Las pantallas de la Biblioteca pasan a una pila propia dentro de la pestaña, para que el menú inferior y el mini reproductor sigan visibles en los detalles.
- La pausa al desconectar los auriculares la hace Android y está siempre activa.
- El botón ❤ (etapa 5) y los botones ⋮ y Cola (etapa 4) se añaden en sus etapas.
- Hace falta un APK nuevo: esta etapa añade módulos nativos y el permiso de notificaciones.

---

## Etapa 4 — Cola de reproducción ✅

- [x] Pantalla de cola: "Reproduciendo ahora" y "A continuación"
- [x] Botón **Cola** y botón ⋮ en el reproductor completo
- [x] Reordenar arrastrando
- [x] Quitar canciones deslizando
- [x] Opciones "Reproducir a continuación" y "Añadir a la cola" en el menú ⋮
- [x] Hoja de opciones (⋮) reutilizable para las canciones

**Entregable y aceptación:** se puede ver y modificar lo que va a sonar, y los cambios se reflejan al instante.

**Notas de la etapa:**
- Reordenar con `react-native-reorderable-list`; quitar deslizando con `ReanimatedSwipeable`.
- Extras: tocar una canción de la cola salta a ella, y **Vaciar** quita lo que queda por sonar.
- El menú ⋮ también incluye **Ir al álbum** e **Ir al artista**. Favoritos y listas se suman en la etapa 5.
- Los cambios en la cola no cortan la canción que suena, que no se puede mover ni quitar.
- Las hojas inferiores comparten el componente `BottomSheet`.

---

## Etapa 5 — Favoritos y listas ✅

- [x] Tablas `playlists`, `playlist_songs` y `favorites`
- [x] Botón ❤ en el reproductor y "Añadir a favoritos" / "Añadir a lista" en el menú ⋮
- [x] Lista fija "Favoritos"
- [x] Crear, renombrar y borrar listas
- [x] Añadir canciones (selección múltiple) y desde el menú ⋮
- [x] Reordenar y quitar canciones de una lista
- [x] Mosaico de 4 carátulas por lista
- [x] Estado de lista vacía

**Entregable y aceptación:** las listas y los favoritos se crean, se modifican y se conservan al cerrar la app.

**Notas de la etapa:**
- La pestaña Listas tiene su propia pila: índice, detalle (`/listas/[id]`, con `favoritos` como id fijo) y añadir canciones.
- Añadir canciones tiene buscador y marca las que ya están en la lista.
- Una canción no se repite en la misma lista. Borrar una lista pide confirmación.
- Las canciones que ya no están en el teléfono no se muestran, pero se conservan.
- Se reutiliza la fila arrastrable de la cola (`DraggableSongRow`).

---

## Etapa 6 — Búsqueda ✅

- [x] Pestaña Buscar con el teclado abierto al entrar
- [x] Resultados en vivo agrupados en Canciones, Artistas y Álbumes
- [x] Búsqueda sin distinguir mayúsculas ni tildes ("cancion" encuentra "Canción")
- [x] Búsquedas recientes
- [x] Estado sin resultados

**Entregable y aceptación:** cualquier canción, artista o álbum se encuentra en menos de un segundo.

**Notas de la etapa:**
- Búsqueda en memoria: menos de 1 ms por búsqueda con 8.000 canciones (prueba de rendimiento).
- Admite varias palabras y ordena primero lo que empieza por el texto buscado.
- **Ver todos** en Canciones (a partir de 20) y Artistas (a partir de 5).
- Tocar una canción reproduce los resultados de la búsqueda.

---

## Etapa 7 — Ajustes y personalización ✅

- [x] Pantalla de ajustes con secciones
- [x] Tema: oscuro, claro o según el sistema
- [x] Colores preparados: morado, azul, verde, rojo, naranja y rosa
- [x] Color personalizado con selector, cálculo de los tonos oscuro y claro y control de contraste
- [x] Biblioteca: buscar música de nuevo, carpetas excluidas y duración mínima
- [x] Reproducción: información sobre la pausa al desconectar los auriculares (siempre activa)
- [x] Acerca de: versión, enlace al manual y licencias
- [x] Guardado de ajustes con MMKV

**Entregable y aceptación:** el tema y el color cambian al instante en toda la app y se conservan al reabrirla.

**Notas de la etapa:**
- Selector de color propio con tono, saturación, luminosidad y código, y vista previa en vivo. No hace falta otra librería: usa el slider que ya teníamos.
- Carpetas excluidas: además de escribir reglas, se puede excluir con un toque cualquier carpeta que tenga música.
- Duración mínima elegible: Todas, 15, 30 o 60 s.
- El manual se abre en GitHub (el repositorio es público).
- Cambiar las exclusiones o la duración vuelve a buscar la música.

---

## Etapa 8 — Pulido visual y rendimiento ✅

- [x] Animaciones y transiciones (200–300 ms)
- [x] Fondo del reproductor con un color tomado de la carátula
- [x] Icono final de la app (adaptable) y pantalla de carga final
- [x] Ilustraciones de los estados vacíos
- [x] Accesibilidad: descripciones para el lector de pantalla, contraste y tamaño de letra del sistema
- [x] Pruebas de rendimiento con más de 5.000 canciones
- [x] Revisión del consumo de batería en segundo plano

**Entregable y aceptación:** la app se ve terminada y funciona con fluidez en teléfonos de gama media.

**Notas de la etapa:**
- Fondo del reproductor con el color medio de la carátula (`expo-image-manipulator` + `pako`), guardado en caché.
- Logo e icono final: una "m" de melodía con el eco de la armonía y una nota musical (elegido entre tres propuestas). Versión adaptable, monocroma, pantalla de carga y bienvenida.
- Mini reproductor con animación de entrada; el ecualizador respeta "Quitar animaciones".
- Estados vacíos con ilustración (halo, degradado de marca y notas).
- Tamaño de letra del sistema respetado hasta 1,4×.
- Rendimiento medido con 5.000 y 10.000 canciones (arquitectura, 4.4).
- Batería: el progreso se informa cada 1 s en lugar de 0,5 s.
- **Pendiente para la etapa 9:** medir en un teléfono real el consumo de batería y la fluidez.

---

## Etapa 9 — Pruebas y lanzamiento 1.0 🚧

**Hecho por Claude:**
- [x] Pruebas automáticas (25 pruebas con Jest) y comprobaciones en GitHub en cada pull request
- [x] Lista de pruebas en el teléfono ([Pruebas](08-pruebas.md))
- [x] Revisión final de toda la documentación
- [x] Guía de publicación: APK, clave de firma, versiones y GitHub Releases ([Publicación](07-publicacion.md))
- [x] Versión `1.0.0` (`versionCode` 10) en la app y en el `CHANGELOG.md`
- [x] Borrador de la publicación 1.0.0 en GitHub, con las notas

**Pendiente de Luis (necesita el teléfono):**
- [ ] Generar el APK con `npm run build:release` y crear la clave de firma (EAS)
- [ ] Copia de seguridad de la clave de firma, fuera del repositorio
- [ ] Pruebas en el teléfono siguiendo la lista (idealmente Android 13+ y Android 12 o inferior)
- [ ] Corrección de errores encontrados (Claude, con la lista de problemas)
- [ ] Capturas de pantalla para el manual (Claude las añade al manual)
- [ ] Subir el APK al borrador de la publicación y publicarlo

**Entregable:** `Melarmonia-1.0.0.apk` publicado y listo para compartir.
