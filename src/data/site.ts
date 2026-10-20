export const SITE = {
  name: 'Volviendo al Origen',
  tagline: 'Vuelve a ti, vuelve al origen',
  description:
    'Cosmética sólida consciente hecha en Aguascalientes: jabones artesanales, champús y acondicionadores sólidos, aceites y accesorios sin plástico.',
  url: 'https://www.volviendoalorigen.com',
  phoneDisplay: '449 549 2690',
  phoneE164: '+524495492690',
  whatsapp: 'https://wa.me/524495492690',
  email: 'contacto@volviendoalorigen.com',
  address: {
    street: '28 de Agosto #410',
    neighborhood: 'Barrio de la Estación',
    city: 'Aguascalientes, Ags.',
    zip: '20259',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=28+de+Agosto+410+Barrio+de+la+Estaci%C3%B3n+Aguascalientes',
  },
  hours: [
    { days: 'Lunes a viernes', time: '10:00 a 20:00' },
    { days: 'Sábado y domingo', time: '10:00 a 15:00' },
  ],
  social: {
    instagram: 'https://www.instagram.com/volviendo_al_origen',
    facebook: 'https://www.facebook.com/VolviendoalOrigenOficial',
  },
  instagramHandle: '@volviendo_al_origen',
} as const;

export const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/nosotros', label: 'Quiénes somos' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/blog', label: 'Blog' },
  { href: '/ayuda', label: 'Ayuda' },
] as const;

/** Reglas comerciales de la demo. Validar montos y tiempos con el cliente antes de producción. */
export const COMMERCE = {
  currency: 'MXN',
  freeShippingFrom: 1200,
  shippingMethods: [
    { id: 'estandar', name: 'Envío estándar', detail: '3 a 6 días hábiles a todo México', price: 130, freeEligible: true },
    { id: 'express', name: 'Envío express', detail: '1 a 3 días hábiles', price: 220, freeEligible: false },
    { id: 'tienda', name: 'Recoger en tienda', detail: '28 de Agosto #410, Aguascalientes · listo en 24 h', price: 0, freeEligible: false },
  ],
  coupons: [{ code: 'BIENVENIDA10', percent: 10, label: '10% en tu primera compra' }],
  maxQtyPerItem: 10,
} as const;

export type ShippingMethodId = (typeof COMMERCE.shippingMethods)[number]['id'];

export const MX_STATES = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
] as const;
