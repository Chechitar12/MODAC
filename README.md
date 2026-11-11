# MODAC · Catálogo para GitHub Pages

Catálogo estático: 19 diseños, 27 variantes iniciales; algodón jersey 30/1. Precios: S/ 19.90 individual y 2 por S/ 35. WhatsApp: +51 972 017 611. Sin sección de cuidados de lavado.

## Publicar

1. Crea o selecciona un repositorio dedicado al catálogo (no reemplazar el proyecto Integración TI).
2. Sube **el contenido de esta carpeta**, con index.html y productos.json en la raíz. Conserva las carpetas assets y admin.
3. En Settings → Pages, elige Deploy from a branch, rama main y carpeta / (root). Guarda.
4. Abre la dirección que te muestre GitHub Pages. No requiere instalar paquetes ni ejecutar compilación.

## Administrar

Entra a la dirección del catálogo seguida de `/admin/`. Puedes probar primero el modo demostración; no publica cambios.

Para guardar realmente, se configura una sola vez el acceso mediante **Iniciar sesión con GitHub**. El catálogo necesita `admin/config.json` con repositorio, rama y URL del servicio de autenticación. El proyecto `modac-auth` contiene el servicio y su guía de activación. No hay campos para copiar tokens ni contraseñas en el panel.

Una vez conectado, GitHub valida tu cuenta y el panel carga los datos del repositorio. Agrega o edita productos y pulsa **Guardar y publicar cambios**. Las imágenes y los datos se guardan juntos; GitHub Pages se actualiza después. Los borradores no son públicos. La sesión solo permanece en memoria de esa pestaña.

El acceso real está pendiente de configurar la GitHub App y el servicio de autenticación del propietario. El modo demostración permite revisar el panel mientras tanto y nunca publica cambios.

## Ocultar y eliminar

- Ocultar diseño: no aparece ninguna de sus variantes.
- Ocultar variante: solo ese color/talla deja de aparecer. Si no quedan variantes visibles, se oculta la tarjeta.
- Mostrar: vuelve a publicar el mismo registro.
- Eliminar variante: requiere confirmación y retira el registro. La foto y el historial de GitHub permanecen para evitar pérdida accidental. No equivale a purgar el archivo del repositorio.
- Si otra persona modifica el repositorio durante la edición, el panel rechaza la publicación para evitar sobrescribir cambios. No uses actualizaciones forzadas.

## Datos pendientes

Las variantes MODAC-001, 002, 018 y 024 tienen talla "Consultar talla". Confírmalas desde el panel antes de ofrecer tallas específicas. Los nombres de color son descripciones visuales que puedes corregir.

Cada registro corresponde a una prenda física. Oculta la variante al venderla. No se descuentan existencias automáticamente al abrir WhatsApp, y no hay pasarela de pago.

## Revisar en computadora

Desde esta carpeta: `python -m http.server 8000`, luego abre `http://localhost:8000`. Abrir index.html mediante doble clic puede bloquear la lectura de productos.json.

Los únicos recursos externos del catálogo son las fuentes de Google (con alternativas locales), los enlaces de WhatsApp y, dentro del panel conectado, la API de GitHub. Las fotos y datos del catálogo se sirven desde tu propio repositorio. No necesita ChatGPT para funcionar.
