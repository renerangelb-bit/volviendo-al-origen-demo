'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { PiCopy, PiMagnifyingGlass, PiPackage, PiArrowClockwise, PiWhatsappLogo } from 'react-icons/pi';
import { useOrders, findOrder } from '@/store/orders';
import { useHydrated } from '@/store/hydration';
import { useUi } from '@/store/ui';
import { COMMERCE, SITE } from '@/data/site';
import { DEMO_ORDER_IDS } from '@/data/demo-orders';
import { currentStatus, estimatedDelivery, nextStatus, normalizeOrderId, statusCopy } from '@/lib/orders';
import { money, formatDateLocal, formatRange, plural } from '@/lib/format';
import { OrderTimeline } from './OrderTimeline';

export function TrackingPage({ initialId }: { initialId: string }) {
  const hydrated = useHydrated(useOrders);
  const orders = useOrders((s) => s.orders);
  const advance = useOrders((s) => s.advance);
  const toast = useUi((s) => s.toast);
  const [input, setInput] = useState(initialId);
  const [query, setQuery] = useState(initialId);
  const [error, setError] = useState('');

  const lookup = (raw: string) => {
    const id = normalizeOrderId(raw);
    if (!id) {
      setError('Escribe el número de tu pedido, por ejemplo VAO-10482.');
      return;
    }
    setError('');
    setInput(id);
    setQuery(id);
    window.history.replaceState(null, '', `/rastreo?pedido=${id}`);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    lookup(input);
  };

  const order = query && hydrated ? findOrder(orders, query) : undefined;
  const local = order && !order.demo;
  const st = order ? statusCopy(currentStatus(order), order.shippingMethod) : null;
  const eta = order ? estimatedDelivery(order) : null;
  const delivered = order ? currentStatus(order) === 'entregado' : false;

  return (
    <div className="page max-w-4xl pt-10 pb-20">
      <h1 className="text-3xl font-semibold tracking-[-0.015em] text-raiz md:text-4xl">Rastrea tu pedido</h1>
      <p className="mt-2 text-humo">Consulta en qué va tu compra con el número que te enviamos por correo.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 rounded-xl border border-linea bg-white p-4 sm:p-5">
        <label htmlFor="pedido" className="text-sm font-medium text-raiz">
          Número de pedido
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <PiPackage className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-humo" aria-hidden="true" />
            <input
              id="pedido"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="VAO-10482"
              autoComplete="off"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'pedido-error' : 'pedido-hint'}
              className="field pl-11 uppercase"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <PiMagnifyingGlass className="size-4" /> Rastrear
          </button>
        </div>
        {error ? (
          <p id="pedido-error" className="mt-2 text-sm text-alerta">
            {error}
          </p>
        ) : (
          <div id="pedido-hint" className="mt-3 flex flex-wrap items-center gap-2 text-xs text-humo">
            Pedidos de ejemplo:
            {DEMO_ORDER_IDS.map((id) => (
              <button key={id} type="button" onClick={() => lookup(id)} className="rounded-full border border-linea px-2.5 py-1 font-medium text-raiz hover:border-raiz">
                {id}
              </button>
            ))}
          </div>
        )}
      </form>

      {query && !hydrated && <div className="mt-8 h-80 animate-pulso rounded-xl bg-lino" aria-busy="true" />}

      {query && hydrated && !order && (
        <div className="mt-8 rounded-xl bg-lino p-6 text-center" role="status">
          <p className="font-semibold text-raiz">No encontramos el pedido {query}.</p>
          <p className="mt-1 text-sm text-corteza">Revisa que el número coincida con el de tu correo de confirmación. Si el problema sigue, escríbenos.</p>
          <a href={`${SITE.whatsapp}?text=${encodeURIComponent(`Hola, no encuentro mi pedido ${query}`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-5">
            <PiWhatsappLogo className="size-5" /> Escribir por WhatsApp
          </a>
        </div>
      )}

      {order && st && eta && (
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_17rem]">
          <section className="rounded-xl border border-linea bg-white p-5 sm:p-6" aria-labelledby="pedido-titulo">
            <p className="text-sm text-humo">Pedido {order.id}</p>
            <h2 id="pedido-titulo" className="mt-1 text-2xl font-semibold text-raiz">
              {st.label}
            </h2>
            <p className="mt-1 text-sm text-corteza">{st.detail}</p>
            {!delivered && (
              <p className="mt-3 text-sm text-corteza">
                {order.shippingMethod === 'tienda' ? 'Listo para recoger a partir del ' : 'Entrega estimada: '}
                <strong className="font-semibold text-raiz">
                  {order.shippingMethod === 'tienda' ? formatDateLocal(eta.from.toISOString()) : formatRange(eta.from, eta.to)}
                </strong>
              </p>
            )}

            {order.carrier && (
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg bg-lino p-3.5 text-sm">
                <span className="text-corteza">
                  {order.carrier.name} · Guía <strong className="font-mono font-semibold tracking-wide text-raiz">{order.carrier.tracking}</strong>
                </span>
                <button
                  type="button"
                  className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-barro"
                  onClick={() => {
                    void navigator.clipboard?.writeText(order.carrier!.tracking);
                    toast({ title: 'Guía copiada', description: `Pégala en el sitio de ${order.carrier!.name}.`, tone: 'success' });
                  }}
                >
                  <PiCopy className="size-4" /> Copiar guía
                </button>
              </div>
            )}

            <div className="mt-6 border-t border-linea pt-6">
              <OrderTimeline order={order} />
            </div>

            {local && !delivered && (
              <div className="mt-6 rounded-lg border border-dashed border-arena-oscura p-4">
                <p className="text-xs text-humo">Demostración: así se verá cuando el equipo actualice el estado desde el panel de WooCommerce (el cliente recibe un correo en cada cambio).</p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm mt-3"
                  onClick={() => {
                    const next = advance(order.id);
                    if (next) toast({ title: `Pedido ${order.id} actualizado`, description: statusCopy(next, order.shippingMethod).label, tone: 'success' });
                  }}
                >
                  <PiArrowClockwise className="size-4" /> Simular siguiente estado
                </button>
                {nextStatus(order) && <span className="ml-2 text-xs text-humo">Siguiente: {statusCopy(nextStatus(order)!, order.shippingMethod).label}</span>}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <section className="rounded-xl border border-linea bg-white p-5 text-sm" aria-labelledby="entrega-r">
              <h2 id="entrega-r" className="font-semibold text-raiz">
                {COMMERCE.shippingMethods.find((m) => m.id === order.shippingMethod)!.name}
              </h2>
              <p className="mt-2 text-corteza">
                {order.address ? (
                  <>
                    {order.customerName}
                    <br />
                    {order.address.street}, {order.address.neighborhood}
                    <br />
                    {order.address.zip} {order.address.city}, {order.address.state}
                  </>
                ) : (
                  <>28 de Agosto #410, Barrio de la Estación, Aguascalientes</>
                )}
              </p>
            </section>
            <section className="rounded-xl border border-linea bg-white p-5 text-sm" aria-labelledby="productos-r">
              <h2 id="productos-r" className="font-semibold text-raiz">
                {plural(
                  order.lines.reduce((n, l) => n + l.qty, 0),
                  'producto',
                  'productos',
                )}{' '}
                · {money(order.totals.total)}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {order.lines.map((l) => (
                  <li key={`${l.slug}-${l.optionLabel ?? ''}`} className="flex items-center gap-2.5">
                    <Image src={l.image} alt="" width={40} height={40} className="size-10 rounded bg-lino" />
                    <span className="min-w-0 flex-1 truncate text-corteza">
                      {l.qty} × {l.name}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <p className="text-xs text-humo">
              ¿Algo no se ve bien?{' '}
              <Link href="/contacto?motivo=pedido" className="link">
                Contáctanos
              </Link>
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
