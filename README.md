# 🎵 Melarmonía

**Melodía + Armonía.** Un reproductor de música para Android, sin anuncios, que reproduce la música que ya tienes descargada en tu teléfono.

> Estado: **versión 1.0.0, en pruebas en el teléfono**. Consulta el [plan por etapas](docs/06-plan-por-etapas.md) para ver por dónde vamos.

## Características (versión 1.0)

- Biblioteca automática: encuentra toda la música del teléfono.
- Organización por canciones, artistas y álbumes, con carátulas.
- Reproductor completo: pausa, siguiente/anterior, aleatorio, repetir, barra de progreso y fondo con el color de la carátula.
- Cola de reproducción editable: reproducir a continuación, añadir, reordenar y quitar.
- Reproducción en segundo plano, controles en la pantalla de bloqueo y compatibilidad con auriculares Bluetooth.
- Listas de reproducción propias y favoritos.
- Búsqueda en vivo, sin importar tildes ni mayúsculas.
- Continúa donde te quedaste al reabrir la app.
- Tema oscuro, claro o el del sistema.
- Color personalizable (morado por defecto).
- Sin anuncios, sin cuentas y sin internet.

## Documentación

| Documento | Contenido |
|---|---|
| [Visión general](docs/01-vision-general.md) | Qué es la app, alcance de la v1.0 y planes futuros |
| [Guía de diseño](docs/02-guia-de-diseno.md) | Colores, tipografía, espaciados, iconos y componentes |
| [Pantallas y flujos](docs/03-pantallas-y-flujos.md) | Cada pantalla y cómo se navega entre ellas |
| [Arquitectura técnica](docs/04-arquitectura.md) | Tecnologías, estructura de carpetas, datos y permisos |
| [Manual de usuario](docs/05-manual-de-usuario.md) | Guía completa para quien usa la app |
| [Plan por etapas](docs/06-plan-por-etapas.md) | Las etapas del proyecto, sus tareas y su estado |
| [Publicación](docs/07-publicacion.md) | Generar el APK, la clave de firma, las versiones y la publicación en GitHub |
| [Pruebas](docs/08-pruebas.md) | Pruebas automáticas, lista de pruebas en el teléfono y capturas |
| [Registro de cambios](CHANGELOG.md) | Qué cambia en cada versión |

## Descargar

Las versiones publicadas están en [Releases](https://github.com/Luis-Pichardo/melarmonia/releases). Descarga el `.apk` desde el teléfono e instálalo siguiendo el [manual](docs/05-manual-de-usuario.md#1-instalación).

## Tecnología

React Native + Expo SDK 58 (TypeScript) · `expo-audio` · Solo Android.

## Desarrollo

```bash
npm install            # instalar dependencias
npm run build:dev      # APK de desarrollo (una vez, con EAS)
npm start              # servidor de desarrollo
npm run build:apk      # APK de prueba para instalar
npm run build:release  # APK final para publicar
npm run typecheck && npm run lint && npm test
```

Más detalles en [Arquitectura técnica](docs/04-arquitectura.md#48-compilación-y-distribución).
