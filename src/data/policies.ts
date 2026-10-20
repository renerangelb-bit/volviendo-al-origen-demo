export type Policy = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: { title: string; body: string[]; list?: string[] }[];
};

/*
 * Textos de referencia para la demostración. La propuesta deja al cliente la validación legal
 * de políticas de envío, cambios, devoluciones y privacidad (sección "Decisiones a aprobar").
 */
export const POLICIES: Policy[] = [
  {
    slug: 'envios-y-devoluciones',
    title: 'Envíos y devoluciones',
    updated: '2026-10-01',
    intro: 'Queremos que tu compra llegue completa y a tiempo. Aquí te contamos cómo enviamos, cuánto cuesta y qué hacer si necesitas un cambio.',
    sections: [
      {
        title: 'Tiempos de preparación',
        body: ['Preparamos y empacamos tu pedido en 1 a 2 días hábiles después de confirmar el pago. Los pedidos realizados en fin de semana o días festivos se procesan el siguiente día hábil.'],
      },
      {
        title: 'Métodos y costos de envío',
        body: ['Enviamos a toda la República Mexicana con paqueterías nacionales.'],
        list: [
          'Envío estándar: $130 MXN, de 3 a 6 días hábiles. Gratis en compras mayores a $1,200 MXN.',
          'Envío express: $220 MXN, de 1 a 3 días hábiles.',
          'Recoger en tienda: sin costo en 28 de Agosto #410, Barrio de la Estación, Aguascalientes. Te avisamos cuando esté listo.',
        ],
      },
      {
        title: 'Rastreo',
        body: ['Cuando tu pedido sale de nuestro taller te enviamos un correo con la paquetería y el número de guía. También puedes consultarlo en la página Rastrear pedido o en Mi cuenta.'],
      },
      {
        title: 'Cambios y devoluciones',
        body: [
          'Aceptamos cambios y devoluciones de productos sin abrir y en su empaque original dentro de los 15 días naturales posteriores a la entrega. Por higiene, no podemos aceptar productos abiertos o usados.',
          'Para iniciar un cambio escríbenos por WhatsApp o desde Contacto con tu número de pedido. Te indicaremos cómo enviarlo; el costo del envío de regreso corre por cuenta del cliente, salvo que el producto haya llegado dañado o sea incorrecto.',
        ],
      },
      {
        title: 'Productos dañados o incompletos',
        body: ['Si tu pedido llegó dañado o le falta algún producto, avísanos dentro de las 48 horas siguientes a la entrega con fotografías del paquete y del producto. Te enviamos el reemplazo sin costo o te reembolsamos el importe.'],
      },
      {
        title: 'Reembolsos',
        body: ['Los reembolsos se realizan al mismo medio de pago en un plazo de 5 a 10 días hábiles una vez que recibimos y revisamos el producto.'],
      },
    ],
  },
  {
    slug: 'terminos-y-condiciones',
    title: 'Términos y condiciones',
    updated: '2026-10-01',
    intro: 'Al comprar en volviendoalorigen.com aceptas los siguientes términos. Te recomendamos leerlos antes de realizar tu pedido.',
    sections: [
      { title: 'Precios', body: ['Todos los precios están expresados en pesos mexicanos (MXN) e incluyen IVA. Los precios y promociones pueden cambiar sin previo aviso, pero respetamos el precio vigente al momento de tu compra.'] },
      { title: 'Disponibilidad', body: ['Nuestros productos se elaboran a mano en lotes pequeños. Si algún producto se agota después de tu compra, te contactaremos para ofrecerte un cambio o el reembolso.'] },
      { title: 'Pagos', body: ['Los pagos se procesan a través de pasarelas certificadas. Volviendo al Origen no almacena los datos de tu tarjeta. Los pedidos pagados en OXXO o por SPEI se preparan una vez confirmado el pago.'] },
      { title: 'Cupones', body: ['Los cupones no son acumulables, aplican sobre el subtotal de productos y tienen la vigencia indicada en cada promoción.'] },
      {
        title: 'Uso de los productos',
        body: ['Nuestros productos son cosméticos de uso externo. Te recomendamos hacer una prueba en una zona pequeña de la piel antes del primer uso y suspenderlo si notas alguna reacción. Las descripciones no sustituyen la consulta médica.'],
      },
      { title: 'Propiedad intelectual', body: ['Las marcas, fotografías y textos de este sitio pertenecen a Volviendo al Origen y no pueden usarse sin autorización.'] },
    ],
  },
  {
    slug: 'aviso-de-privacidad',
    title: 'Aviso de privacidad',
    updated: '2026-10-01',
    intro: 'Volviendo al Origen, con domicilio en 28 de Agosto #410, Barrio de la Estación, Aguascalientes, es responsable del uso y protección de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
    sections: [
      {
        title: 'Datos que recabamos',
        body: ['Nombre, correo electrónico, teléfono y dirección de entrega. No recabamos datos sensibles ni almacenamos datos de tarjetas: los pagos los procesa directamente la pasarela de pago.'],
      },
      {
        title: 'Para qué los usamos',
        body: ['Finalidades necesarias:'],
        list: ['Procesar, enviar y dar seguimiento a tus pedidos.', 'Atender dudas, cambios y devoluciones.', 'Emitir facturas cuando las solicites.'],
      },
      {
        title: 'Finalidades secundarias',
        body: ['Si lo autorizas, usaremos tu correo para enviarte novedades y promociones. Puedes darte de baja en cualquier momento desde el enlace incluido en cada correo.'],
      },
      { title: 'Transferencias', body: ['Compartimos tu nombre, teléfono y dirección únicamente con la paquetería que entrega tu pedido y con la pasarela de pago que procesa tu compra.'] },
      { title: 'Derechos ARCO', body: [`Puedes acceder, rectificar, cancelar u oponerte al uso de tus datos escribiendo a contacto@volviendoalorigen.com. Te responderemos en un plazo máximo de 20 días hábiles.`] },
      { title: 'Cambios a este aviso', body: ['Cualquier cambio a este aviso se publicará en esta misma página.'] },
    ],
  },
];

export const getPolicy = (slug: string) => POLICIES.find((p) => p.slug === slug);
