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
- Si el usuario rechaza el permiso, aparece una explicación y el botón **Abrir ajustes**.

### Biblioteca
- Título "Biblioteca" y tres pestañas superiores: **Canciones · Artistas · Álbumes**.
- **Canciones**: lista en orden alfabético, con letras rápidas a la derecha para saltar (A–Z). Arriba, los botones **▶ Reproducir todo** y **🔀 Aleatorio**.
- **Artistas**: lista de artistas. Al tocar uno se abre su detalle (sus álbumes y sus canciones).
- **Álbumes**: cuadrícula de 2 columnas. Al tocar uno se abre su detalle (carátula grande y canciones en orden).
- Orden configurable con el botón ⇅: por nombre, por artista, por fecha de añadido o por duración.
- Deslizar hacia abajo vuelve a buscar música nueva.

### Buscar
- Campo de búsqueda con el teclado abierto al entrar.
- Resultados agrupados en **Canciones**, **Artistas** y **Álbumes**, que se actualizan mientras se escribe.
- Sin texto escrito, muestra las búsquedas recientes.

### Listas
- Arriba, la lista fija **❤ Favoritos**.
- Debajo, las listas del usuario, con un mosaico de 4 carátulas y "N canciones".
- Botón **+ Nueva lista**.
- Detalle de lista: reproducir, aleatorio, reordenar arrastrando, quitar canciones, y renombrar o borrar desde ⋮.

### Ajustes
| Sección | Opciones |
|---|---|
| Apariencia | Tema (oscuro / claro / sistema) · Color (preestablecidos o personalizado) |
| Biblioteca | Buscar música de nuevo · Carpetas excluidas (por ejemplo, notas de voz de WhatsApp) · Ignorar audios de menos de 30 s |
| Reproducción | Pausar al desconectar los auriculares · Reanudar al conectar el Bluetooth · Transición suave entre canciones (0–5 s) |
| Acerca de | Versión · Manual de usuario · Licencias |

### Reproductor completo
De arriba abajo:
1. Botón ⌄ (cerrar), "Reproduciendo desde: *nombre de la lista o del álbum*" y botón ⋮.
2. Carátula grande. Se desliza a izquierda o derecha para cambiar de canción.
3. Título (`display`), artista y botón ❤.
4. Barra de progreso, con el tiempo transcurrido y el total.
5. Controles: 🔀 · ⏮ · **▶/⏸** · ⏭ · 🔁
6. Botón **Cola** abajo a la derecha.

### Cola
- "Reproduciendo ahora" arriba y, debajo, "A continuación".
- Se reordena arrastrando y se quitan canciones deslizándolas hacia un lado.

## 3.3 Flujos principales

**Primera vez:** abrir la app → Bienvenida → Empezar → dar el permiso → la biblioteca se carga → tocar una canción → suena, y aparece el mini reproductor.

**Crear una lista:** Listas → + Nueva lista → escribir el nombre → Crear → abrir la lista → Añadir canciones (selección múltiple) → Listo.

**Añadir una canción a una lista desde cualquier sitio:** ⋮ en la canción → Añadir a lista → elegir una lista (o crear una nueva).

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
