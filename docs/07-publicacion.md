# 7. Publicación

Cómo generar el APK de Melarmonía, firmarlo y publicarlo en GitHub.

## 7.1 Requisitos (una sola vez)

1. **Node.js 22** y el proyecto descargado: `git clone https://github.com/Luis-Pichardo/melarmonia` y luego `npm install`.
2. **Cuenta gratuita de Expo** en [expo.dev](https://expo.dev).
3. Iniciar sesión: `npx eas-cli@latest login`.
4. Vincular el proyecto (la primera vez): `npx eas-cli@latest init`. Esto añade el `projectId` de Expo a `app.json`. Hay que guardar ese cambio en el repositorio.

## 7.2 La clave de firma

Android solo instala una actualización si está firmada con **la misma clave** que la versión anterior. Si se pierde la clave, los usuarios tendrán que desinstalar la app (y perder sus listas) para instalar la nueva.

**Opción recomendada: que EAS la guarde.**
- La primera vez que ejecutes `npm run build:release`, EAS pregunta *"Generate a new Android Keystore?"*. Responde **sí**.
- La clave queda guardada en tu cuenta de Expo, y las siguientes compilaciones la usan sola.
- **Haz una copia de seguridad:** `npx eas-cli@latest credentials` → Android → *production* → **Download keystore**. Guarda el archivo `.jks` y sus contraseñas en un lugar seguro (un gestor de contraseñas o una nube privada), **nunca en el repositorio**.

> El `.gitignore` ya excluye los archivos `*.jks`, `*.keystore` y `*.key`.

## 7.3 Versiones

Cada versión nueva necesita **dos cambios en `app.json`**:

| Campo | Qué es | Ejemplo |
|---|---|---|
| `expo.version` | La versión que ve el usuario (SemVer) | `1.0.0` → `1.0.1` (correcciones), `1.1.0` (funciones nuevas) |
| `expo.android.versionCode` | Número entero que Android usa para saber que es más nueva; **siempre debe subir** | `10` → `11` |

Pon también la misma versión en `package.json` y anota los cambios en `CHANGELOG.md`.

## 7.4 Generar el APK

| Comando | Perfil | Para qué |
|---|---|---|
| `npm run build:dev` | `development` | APK de desarrollo, que se conecta a `npm start` y recarga al guardar |
| `npm run build:apk` | `preview` | APK de prueba |
| `npm run build:release` | `production` | **APK final** para publicar |

Al terminar, EAS muestra un enlace para descargar el APK. Cámbiale el nombre a `Melarmonia-<versión>.apk`, por ejemplo `Melarmonia-1.0.0.apk`.

> Las compilaciones gratuitas de EAS pueden esperar en cola unos minutos.

## 7.5 Publicar en GitHub

1. Comprueba que `main` tiene la versión correcta y que las **Comprobaciones** de GitHub (tipos, estilo y pruebas) están en verde.
2. En GitHub: **Releases** → **Draft a new release**. Escribe la etiqueta `v<versión>` (por ejemplo, `v1.0.0`), con destino `main`, y el título `Melarmonía <versión>`.
3. Copia las notas de `docs/notas/<versión>.md` (las de la 1.0.0 ya están escritas).
4. Arrastra el APK a *Attach binaries* y pulsa **Publish release**.
5. Comparte el enlace de la publicación: quien lo abra desde el teléfono descarga el APK y lo instala siguiendo el [manual](05-manual-de-usuario.md#1-instalación).

## 7.6 Lista antes de publicar

- [ ] Versión y `versionCode` actualizados en `app.json` (y versión en `package.json`).
- [ ] `CHANGELOG.md` con los cambios de la versión.
- [ ] Comprobaciones de GitHub en verde (`npm run typecheck`, `npm run lint`, `npm test`).
- [ ] [Lista de pruebas](08-pruebas.md) completada en al menos un teléfono.
- [ ] APK generado con `npm run build:release` (perfil `production`).
- [ ] Copia de seguridad de la clave de firma hecha.
- [ ] El APK se instala **encima** de la versión anterior sin desinstalarla, y las listas se conservan.
