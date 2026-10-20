import type { ShippingMethodId } from '@/data/site';

export type OrderStatus = 'recibido' | 'pagado' | 'preparando' | 'empaquetado' | 'enviado' | 'entregado';

export const STATUS_FLOW: OrderStatus[] = ['recibido', 'pagado', 'preparando', 'empaquetado', 'enviado', 'entregado'];

export type PaymentMethodId = 'tarjeta' | 'mercadopago' | 'spei' | 'oxxo';

export const PAYMENT_METHODS: { id: PaymentMethodId; name: string; detail: string; instant: boolean }[] = [
  { id: 'tarjeta', name: 'Tarjeta de crédito o débito', detail: 'Visa, Mastercard y American Express. Pago seguro en la pasarela.', instant: true },
  { id: 'mercadopago', name: 'Mercado Pago', detail: 'Paga con tu saldo, tarjetas guardadas o meses sin intereses.', instant: true },
  { id: 'spei', name: 'Transferencia SPEI', detail: 'Recibes una CLABE para transferir; confirmamos en minutos.', instant: false },
  { id: 'oxxo', name: 'Efectivo en OXXO', detail: 'Recibes una referencia para pagar en tienda; vigencia de 48 horas.', instant: false },
];

export type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  neighborhood: string;
  zip: string;
  city: string;
  state: string;
  references?: string;
};

export type OrderLine = { slug: string; name: string; optionLabel?: string; qty: number; unitPrice: number; image: string };

export type Order = {
  id: string;
  createdAt: string;
  email: string;
  customerName: string;
  phone: string;
  shippingMethod: ShippingMethodId;
  address?: Omit<Address, 'id' | 'label'>;
  payment: PaymentMethodId;
  paymentReference?: string;
  lines: OrderLine[];
  coupon?: string;
  totals: { subtotal: number; discount: number; shipping: number; total: number };
  history: { status: OrderStatus; at: string }[];
  carrier?: { name: string; tracking: string };
  /** Pedidos de la cuenta demo (no se pueden avanzar manualmente). */
  demo?: boolean;
};

export function statusCopy(status: OrderStatus, method: ShippingMethodId) {
  const pickup = method === 'tienda';
  const map: Record<OrderStatus, { label: string; detail: string }> = {
    recibido: { label: 'Pedido recibido', detail: 'Registramos tu compra y te enviamos un correo de confirmación.' },
    pagado: { label: 'Pago confirmado', detail: 'La pasarela aprobó tu pago.' },
    preparando: { label: 'Preparando', detail: 'Estamos reuniendo y revisando tus productos uno por uno.' },
    empaquetado: {
      label: 'Empaquetado',
      detail: pickup ? 'Tu pedido está empacado sin plástico.' : 'Tu pedido está empacado sin plástico y listo para la paquetería.',
    },
    enviado: pickup
      ? { label: 'Listo para recoger', detail: 'Pasa por él a 28 de Agosto #410 con tu número de pedido.' }
      : { label: 'Enviado', detail: 'La paquetería ya tiene tu paquete. Usa la guía para seguirlo.' },
    entregado: pickup
      ? { label: 'Recogido', detail: '¡Gracias por volver al origen!' }
      : { label: 'Entregado', detail: '¡Gracias por volver al origen!' },
  };
  return map[status];
}

export const currentStatus = (o: Order) => o.history[o.history.length - 1]?.status ?? 'recibido';

export function nextStatus(o: Order): OrderStatus | null {
  const i = STATUS_FLOW.indexOf(currentStatus(o));
  return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
}

/** Fecha estimada de entrega (días hábiles) a partir de la creación del pedido. */
export function estimatedDelivery(o: Order): { from: Date; to: Date } {
  const range: Record<ShippingMethodId, [number, number]> = { estandar: [4, 8], express: [2, 4], tienda: [1, 1] };
  const [a, b] = range[o.shippingMethod];
  return { from: addBusinessDays(new Date(o.createdAt), a), to: addBusinessDays(new Date(o.createdAt), b) };
}

function addBusinessDays(d: Date, n: number) {
  const out = new Date(d);
  let added = 0;
  while (added < n) {
    out.setDate(out.getDate() + 1);
    const day = out.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return out;
}

export function normalizeOrderId(raw: string) {
  const digits = raw.replace(/\D/g, '');
  return digits ? `VAO-${digits}` : '';
}

export function makeReference(seed: number) {
  const s = String(Math.abs(seed * 7919) % 1e10).padStart(10, '0');
  return `${s.slice(0, 4)} ${s.slice(4, 8)} ${s.slice(8)}`;
}
