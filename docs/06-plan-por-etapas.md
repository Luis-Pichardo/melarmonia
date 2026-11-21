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
| 1 | Base del proyecto | ⏳ Pendiente |
| 2 | Biblioteca de música | ⏳ Pendiente |
| 3 | Reproductor | ⏳ Pendiente |
| 4 | Cola de reproducción | ⏳ Pendiente |
| 5 | Favoritos y listas | ⏳ Pendiente |
| 6 | Búsqueda | ⏳ Pendiente |
| 7 | Ajustes y personalización | ⏳ Pendiente |
| 8 | Pulido visual y rendimiento | ⏳ Pendiente |
| 9 | Pruebas y lanzamiento 1.0 | ⏳ Pendiente |

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

## Etapa 1 — Base del proyecto

**Objetivo:** tener el proyecto funcionando en el teléfono, con la estructura, los temas y la navegación vacía.

- [ ] Crear el proyecto Expo con TypeScript y Expo Router
- [ ] Configurar el development build (`expo-dev-client`) y EAS Build (perfil `preview` para APK)
- [ ] Crear la estructura de carpetas según la arquitectura
- [ ] Configurar ESLint y Prettier
- [ ] Añadir las fuentes Poppins e Inter
- [ ] Crear `src/theme/`: tokens de colores (temas oscuro y claro), tipografía y espaciado de la guía de diseño
- [ ] Crear el proveedor de tema (oscuro / claro / sistema) con el morado como color principal
- [ ] Crear el menú inferior con las 4 pestañas vacías: Biblioteca, Buscar, Listas, Ajustes
- [ ] Icono provisional y pantalla de carga (splash) con el degradado de marca
- [ ] Identificador de la app: `com.luispichardo.melarmonia`

**Entregable:** un APK que se instala y abre, con las 4 pestañas y el tema oscuro morado.
**Aceptación:** la app abre sin errores, se navega entre pestañas y los colores coinciden con la guía.

---

## Etapa 2 — Biblioteca de música

**Objetivo:** que la app encuentre y muestre toda la música del teléfono.

- [ ] Pantalla de bienvenida y solicitud del permiso de audio (incluido el caso de rechazo)
- [ ] Búsqueda de canciones en el MediaStore de Android
- [ ] Lectura de metadatos (título, artista, álbum, número de pista) y de las carátulas
- [ ] Base de datos SQLite (`songs`) y caché de carátulas
- [ ] Filtro de audios de menos de 30 s y de carpetas excluidas
- [ ] Pestaña Biblioteca con las secciones Canciones, Artistas y Álbumes
- [ ] Componentes: fila de canción, fila de artista y tarjeta de álbum
- [ ] Detalle de artista y detalle de álbum
- [ ] Orden (nombre, artista, fecha, duración) y saltos rápidos A–Z
- [ ] Deslizar hacia abajo para actualizar
- [ ] Estados: buscando música, biblioteca vacía, canción sin carátula

**Entregable:** APK que muestra toda la música del teléfono, organizada.
**Aceptación:** aparecen todas las canciones del teléfono con sus datos y carátulas, y la lista se desplaza con fluidez aunque haya miles.

---

## Etapa 3 — Reproductor

**Objetivo:** escuchar música, también con la pantalla apagada.

- [ ] Instalar y configurar `react-native-track-player` y su servicio en segundo plano
- [ ] Tocar una canción reproduce esa canción y deja las demás a continuación
- [ ] Botones de reproducir todo y aleatorio
- [ ] Mini reproductor fijo con barra de progreso
- [ ] Reproductor completo: carátula, título, artista, barra de progreso y controles
- [ ] Aleatorio y repetir (desactivado / todas / una)
- [ ] Deslizar la carátula para cambiar de canción y deslizar hacia abajo para cerrar
- [ ] Controles en la notificación y en la pantalla de bloqueo
- [ ] Botones de los auriculares y del Bluetooth, y pausa al desconectarlos
- [ ] Indicador animado en la canción que suena
- [ ] Manejo de archivos dañados o borrados (aviso y salto a la siguiente)
- [ ] Recordar la última canción y la posición al reabrir la app

