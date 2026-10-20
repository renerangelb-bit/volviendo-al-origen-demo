import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { makeReference, nextStatus, type Order, type OrderStatus } from '@/lib/orders';
import { demoOrders } from '@/data/demo-orders';

type OrdersState = {
  orders: Order[];
  counter: number;
  create: (o: Omit<Order, 'id' | 'createdAt' | 'history' | 'paymentReference'> & { paid: boolean }) => Order;
  advance: (id: string) => OrderStatus | null;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      counter: 10600,
      create: ({ paid, ...input }) => {
        const n = get().counter + 1 + Math.floor(Math.random() * 7);
        const now = new Date().toISOString();
        const order: Order = {
          ...input,
          id: `VAO-${n}`,
          createdAt: now,
          paymentReference: paid ? undefined : makeReference(n),
          history: paid
            ? [
                { status: 'recibido', at: now },
                { status: 'pagado', at: now },
              ]
            : [{ status: 'recibido', at: now }],
        };
        set((s) => ({ orders: [order, ...s.orders], counter: n }));
        return order;
      },
      advance: (id) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order) return null;
        const next = nextStatus(order);
        if (!next) return null;
        const at = new Date().toISOString();
        const carrier =
          next === 'enviado' && order.shippingMethod !== 'tienda'
            ? { name: order.shippingMethod === 'express' ? 'DHL Express' : 'Estafeta', tracking: makeReference(Number(order.id.slice(4)) + 17).replace(/ /g, '') }
            : order.carrier;
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, carrier, history: [...o.history, { status: next, at }] } : o)) }));
        return next;
      },
    }),
    { name: 'vao-orders', version: 1, storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);

/** Busca en los pedidos de este navegador y en los pedidos de ejemplo de la demo. */
export function findOrder(orders: Order[], id: string): Order | undefined {
  return orders.find((o) => o.id === id) ?? demoOrders().find((o) => o.id === id);
}
