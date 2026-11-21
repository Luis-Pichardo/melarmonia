# 2. Guía de diseño

## 2.1 Principios

- **La carátula manda.** Las portadas de los álbumes son el elemento visual más importante.
- **El morado es la identidad.** Aparece en botones, en la canción que suena y en los elementos activos, nunca en grandes fondos.
- **Pocos elementos por pantalla.** Mucho espacio y nada que distraiga.
- **Cómodo con una mano.** Los controles principales van en la mitad inferior de la pantalla.

## 2.2 Colores

### Color de marca (morado, valor por defecto)

| Nombre (token) | Hex | Muestra | Uso |
|---|---|---|---|
| `primary` | `#6B3FA0` | 🟪 | Botón de reproducir, barra de progreso, interruptores activos |
| `primaryDark` | `#4A2575` | 🟪 | Botón pulsado, inicio de los degradados, barra superior del tema claro |
| `primaryLight` | `#9B6FD6` | 🟪 | Iconos activos y texto destacado sobre fondo oscuro |
| `onPrimary` | `#FFFFFF` | ⬜ | Texto e iconos encima del morado |

**Degradado de marca:** de `#4A2575` a `#6B3FA0`, en diagonal. Se usa en el reproductor a pantalla completa y en la pantalla de bienvenida.

### Tema oscuro (predeterminado)

| Token | Hex | Uso |
|---|---|---|
| `background` | `#121016` | Fondo general |
| `surface` | `#1E1A26` | Tarjetas, mini reproductor, menús |
| `surfaceVariant` | `#2A2434` | Campo de búsqueda, chips, separadores |
| `textPrimary` | `#F2EEF7` | Títulos y texto principal |
| `textSecondary` | `#A99DB8` | Artista, duración, texto de ayuda |
| `accent` | `#9B6FD6` | Elementos activos (se usa `primaryLight`) |
| `divider` | `#2E2838` | Líneas divisorias |

### Tema claro

| Token | Hex | Uso |
|---|---|---|
| `background` | `#FAF8FC` | Fondo general |
| `surface` | `#FFFFFF` | Tarjetas, mini reproductor, menús |
| `surfaceVariant` | `#EFEAF5` | Campo de búsqueda, chips |
| `textPrimary` | `#1C1622` | Títulos y texto principal |
| `textSecondary` | `#6B6276` | Artista, duración, texto de ayuda |
| `accent` | `#6B3FA0` | Elementos activos (se usa `primary`) |
| `divider` | `#E4DEEC` | Líneas divisorias |

### Colores de estado (ambos temas)

| Token | Hex | Uso |
|---|---|---|
| `success` | `#3FA06B` | Confirmaciones ("Lista creada") |
| `warning` | `#E0A030` | Avisos |
| `error` | `#D9534F` | Errores ("No se pudo reproducir") |
| `favorite` | `#E0457B` | Corazón de favoritos |

### Personalización del color

En **Ajustes → Apariencia → Color**, el usuario puede elegir:

| Opción | `primary` | `primaryDark` | `primaryLight` |
|---|---|---|---|
| **Morado (predeterminado)** | `#6B3FA0` | `#4A2575` | `#9B6FD6` |
| Azul | `#2F6FD0` | `#1D4A94` | `#6FA0EC` |
| Verde | `#2E9E6A` | `#1E6E49` | `#62C996` |
| Rojo | `#C8394B` | `#8E2433` | `#E87584` |
| Naranja | `#E07A2E` | `#A6541A` | `#F2A66B` |
| Rosa | `#C9468F` | `#902E64` | `#E883BA` |
| Personalizado | Elegido con un selector | Calculado | Calculado |

**Reglas para el color personalizado:**
- `primaryDark` = el color elegido con un 30 % menos de luminosidad.
- `primaryLight` = el color elegido con un 25 % más de luminosidad.
- Si el texto blanco no se lee bien sobre el color elegido (contraste menor de 4.5:1), `onPrimary` pasa a ser `#1C1622`.
- Los fondos y los textos **no cambian** con el color: solo cambian los elementos de marca.

### Tema

En **Ajustes → Apariencia → Tema**: **Oscuro** (predeterminado), **Claro** o **Según el sistema**.

## 2.3 Tipografía

Fuente: **Poppins** para títulos e **Inter** para el texto. Las dos son gratuitas (Google Fonts).

