# 3. Pantallas y flujos

## 3.1 Mapa de navegación

```
Bienvenida (solo la primera vez)
   └── Permiso de música
          └── Pestañas principales
                ├── Biblioteca ── Canciones / Artistas / Álbumes
                │                    ├── Detalle de artista
                │                    └── Detalle de álbum
                ├── Buscar
                ├── Listas ── Favoritos
                │              └── Detalle de lista
                └── Ajustes

Mini reproductor (siempre visible si hay música) ──► Reproductor completo ──► Cola
```

## 3.2 Pantallas

### Bienvenida
- Fondo con el degradado de marca, el logo y el texto "Tu música, sin interrupciones".
- Botón **Empezar**, que pide el permiso de acceso a la música.
- Si el usuario rechaza el permiso, aparece una explicación y los botones **Abrir ajustes** y **Ya lo activé**.
- Si más adelante se retira el permiso, la app vuelve a esta pantalla.

### Biblioteca
- Título "Biblioteca" y tres pestañas superiores: **Canciones · Artistas · Álbumes**.
- **Canciones**: lista en orden alfabético, con letras rápidas a la derecha para saltar (A–Z) y el total de canciones arriba. Los botones **▶ Reproducir todo** y **🔀 Aleatorio** se añaden en la etapa 3.
- **Artistas**: lista de artistas con letras rápidas A–Z. Al tocar uno se abre su detalle: sus álbumes en una fila horizontal y sus canciones.
- **Álbumes**: cuadrícula de 2 columnas. Al tocar uno se abre su detalle: carátula grande, año, número de canciones, duración total y las canciones con su número de pista. Tocar el nombre del artista abre su detalle.
- Orden de las canciones con el botón ⇅: por nombre, por artista, añadidas recientemente o por duración. La app recuerda el orden elegido.
- Deslizar hacia abajo vuelve a buscar música nueva. Además, la app busca sola al abrirse, al volver a ella y cuando Android avisa de audios nuevos o borrados.

### Buscar
- Campo de búsqueda redondeado, con el teclado abierto al entrar en la pestaña y un botón × para borrar.
- Resultados agrupados en **Canciones** (primeras 20), **Artistas** (primeros 5) y **Álbumes** (fila horizontal), con el total de cada grupo y **Ver todos** para mostrar el resto. Se actualizan mientras se escribe.
- Sin distinguir mayúsculas ni tildes, y con varias palabras ("juan café"). Primero aparece lo que empieza por el texto buscado.
- Tocar una canción reproduce los resultados empezando por ella ("Reproduciendo desde: Búsqueda: «texto»"). Tocar un artista o un álbum abre su detalle.
- Sin texto escrito: las 10 **búsquedas recientes**, que se quitan con × o todas con **Borrar**. Se guardan al tocar un resultado o al pulsar buscar en el teclado.

### Listas
- Arriba, el botón **+ Nueva lista**. Debajo, la lista fija **❤ Favoritos** (degradado de marca con un corazón) y las listas del usuario, con un mosaico de 4 carátulas y "N canciones", de la más reciente a la más antigua.
- **Detalle de lista**: mosaico grande, nombre, número de canciones y duración total. Tiene **Reproducir**, **Aleatorio** y **Añadir canciones**; se reordena manteniendo pulsado o arrastrando desde ≡, y se quitan canciones deslizándolas. Desde ⋮ (arriba a la derecha) se puede añadir canciones, renombrar o borrar la lista, con confirmación.
- **Detalle de Favoritos**: igual, pero sin reordenar, renombrar ni borrar. Deslizar una canción la quita de favoritos.
- **Añadir canciones**: todas las canciones con buscador y casillas. Las que ya están en la lista aparecen marcadas y atenuadas. El botón de abajo dice cuántas se van a añadir.

### Ajustes
| Sección | Opciones |
|---|---|
| Apariencia | Tema (oscuro / claro / sistema) · Color (preestablecidos o personalizado) |
| Biblioteca | Buscar música de nuevo · Carpetas excluidas (por ejemplo, notas de voz de WhatsApp) · Ignorar audios de menos de 30 s |
| Reproducción | Pausa al desconectar los auriculares (siempre activa, la gestiona Android) |
| Acerca de | Versión · Manual de usuario · Licencias |

### Mini reproductor
- Fijo sobre el menú inferior, también en los detalles de álbum y artista.
- Carátula, título, artista, botón de reproducir/pausar, botón siguiente y barra de progreso fina.
- Tocarlo abre el reproductor completo.

### Reproductor completo
De arriba abajo:
1. Botón ⌄ (cerrar), "Reproduciendo desde: *Todas las canciones, nombre del álbum o del artista*" y botón ⋮ (menú de la canción).
2. Carátula grande. Se desliza a izquierda o derecha para cambiar de canción.
3. Título (`display`), artista y botón ❤ (en color `favorite` cuando está marcado).
4. Barra de progreso, con el tiempo transcurrido y el total.
5. Controles: 🔀 · ⏮ · **▶/⏸** · ⏭ · 🔁. El aleatorio y la repetición activos se ven en `accent` con un punto debajo.
6. Botón **Cola** abajo a la derecha.
- Fondo: degradado de `primaryDark` a `background`.
- Deslizar hacia abajo en cualquier parte cierra el reproductor.

### Cola
- Se abre con el botón **Cola** del reproductor completo.
- "Reproduciendo ahora" arriba (con el origen) y, debajo, "A continuación" con el número de canciones.
- Se reordena manteniendo pulsada una canción o arrastrando desde ≡.
- Se quitan canciones deslizándolas hacia un lado.
- Tocar una canción salta directamente a ella.
- **Vaciar** quita todo lo que queda por sonar.
- La canción que suena no se puede mover ni quitar.

### Menú ⋮ de una canción
Hoja inferior con la carátula, el título, el artista y el álbum, y estas opciones:
- **Reproducir a continuación**
- **Añadir a la cola**
- **Añadir a favoritos** / **Quitar de favoritos**
- **Añadir a lista…**: abre la hoja con **Nueva lista** y las listas existentes
- **Ir al álbum**
- **Ir al artista**

Está en todas las filas de canción y en el reproductor completo.

## 3.3 Flujos principales

**Primera vez:** abrir la app → Bienvenida → Empezar → dar el permiso → la biblioteca se carga → tocar una canción → suena, y aparece el mini reproductor.

**Crear una lista:** Listas → + Nueva lista → escribir el nombre → Crear → se abre la lista → Añadir canciones (selección múltiple) → Añadir N canciones.

**Añadir una canción a una lista desde cualquier sitio:** ⋮ en la canción → Añadir a lista… → elegir una lista o **Nueva lista** (se crea y se añade la canción).

**Marcar como favorita:** ❤ en el reproductor, o ⋮ → Añadir a favoritos.

**Cambiar el color:** Ajustes → Apariencia → Color → elegir uno → la app cambia al momento.

## 3.4 Estados especiales

| Situación | Qué ve el usuario |
|---|---|
| Biblioteca vacía | Ilustración, "No encontramos música en tu teléfono" y el botón **Buscar de nuevo** |
| Buscando música | Barra de progreso y "Buscando tu música… (N canciones)" |
| Búsqueda sin resultados | "Nada coincide con «texto»" |
| Archivo dañado o borrado | Aviso "No se pudo reproducir esta canción" y salto a la siguiente |
| Lista vacía | "Esta lista está vacía" y el botón **Añadir canciones** |
| Canción sin carátula | Fondo `surfaceVariant` con una nota musical en `accent` |
