# Volviendo al Origen · Prototipo de tienda (NEXA)

Prototipo navegable de la **Propuesta Integral de Rediseño Web** (NEXA, julio 2026). Incluye todas las páginas de la arquitectura de contenido de la propuesta y un flujo de compra completo de demostración: catálogo, ficha, carrito, checkout, confirmación, rastreo y Mi cuenta.

> Todo funciona en el navegador: **no hay cobros reales** y los datos (carrito, sesión y pedidos) se guardan sólo en el dispositivo.

## Cómo correrlo

Requisitos: **Node.js 20.9 o superior**.

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. Para presentar la demo usa la guía en <http://localhost:3000/demo> (también enlazada al pie de página, en «Prototipo de demostración · NEXA»).

Compilación de producción:

```bash
npm run build
npm start
```

## Qué incluye

| Página | Ruta | Qué hace |
| --- | --- | --- |
| Inicio (Home v2) | `/` | Las 8 secciones de la propuesta: barra y header, hero, beneficios y confianza, destacados, compra por categoría, historia, rutinas y comunidad. |
| Tienda | `/tienda` | 63 productos reales del sitio. Filtros por categoría, necesidad, precio y disponibilidad; orden; búsqueda; filtros sincronizados con la URL; hoja de filtros en móvil. |
| Ficha de producto | `/producto/[slug]` | Galería, variantes (aroma de velas, presentación del champú de sangre de grado), cantidad, agregar o comprar ahora, aviso de existencias, «Avísame» si está agotado, detalle, relacionados y opiniones. Barra fija para agregar en móvil. |
| Carrito lateral | (en todas) | Se abre al agregar desde la ficha. Cantidades, eliminar con «Deshacer», medidor de envío gratis y un complemento sugerido. |
| Carrito | `/carrito` | Guardar para después, cupón (`BIENVENIDA10`), resumen y sugerencias. |
| Checkout | `/checkout` | Datos, entrega (estándar, express o recoger en tienda), direcciones guardadas, forma de pago (tarjeta, Mercado Pago, SPEI, OXXO), validación y términos. |
| Confirmación | `/checkout/confirmacion` | Número de pedido, referencia de pago para SPEI u OXXO, estado, entrega estimada y resumen. |
| Rastreo | `/rastreo` | Estados operativos de la propuesta: recibido › pago confirmado › preparando › empaquetado › enviado › entregado, con paquetería y guía. |
| Mi cuenta | `/cuenta` | Inicio de sesión, registro y recuperación; resumen, pedidos («Volver a comprar»), direcciones, favoritos y datos. |
| Quiénes somos | `/nosotros` | Historia (desde 2012), valores, proceso, compromisos y tienda física. |
| Contacto | `/contacto` | Formulario con validación y motivo (pedido, mayoreo, granel…), WhatsApp, correo, dirección y horarios. |
| Ayuda | `/ayuda` | Preguntas frecuentes con buscador y datos estructurados (FAQPage). |
| Blog | `/blog` | Las 3 publicaciones del blog actual y 2 guías nuevas, con filtro por categoría y productos relacionados. |
| Políticas | `/politicas/...` | Envíos y devoluciones, términos y condiciones, aviso de privacidad. |
| Extras | — | Buscador en vivo, asistente de ayuda (chat) que consulta pedidos y escala a WhatsApp, boletín con cupón, favoritos con el listón de cada tarjeta. |

Cuenta de demostración: botón **«Entrar con cuenta demo»** en Mi cuenta (`demo@volviendoalorigen.com`). Pedidos de ejemplo: `VAO-10482`, `VAO-10517`, `VAO-10391`.

## Contenido de demostración que debe validar el cliente

- **Catálogo:** nombres, precios y productos agotados (Bálsamo Corporal, Kit de Viaje) se tomaron de volviendoalorigen.com en octubre de 2026. Las descripciones son las oficiales cuando el sitio las publica (`officialCopy: true` en `src/data/products.ts`); el resto son textos breves por confirmar.
- **Observación del sitio actual:** la ficha de «Champú sólido Romero Eucalipto» lista ingredientes de nopal, sábila y linaza, que parecen de otra ficha. Conviene confirmarlo.
- **Imágenes:** ilustraciones provisionales con un mismo estilo, a sustituir por la sesión de fotografía de la propuesta.
- **Logotipo:** emblema provisional en `src/components/layout/Logo.tsx` y `src/app/icon.svg`.
- **Envíos y cupón:** estándar $130, express $220, gratis desde $1,200, recoger en tienda sin costo; cupón `BIENVENIDA10` (10%). Se editan en `src/data/site.ts`.
- **Políticas y preguntas frecuentes:** textos de referencia; requieren revisión legal (`src/data/policies.ts`, `src/data/faq.ts`).
- **Reseñas y testimonios:** son de ejemplo y están marcados como tal; en producción deben ser reseñas reales.

## Estructura

```
src/
  app/          Rutas (App Router): páginas, metadatos y layout
  components/   UI por sección: layout, product, shop, cart, checkout, orders, account, chat…
  data/         Contenido editable: productos, categorías, blog, FAQ, políticas, datos del negocio
  lib/          Lógica: precios y envío, filtros, búsqueda, pedidos, validación, asistente
  store/        Estado con Zustand + localStorage: carrito, cuenta, pedidos, UI
public/
  fonts/        Montserrat (OFL)
  images/       Imágenes de productos y secciones
```

Colores y tipografía están en `src/app/globals.css` (bloque `@theme`), así que cambiar un tono afecta a todo el sitio.

## Paso a producción

La propuesta define la tienda final sobre **WordPress + WooCommerce**. Este prototipo sirve para aprobar la experiencia (UX/UI) y como referencia directa del tema personalizado: carrito, checkout, cuentas y pedidos se implementan con las funciones nativas de WooCommerce; el rastreo con AST o TrackShip; el chat con tawk.to o Tidio; y los pagos con Mercado Pago u Openpay (Stripe como respaldo).

## Notas técnicas

- Next.js 16 (App Router), React 19.2, Tailwind CSS 4, Zustand 5 y react-icons (Phosphor).
- Sin backend: el estado vive en `localStorage` (`vao-cart`, `vao-account`, `vao-orders`). La página `/demo` lo reinicia.
- Accesibilidad: navegación con teclado, foco visible, paneles con foco atrapado y cierre con Escape, etiquetas en todos los campos, contraste AA y `prefers-reduced-motion`.
