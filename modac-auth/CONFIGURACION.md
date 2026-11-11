# MODAC: iniciar sesión con GitHub, sin copiar tokens

Esta conexión se configura una sola vez. Después el administrador solo pulsa **Iniciar sesión con GitHub** y autoriza desde GitHub.

## Requisitos de activación

- Repositorio definitivo del catálogo y su dirección de GitHub Pages.
- Cuenta de Cloudflare para publicar este Worker de autenticación (u otro alojamiento capaz de ejecutarlo).
- Una GitHub App del propietario, instalada únicamente en el repositorio MODAC.

El catálogo y sus fotos permanecen en GitHub Pages. El Worker solo resuelve el acceso. Esta entrega contiene el código, pero no crea cuentas, aplicaciones ni permisos y no está conectada a un repositorio real.

## Configuración técnica única

1. Publicar `worker.mjs` en Cloudflare Workers y conservar su dirección HTTPS.
2. Crear una GitHub App con Homepage URL del catálogo y Callback URL `https://DIRECCION-DEL-WORKER/callback`. No activar webhooks. Solicitar solo Contents: Read and write (Metadata read es implícito), solo cuentas autorizadas y solo el repositorio del catálogo. No se usa un personal access token.
3. Instalar la aplicación en ese repositorio. Habilitar el flujo de autorización de usuario OAuth. Conservar el Client ID y generar el Client secret desde GitHub.
4. Configurar en el Worker los secretos `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` y `SESSION_SECRET` (aleatorio, mínimo 32 caracteres). No enviarlos por chat ni escribirlos en archivos públicos.
5. Establecer `ADMIN_URL` a la dirección HTTPS exacta del panel y `GITHUB_REPO` a `usuario/repositorio`.
6. En `admin/config.json`, completar `repo`, `branch` y `auth_url` (`https://DIRECCION-DEL-WORKER/login`). Estos datos son públicos; no contienen secretos.
7. Publicar los archivos del catálogo y probar acceso, edición, subida y guardado con la cuenta autorizada; comprobar también el rechazo con una cuenta sin permiso.

## Protección del flujo

- Authorization Code con PKCE S256 y validación de state.
- Estado y verificador cifrados en cookie Secure/HttpOnly, SameSite=Lax, vencimiento 10 minutos.
- Respuesta solo al origen fijo de ADMIN_URL y recepción solo desde la ventana y origen de autenticación esperados.
- Se verifica permiso de escritura sobre el repositorio antes de entregar la sesión.
- Credencial OAuth solo en memoria del panel, no en localStorage, cookies del catálogo ni archivos públicos. Se borra al cerrar, recargar o cerrar sesión.
- El panel no solicita la contraseña de GitHub. La contraseña se introduce únicamente en GitHub.

La activación y los secretos requieren al propietario de las cuentas. El flujo real de acceso no puede darse por validado antes de completar esta configuración.
