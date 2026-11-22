# 8. Pruebas

## 8.1 Pruebas automáticas

Se ejecutan con `npm test` y en GitHub en cada pull request (junto a los tipos y el estilo del código).

| Archivo | Qué comprueba |
|---|---|
| `src/__tests__/text.test.ts` | Orden sin tildes, índice A–Z, duraciones y plurales |
| `src/__tests__/search.test.ts` | Búsqueda sin tildes ni mayúsculas, varias palabras, orden por relevancia |
| `src/__tests__/selectors.test.ts` | Orden de canciones y pistas, álbumes, artistas e índice A–Z |
| `src/__tests__/colors.test.ts` | Contraste de los textos, color personalizado, conversión HSL ↔ hex |
| `src/__tests__/shuffle.test.ts` | El aleatorio empieza por la canción elegida y no pierde ninguna |
| `src/__tests__/png.test.ts` | Color medio de una carátula (filtros PNG y transparencia) |

## 8.2 Pruebas en el teléfono

Las que no se pueden automatizar: permisos, audio real, segundo plano, Bluetooth y batería.

**Cómo usar esta lista:** instala el APK (`npm run build:apk`), sigue los pasos en orden y marca cada punto. Si algo falla, apunta en la tabla del final qué pasó, en qué teléfono y cómo repetirlo.

### Teléfonos

| Teléfono | Android | Probado por | Fecha |
|---|---|---|---|
| | | | |
| | | | |

Si se puede, prueba con un Android 13 o superior y con uno de Android 12 o inferior: los permisos cambian entre ellos.

### A. Instalación y primer inicio
- [ ] El APK se instala (aceptando "orígenes desconocidos" y Play Protect).
- [ ] El icono y el nombre **Melarmonía** se ven bien en la pantalla de inicio (prueba también los iconos temáticos, si los tienes).
- [ ] La pantalla de carga muestra el logo sobre el morado.
- [ ] La bienvenida pide **solo** el permiso de música y audio.
- [ ] Al rechazar el permiso aparecen "Abrir ajustes" y "Ya lo activé", y funcionan.

### B. Biblioteca
- [ ] Aparecen todas las canciones esperadas, con título, artista y carátula. Anota cuántas canciones y cuánto tardó la primera vez: ____ canciones, ____ s.
- [ ] No aparecen notas de voz de WhatsApp, tonos ni grabaciones.
- [ ] Al abrirla por segunda vez, la app carga al instante.
- [ ] Canciones, Artistas y Álbumes se desplazan con fluidez.
- [ ] El índice A–Z salta a la letra correcta.
- [ ] Los cuatro órdenes funcionan, y la app recuerda el elegido al reabrirla.
- [ ] Al descargar una canción nueva y volver a la app, aparece sola (o al deslizar hacia abajo).
- [ ] El detalle de álbum muestra las pistas en orden, y el de artista, sus álbumes y canciones.

### C. Reproducción
- [ ] Tocar una canción la reproduce, y al terminar sigue la siguiente.
- [ ] **Reproducir** y **Aleatorio** funcionan en Canciones, álbumes, artistas y listas.
- [ ] El mini reproductor aparece y abre el reproductor completo.
- [ ] Pausa, anterior (vuelve al inicio si van más de 3 s), siguiente y barra de progreso.
- [ ] Aleatorio y repetir (todas / una) funcionan.
- [ ] Deslizar la carátula cambia de canción; deslizar hacia abajo cierra el reproductor.
- [ ] El fondo del reproductor toma el color de la carátula.
- [ ] **Pantalla apagada durante 30 min**: la música no se corta y pasa de una canción a otra.
- [ ] La notificación y la pantalla de bloqueo muestran el título, el artista, la carátula y los botones.
- [ ] Los botones de los auriculares (cable y Bluetooth) funcionan.
- [ ] Al desconectar los auriculares, la música se pausa.
- [ ] Una llamada entrante pausa la música.
- [ ] Al cerrar y reabrir la app, vuelve la última canción en el mismo punto.
- [ ] Con un archivo dañado, aparece el aviso y salta a la siguiente.

### D. Cola
- [ ] **Reproducir a continuación** y **Añadir a la cola** desde ⋮.
- [ ] Reordenar arrastrando, quitar deslizando, tocar para saltar y **Vaciar**.
- [ ] Ningún cambio en la cola corta la canción que suena.

### E. Favoritos y listas
- [ ] ❤ en el reproductor y en ⋮; la canción aparece en Favoritos.
- [ ] Crear, renombrar y borrar una lista (con confirmación).
- [ ] Añadir canciones con el buscador; reordenar y quitar.
- [ ] **Añadir a lista…** desde ⋮, incluida **Nueva lista**.
- [ ] Al cerrar y reabrir la app, todo se conserva.
- [ ] **Actualización:** al instalar la 1.0.0 encima de una versión anterior, las listas y los favoritos siguen ahí.

### F. Búsqueda
- [ ] El teclado se abre al entrar en Buscar.
- [ ] Busca sin tildes ni mayúsculas, y con varias palabras.
- [ ] Tocar una canción, un artista o un álbum hace lo esperado.
- [ ] Las búsquedas recientes se guardan, se quitan y se borran.

### G. Ajustes
- [ ] El tema oscuro, el claro y el del sistema cambian al instante.
- [ ] Los 6 colores y el color personalizado (incluido uno muy claro) se ven bien en toda la app.
- [ ] Excluir una carpeta y la duración mínima actualizan la biblioteca.
- [ ] La versión dice **1.0.0**; el manual y las licencias se abren.

### H. Accesibilidad y rendimiento
- [ ] Con la letra del sistema al máximo, nada importante se corta.
- [ ] Con TalkBack, los botones se anuncian con su nombre.
- [ ] Con "Quitar animaciones" activado, el ecualizador queda quieto.
- [ ] **Batería:** con 1 hora de música y la pantalla apagada, Melarmonía gasta ____ %. Se mira en Ajustes del teléfono → Batería.

### Problemas encontrados

| # | Qué pasó | Teléfono / Android | Cómo repetirlo | Estado |
|---|---|---|---|---|
| | | | | |

## 8.3 Capturas para el manual

Haz estas capturas en tema oscuro y con el color morado, y guárdalas en `docs/capturas/` con estos nombres:

| Archivo | Pantalla |
|---|---|
| `01-bienvenida.png` | Bienvenida |
| `02-biblioteca.png` | Biblioteca → Canciones |
| `03-album.png` | Detalle de un álbum |
| `04-reproductor.png` | Reproductor completo |
| `05-cola.png` | Cola |
| `06-menu.png` | Menú ⋮ de una canción |
| `07-listas.png` | Pestaña Listas |
| `08-lista.png` | Detalle de una lista |
| `09-buscar.png` | Buscar, con resultados |
| `10-ajustes.png` | Ajustes |
| `11-color.png` | Color personalizado |
| `12-notificacion.png` | Notificación o pantalla de bloqueo |

Cuando estén en la carpeta, se añaden al manual en su sección.