| Estilo | Fuente | Tamaño | Peso | Uso |
|---|---|---|---|---|
| `display` | Poppins | 28 | SemiBold 600 | Título de la canción en el reproductor |
| `h1` | Poppins | 24 | SemiBold 600 | Títulos de pantalla |
| `h2` | Poppins | 18 | Medium 500 | Secciones, nombre de álbum o artista |
| `body` | Inter | 16 | Regular 400 | Título de canción en las listas |
| `bodySmall` | Inter | 14 | Regular 400 | Artista y álbum en las listas |
| `caption` | Inter | 12 | Medium 500 | Duraciones, contadores, etiquetas |

## 2.4 Espaciado y formas

**Escala de espaciado** (múltiplos de 4): `4 · 8 · 12 · 16 · 24 · 32 · 48`

| Elemento | Valor |
|---|---|
| Margen lateral de las pantallas | 16 |
| Separación entre secciones | 24 |
| Alto de una fila de canción | 64 |
| Carátula en las listas | 48 × 48, bordes de 8 |
| Carátula en las cuadrículas de álbumes | ancho completo de la celda, bordes de 12 |
| Carátula en el reproductor | 85 % del ancho de la pantalla, bordes de 16 |
| Botón de reproducir (reproductor) | círculo de 72 |
| Botón de reproducir (mini reproductor) | círculo de 40 |
| Área táctil mínima | 48 × 48 |

**Bordes redondeados:** 8 (pequeño) · 12 (tarjetas) · 16 (carátula grande, hojas inferiores) · círculo (botones de reproducir).

## 2.5 Iconos

- Librería: **Material Symbols Rounded** (incluida con Expo).
- Tamaño estándar: 24. En los controles del reproductor: 32. El de reproducir: 40.
- Color: `textSecondary` en reposo, `accent` cuando están activos.

| Acción | Icono |
|---|---|
| Reproducir / Pausa | `play_arrow` / `pause` |
| Anterior / Siguiente | `skip_previous` / `skip_next` |
| Aleatorio | `shuffle` |
| Repetir todas / una | `repeat` / `repeat_one` |
| Favorito | `favorite` / `favorite_border` |
| Cola | `queue_music` |
| Buscar | `search` |
| Más opciones | `more_vert` |
| Ajustes | `settings` |

## 2.6 Componentes

| Componente | Descripción |
|---|---|
| **Fila de canción** | Carátula 48 · título (`body`) · artista (`bodySmall`) · botón ⋮. Si es la canción que suena, el título va en `accent` y aparece un ecualizador animado en lugar de la carátula. |
| **Tarjeta de álbum** | Carátula cuadrada · nombre (`body`) · artista (`bodySmall`). Cuadrícula de 2 columnas. |
| **Fila de artista** | Imagen circular de 56 (la carátula de su primer álbum) · nombre · "N canciones". |
| **Mini reproductor** | Barra fija sobre el menú inferior: carátula 40, título y artista, botón de reproducir y barra de progreso fina (2 de alto) en `primary`. Al tocarla se abre el reproductor completo. |
| **Menú inferior** | 4 pestañas: Biblioteca · Buscar · Listas · Ajustes. Pestaña activa en `accent`. |
| **Hoja de opciones** | Panel que sube desde abajo, con bordes de 16, y opciones como "Añadir a lista", "Reproducir a continuación", "Ir al álbum"… |
| **Avisos (toasts)** | Mensaje breve en la parte inferior durante 2,5 s. |

## 2.7 Movimiento

- Duración de las transiciones: 200–300 ms, con desaceleración suave.
- El reproductor completo se abre deslizándose desde el mini reproductor y se cierra deslizando hacia abajo.
- El fondo del reproductor completo toma un color suave extraído de la carátula, mezclado con el degradado de marca.

## 2.8 Accesibilidad

- Contraste mínimo de 4.5:1 en el texto.
- Todos los botones con descripción para lectores de pantalla ("Reproducir", "Siguiente canción"…).
- La app respeta el tamaño de letra del sistema.

## 2.9 Icono de la app

- Fondo con el degradado de marca (`#4A2575` → `#6B3FA0`).
- En el centro, una nota musical blanca cuyo trazo forma una onda suave: la melodía y la armonía.
- Formato de icono adaptable de Android (fondo y figura por separado).
