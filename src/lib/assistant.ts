import { COMMERCE, SITE } from '@/data/site';
import { searchProducts } from './search';
import { money, normalize } from './format';
import { currentStatus, statusCopy, type Order } from './orders';

export type BotMessage = {
  from: 'bot' | 'user';
  text: string;
  links?: { label: string; href: string; external?: boolean }[];
  products?: string[];
};

export const QUICK_REPLIES = [
  'Costos y tiempos de envío',
  'Rastrear mi pedido',
  'Formas de pago',
  '¿Cómo uso el champú sólido?',
  'Cambios y devoluciones',
  'Hablar con una persona',
];

const whatsappLink = (text: string) => `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

/**
 * Asistente de reglas para la demo: cubre las preguntas frecuentes, consulta pedidos guardados
 * en este navegador y escala a WhatsApp. En producción se sustituye por tawk.to / Tidio.
 */
export function answer(input: string, findOrder: (id: string) => Order | undefined): BotMessage {
  const t = normalize(input);
  const orderMatch = input.match(/vao[-\s]?(\d{4,6})/i) ?? (/(pedido|orden|rastre)/.test(t) ? input.match(/\b(\d{5})\b/) : null);

  if (orderMatch) {
    const id = `VAO-${orderMatch[1]}`;
    const o = findOrder(id);
    if (!o) {
      return {
        from: 'bot',
        text: `No encontré el pedido ${id}. Revisa el número en tu correo de confirmación o escríbenos y lo buscamos contigo.`,
        links: [{ label: 'Escribir por WhatsApp', href: whatsappLink(`Hola, necesito ayuda con mi pedido ${id}`), external: true }],
      };
    }
    const st = statusCopy(currentStatus(o), o.shippingMethod);
    return {
      from: 'bot',
      text: `Tu pedido ${o.id} está en “${st.label}”. ${st.detail}${o.carrier ? ` Paquetería: ${o.carrier.name}, guía ${o.carrier.tracking}.` : ''}`,
      links: [{ label: 'Ver seguimiento completo', href: `/rastreo?pedido=${o.id}` }],
    };
  }
  if (/hablar|persona|humano|asesor|whatsapp|agente/.test(t)) {
    return {
      from: 'bot',
      text: `Con gusto. Nuestro equipo responde por WhatsApp de lunes a viernes de 10:00 a 20:00 y fines de semana de 10:00 a 15:00.`,
      links: [{ label: 'Abrir WhatsApp', href: whatsappLink('Hola, vengo del sitio web y tengo una pregunta.'), external: true }],
    };
  }
  if (/rastre|mi pedido|estado|guia|donde (esta|va)|seguimiento/.test(t)) {
    return {
      from: 'bot',
      text: 'Escríbeme tu número de pedido (por ejemplo VAO-10482) y te digo en qué va. También puedes verlo en la página de rastreo.',
      links: [{ label: 'Ir a rastrear pedido', href: '/rastreo' }],
    };
  }
  if (/envi|costo de env|cuanto tarda|llega|paqueter|domicilio|express/.test(t)) {
    return {
      from: 'bot',
      text: `El envío estándar a todo México cuesta ${money(130)} (3 a 6 días hábiles) y es gratis desde ${money(COMMERCE.freeShippingFrom)}. El express cuesta ${money(220)} (1 a 3 días hábiles). También puedes recoger gratis en nuestra tienda de Aguascalientes.`,
      links: [{ label: 'Ver preguntas de envíos', href: '/ayuda#envios' }],
    };
  }
  if (/pago|pagar|tarjeta|oxxo|spei|transferencia|mercado ?pago|meses|efectivo/.test(t)) {
    return {
      from: 'bot',
      text: 'Aceptamos tarjeta de crédito o débito, Mercado Pago, transferencia SPEI y efectivo en OXXO. El pago se procesa en una pasarela segura: nunca guardamos los datos de tu tarjeta.',
    };
  }
  if (/devol|cambio|reembolso|danad|roto|incomplet/.test(t)) {
    return {
      from: 'bot',
      text: 'Aceptamos cambios y devoluciones de productos sin usar dentro de 15 días naturales. Si tu pedido llegó dañado, mándanos una foto por WhatsApp dentro de las 48 horas y te enviamos el reemplazo.',
      links: [{ label: 'Leer la política completa', href: '/politicas/envios-y-devoluciones' }],
    };
  }
  if (/como (se )?usa|como uso|champu solido|barra|dura|cuidar/.test(t)) {
    return {
      from: 'bot',
      text: 'Moja bien tu cabello, desliza la barra sobre el cuero cabelludo 3 o 4 veces y masajea hasta hacer espuma. Enjuaga y guárdala seca, fuera del chorro de agua: así dura mucho más.',
      links: [{ label: 'Guía completa', href: '/blog/como-usar-champu-solido' }],
    };
  }
  if (/horario|direccion|ubicacion|tienda fisica|donde estan|abren|visitar|calvillo/.test(t)) {
    return {
      from: 'bot',
      text: `Nuestra tienda está en ${SITE.address.street}, ${SITE.address.neighborhood}, ${SITE.address.city}. Abrimos de lunes a viernes de 10:00 a 20:00 y fines de semana de 10:00 a 15:00.`,
      links: [{ label: 'Cómo llegar', href: SITE.address.mapsUrl, external: true }],
    };
  }
  if (/mayoreo|granel|distribu|revend/.test(t)) {
    return {
      from: 'bot',
      text: 'En tienda tenemos zona de cosmética a granel: trae tu envase y rellénalo. Para mayoreo, déjanos tus datos en Contacto con el motivo “Mayoreo” y te enviamos la lista de precios.',
      links: [{ label: 'Ir a Contacto', href: '/contacto?motivo=mayoreo' }],
    };
  }
  if (/vegan|crueldad|animal|probado/.test(t)) {
    return {
      from: 'bot',
      text: 'Todos nuestros productos son libres de crueldad animal. Algunos llevan miel, leche de burra o cera de abeja; lo indicamos en la ficha de cada producto.',
    };
  }
  if (/factur/.test(t)) {
    return { from: 'bot', text: `Escríbenos a ${SITE.email} con tu número de pedido y tus datos fiscales dentro del mismo mes de compra.` };
  }
  if (/cupon|descuento|promo|codigo/.test(t)) {
    return {
      from: 'bot',
      text: 'Suscríbete al boletín al pie de la página y recibe el cupón BIENVENIDA10 con 10% en tu primera compra.',
    };
  }
  if (/^(hola|buen[oa]s|que tal|hey)/.test(t)) {
    return { from: 'bot', text: '¡Hola! ¿En qué te ayudo? Puedo resolver dudas de envíos, pagos y productos, o decirte en qué va tu pedido.' };
  }
  if (/gracias|perfecto|excelente|genial/.test(t)) {
    return { from: 'bot', text: '¡Con gusto! Gracias por volver al origen.' };
  }
  const found = searchProducts(input, 3);
  if (found.length) {
    return { from: 'bot', text: 'Estos productos pueden servirte:', products: found.map((p) => p.slug) };
  }
  return {
    from: 'bot',
    text: 'No estoy seguro de cómo ayudarte con eso. ¿Quieres que te comunique con una persona del equipo?',
    links: [{ label: 'Hablar por WhatsApp', href: whatsappLink(`Hola, tengo una pregunta: ${input}`), external: true }],
  };
}