**Entregable:** APK que reproduce música completa en segundo plano.
**Aceptación:** la música sigue con la pantalla apagada y se controla desde la notificación y los auriculares.

---

## Etapa 4 — Cola de reproducción

- [ ] Pantalla de cola: "Reproduciendo ahora" y "A continuación"
- [ ] Reordenar arrastrando
- [ ] Quitar canciones deslizando
- [ ] Opciones "Reproducir a continuación" y "Añadir a la cola" en el menú ⋮
- [ ] Hoja de opciones (⋮) reutilizable para las canciones

**Entregable y aceptación:** se puede ver y modificar lo que va a sonar, y los cambios se reflejan al instante.

---

## Etapa 5 — Favoritos y listas

- [ ] Tablas `playlists`, `playlist_songs` y `favorites`
- [ ] Botón ❤ en el reproductor y en el menú ⋮
- [ ] Lista fija "Favoritos"
- [ ] Crear, renombrar y borrar listas
- [ ] Añadir canciones (selección múltiple) y desde el menú ⋮
- [ ] Reordenar y quitar canciones de una lista
- [ ] Mosaico de 4 carátulas por lista
- [ ] Estado de lista vacía

**Entregable y aceptación:** las listas y los favoritos se crean, se modifican y se conservan al cerrar la app.

---

## Etapa 6 — Búsqueda

- [ ] Pestaña Buscar con el teclado abierto al entrar
- [ ] Resultados en vivo agrupados en Canciones, Artistas y Álbumes
- [ ] Búsqueda sin distinguir mayúsculas ni tildes ("cancion" encuentra "Canción")
- [ ] Búsquedas recientes
- [ ] Estado sin resultados

**Entregable y aceptación:** cualquier canción, artista o álbum se encuentra en menos de un segundo.

---

## Etapa 7 — Ajustes y personalización

- [ ] Pantalla de ajustes con secciones
- [ ] Tema: oscuro, claro o según el sistema
- [ ] Colores preparados: morado, azul, verde, rojo, naranja y rosa
- [ ] Color personalizado con selector, cálculo de los tonos oscuro y claro y control de contraste
- [ ] Biblioteca: buscar música de nuevo, carpetas excluidas y duración mínima
- [ ] Reproducción: pausar al desconectar, reanudar con Bluetooth y transición suave
- [ ] Acerca de: versión, enlace al manual y licencias
- [ ] Guardado de ajustes con MMKV

**Entregable y aceptación:** el tema y el color cambian al instante en toda la app y se conservan al reabrirla.

---

## Etapa 8 — Pulido visual y rendimiento

- [ ] Animaciones y transiciones (200–300 ms)
- [ ] Fondo del reproductor con un color tomado de la carátula
- [ ] Icono final de la app (adaptable) y pantalla de carga final
- [ ] Ilustraciones de los estados vacíos
- [ ] Accesibilidad: descripciones para el lector de pantalla, contraste y tamaño de letra del sistema
- [ ] Pruebas de rendimiento con más de 5.000 canciones
- [ ] Revisión del consumo de batería en segundo plano

**Entregable y aceptación:** la app se ve terminada y funciona con fluidez en teléfonos de gama media.

---

## Etapa 9 — Pruebas y lanzamiento 1.0

- [ ] Pruebas en varios teléfonos y versiones de Android (8, 11, 13, 14 o superior)
- [ ] Corrección de errores encontrados
- [ ] Capturas de pantalla añadidas al manual de usuario
- [ ] Revisión final de toda la documentación
- [ ] Clave de firma del APK (guardada fuera del repositorio)
- [ ] Versión `1.0.0` en la app y en el `CHANGELOG.md`
- [ ] Publicación en GitHub Releases con el APK descargable

**Entregable:** `Melarmonia-1.0.0.apk` publicado y listo para compartir.
