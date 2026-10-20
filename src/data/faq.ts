export type FaqTopic = { id: string; title: string; items: { q: string; a: string }[] };

/* Respuestas de demostración: montos y tiempos deben validarse con Volviendo al Origen. */
export const FAQ: FaqTopic[] = [
  {
    id: 'envios',
    title: 'Envíos',
    items: [
      {
        q: '¿Cuánto cuesta el envío?',
        a: 'El envío estándar a todo México cuesta $130 y es gratis en compras mayores a $1,200. También puedes elegir envío express ($220) o recoger sin costo en nuestra tienda de Aguascalientes.',
      },
      {
        q: '¿Cuánto tarda en llegar mi pedido?',
        a: 'Preparamos tu pedido en 1 a 2 días hábiles. Después, el envío estándar tarda de 3 a 6 días hábiles y el express de 1 a 3 días hábiles, según tu código postal.',
      },
      {
        q: '¿Hacen envíos a todo México?',
        a: 'Sí, enviamos a toda la República con paqueterías nacionales. En algunas zonas extendidas el tiempo de entrega puede aumentar uno o dos días.',
      },
      {
        q: '¿Puedo recoger mi pedido en la tienda?',
        a: 'Claro. Elige “Recoger en tienda” al pagar y te avisaremos cuando esté listo en 28 de Agosto #410, Barrio de la Estación. Horario: lunes a viernes de 10:00 a 20:00 y fines de semana de 10:00 a 15:00.',
      },
    ],
  },
  {
    id: 'pedidos',
    title: 'Pedidos y rastreo',
    items: [
      {
        q: '¿Cómo rastreo mi pedido?',
        a: 'Entra a “Rastrear pedido” e ingresa tu número de pedido (por ejemplo VAO-10482). Si tienes cuenta, también lo ves en Mi cuenta › Mis pedidos, junto con la paquetería y el número de guía.',
      },
      {
        q: '¿Qué significa cada estado de mi pedido?',
        a: 'Pedido recibido: registramos tu compra. Pago confirmado: la pasarela aprobó el pago. Preparando: estamos reuniendo tus productos. Empaquetado: listo para la paquetería. Enviado: ya tiene número de guía. Entregado: llegó a tu domicilio.',
      },
      {
        q: '¿Puedo modificar o cancelar mi pedido?',
        a: 'Sí, mientras esté en “Pedido recibido” o “Pago confirmado”. Escríbenos por WhatsApp con tu número de pedido y lo ajustamos.',
      },
    ],
  },
  {
    id: 'pagos',
    title: 'Pagos',
    items: [
      {
        q: '¿Qué formas de pago aceptan?',
        a: 'Tarjeta de crédito o débito, Mercado Pago, transferencia SPEI y pago en efectivo en tiendas OXXO. Los pagos se procesan en la pasarela segura; nunca guardamos los datos de tu tarjeta.',
      },
      {
        q: '¿Puedo pedir factura?',
        a: 'Sí. Escríbenos a contacto@volviendoalorigen.com con tu número de pedido y tus datos fiscales dentro del mismo mes de compra.',
      },
      {
        q: '¿Cómo uso un cupón de descuento?',
        a: 'Escribe el código en el carrito o en el pago y presiona “Aplicar”. Si te suscribes a nuestro boletín recibes el cupón BIENVENIDA10 con 10% en tu primera compra.',
      },
    ],
  },
  {
    id: 'devoluciones',
    title: 'Cambios y devoluciones',
    items: [
      {
        q: '¿Puedo devolver un producto?',
        a: 'Aceptamos cambios y devoluciones de productos sin usar y en su estado original dentro de los 15 días naturales posteriores a la entrega. Por higiene, no aceptamos devoluciones de productos abiertos o usados.',
      },
      {
        q: '¿Qué hago si mi pedido llegó dañado o incompleto?',
        a: 'Escríbenos por WhatsApp dentro de las 48 horas siguientes a la entrega con una foto del paquete y del producto. Te enviamos el reemplazo sin costo.',
      },
    ],
  },
  {
    id: 'productos',
    title: 'Productos',
    items: [
      {
        q: '¿Cómo uso un champú sólido?',
        a: 'Moja bien tu cabello, desliza la barra sobre el cuero cabelludo tres o cuatro veces y masajea hasta hacer espuma. Enjuaga y guarda la barra seca, fuera del chorro de agua.',
      },
      {
        q: '¿Cuánto dura un champú sólido?',
        a: 'Depende de tu tipo de cabello y de qué tan seguido lo laves. Lo que más ayuda a que dure es dejarla secar entre usos, en una jabonera con drenaje y fuera del chorro de agua.',
      },
      {
        q: '¿Sus productos son veganos y libres de crueldad?',
        a: 'Todos nuestros productos son libres de crueldad animal. Algunos llevan ingredientes de origen animal, como miel, leche de burra o cera de abeja; lo indicamos en la ficha de cada producto.',
      },
      {
        q: '¿Qué aceite de palma usan?',
        a: 'Nuestro proveedor de aceite de palma cuenta con la certificación RSPO (Roundtable on Sustainable Palm Oil), que promueve una producción responsable.',
      },
      {
        q: '¿Venden a granel o por mayoreo?',
        a: 'Sí. En la tienda tenemos zona de cosmética a granel: trae tu envase y rellénalo. Para mayoreo, escríbenos desde la página de Contacto eligiendo el motivo “Mayoreo”.',
      },
    ],
  },
  {
    id: 'cuenta',
    title: 'Mi cuenta',
    items: [
      {
        q: '¿Necesito una cuenta para comprar?',
        a: 'No, puedes comprar como invitado. Con una cuenta guardas tus direcciones, consultas tu historial y das seguimiento a tus pedidos sin escribirnos.',
      },
      {
        q: 'Olvidé mi contraseña, ¿qué hago?',
        a: 'En “Iniciar sesión” elige “¿Olvidaste tu contraseña?” y te enviaremos un enlace para crear una nueva.',
      },
    ],
  },
];
