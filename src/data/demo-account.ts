import type { Address } from '@/lib/orders';

export type User = { name: string; email: string; phone: string; birthday?: string; newsletter: boolean };

export const DEMO_USER: User = { name: 'Ana Martínez', email: 'demo@volviendoalorigen.com', phone: '449 123 4567', newsletter: true };

export const DEMO_ADDRESSES: Address[] = [
  {
    id: 'casa',
    label: 'Casa',
    name: 'Ana Martínez',
    phone: '449 123 4567',
    street: 'Av. Madero 120, int. 4',
    neighborhood: 'Zona Centro',
    zip: '20000',
    city: 'Aguascalientes',
    state: 'Aguascalientes',
    references: 'Portón café junto a la farmacia',
  },
  {
    id: 'oficina',
    label: 'Oficina',
    name: 'Ana Martínez',
    phone: '449 123 4567',
    street: 'Blvd. José María Chávez 1500',
    neighborhood: 'Ciudad Industrial',
    zip: '20290',
    city: 'Aguascalientes',
    state: 'Aguascalientes',
  },
];
