import type { Order, OrderLine, OrderStatus } from '@/lib/orders';
import { getProduct, priceFor } from './products';
import { DEMO_ADDRESSES, DEMO_USER } from './demo-account';

/*
 * Pedidos de ejemplo para presentar la cuenta y el rastreo. Sus fechas se calculan
 * respecto al día actual para que la demo siempre se vea vigente.
 */
function line(slug: string, qty: number, optionId?: string): OrderLine {
  const p = getProduct(slug)!;
  return {
    slug,
    name: p.name,
    optionLabel: p.options?.values.find((v) => v.id === optionId)?.label,
    qty,
    unitPrice: priceFor(p, optionId),
    image: p.images[0],
  };
}

const hours = (base: Date, h: number) => new Date(base.getTime() + h * 3_600_000).toISOString();

function build(id: string, daysAgo: number, steps: OrderStatus[], lines: OrderLine[], extra: Partial<Order>): Order {
  const created = new Date(Date.now() - daysAgo * 86_400_000);
  created.setHours(11, 20, 0, 0);
  const offsets = [0, 0.1, 20, 30, 44, 110];
  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
  const shipping = subtotal >= 1200 ? 0 : 130;
  const { address, ...rest } = extra;
  const a = address ?? DEMO_ADDRESSES[0];
  return {
    id,
    createdAt: created.toISOString(),
    email: DEMO_USER.email,
    customerName: DEMO_USER.name,
    phone: DEMO_USER.phone,
    shippingMethod: 'estandar',
    address: { name: a.name, phone: a.phone, street: a.street, neighborhood: a.neighborhood, zip: a.zip, city: a.city, state: a.state, references: a.references },
    payment: 'tarjeta',
    lines,
    totals: { subtotal, discount: 0, shipping, total: subtotal + shipping },
    history: steps.map((status, i) => ({ status, at: hours(created, offsets[i]) })),
    demo: true,
    ...rest,
  };
}

let cache: { day: string; orders: Order[] } | null = null;

export function demoOrders(): Order[] {
  const day = new Date().toDateString();
  if (cache?.day === day) return cache.orders;
  const orders = [
    build('VAO-10517', 1, ['recibido', 'pagado', 'preparando'], [
      line('champu-solido-romero-eucalipto', 1),
      line('acondicionador-solido-romero-eucalipto', 1),
      line('jabon-lavanda', 2),
    ], {}),
    build('VAO-10482', 4, ['recibido', 'pagado', 'preparando', 'empaquetado', 'enviado'], [
      line('champu-sangre-de-grado', 1, '1l'),
      line('tonico-capilar-aceite-de-romero', 1),
      line('velas-aromaticas', 1, 'in-lakech'),
      line('jabon-cafe', 3),
      line('cold-cream', 1),
      line('aceite-esencial-lavanda', 1),
      line('jabon-miel', 1),
    ], { payment: 'mercadopago', carrier: { name: 'Estafeta', tracking: '8055213944710' } }),
    build('VAO-10391', 35, ['recibido', 'pagado', 'preparando', 'empaquetado', 'enviado', 'entregado'], [
      line('jabon-carbon', 2),
      line('mascarillas-solidas', 1),
      line('desodorante-alumbre', 1),
    ], { payment: 'oxxo', carrier: { name: 'Estafeta', tracking: '8055198822013' }, address: DEMO_ADDRESSES[1] }),
  ];
  cache = { day, orders };
  return orders;
}

export const DEMO_ORDER_IDS = ['VAO-10482', 'VAO-10517', 'VAO-10391'];
