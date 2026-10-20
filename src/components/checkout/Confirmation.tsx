'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PiCheckCircle, PiCopy, PiEnvelopeSimple, PiInfo } from 'react-icons/pi';
import { useOrders, findOrder } from '@/store/orders';
import { useAccount } from '@/store/account';
import { useHydrated } from '@/store/hydration';
import { useUi } from '@/store/ui';
import { COMMERCE } from '@/data/site';
import { PAYMENT_METHODS, estimatedDelivery } from '@/lib/orders';
import { money, formatDateLocal, formatRange } from '@/lib/format';
import { OrderTimeline } from '@/components/orders/OrderTimeline';

export function Confirmation({ orderId }: { orderId: string }) {
  const hydrated = useHydrated(useOrders);
  const orders = useOrders((s) => s.orders);
  const user = useAccount((s) => s.user);
  const toast = useUi((s) => s.toast);
  const order = findOrder(orders, orderId);

  if (!hydrated) return <div className="page h-[60vh] animate-pulso py-10" aria-busy="true" />;

  if (!order) {
    return (
      <div className="page py-16 text-center">
        <h1 className="text-2xl font-semibold text-raiz">No encontramos ese pedido</h1>
        <p className="mt-2 text-humo">Revisa el enlace de tu correo de confirmación o búscalo en la página de rastreo.</p>
        <Link href="/rastreo" className="btn btn-primary mt-6">
          Rastrear un pedido
        </Link>
      </div>
    );
  }

  const pay = PAYMENT_METHODS.find((m) => m.id === order.payment)!;
  const ship = COMMERCE.shippingMethods.find((m) => m.id === order.shippingMethod)!;
  const eta = estimatedDelivery(order);
  const firstName = order.customerName.split(' ')[0];
  const pending = !pay.instant;

  return (
    <div className="page max-w-4xl pt-10 pb-20">
      <div className="text-center">
        <PiCheckCircle className="mx-auto size-14 text-musgo" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.015em] text-raiz md:text-4xl">¡Gracias, {firstName}!</h1>
        <p className="mt-3 text-base text-corteza">
          {pending ? 'Recibimos tu pedido' : 'Tu pedido está confirmado'}: <strong className="font-semibold text-raiz">{order.id}</strong>
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-humo">
          <PiEnvelopeSimple className="size-4" aria-hidden="true" /> Enviamos los detalles a {order.email}
        </p>
      </div>

      {pending && (
        <div className="mt-8 rounded-xl border border-oro/40 bg-[#fbf3e3] p-5">
          <p className="flex items-center gap-2 font-semibold text-raiz">
            <PiInfo className="size-5 text-oro" aria-hidden="true" /> Completa tu pago para que preparemos tu pedido
          </p>
          <p className="mt-2 text-sm text-corteza">
            {order.payment === 'oxxo'
              ? 'Presenta esta referencia en cualquier tienda OXXO dentro de las próximas 48 horas:'
              : 'Transfiere el total a la siguiente CLABE desde tu banca en línea (SPEI) usando la referencia:'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <code className="rounded-md bg-hueso px-3 py-2 font-mono text-lg tracking-wider text-raiz">{order.paymentReference}</code>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                void navigator.clipboard?.writeText(order.paymentReference ?? '');
                toast({ title: 'Referencia copiada', tone: 'success' });
              }}
            >
              <PiCopy className="size-4" /> Copiar
            </button>
            <span className="text-sm text-corteza">Total a pagar: {money(order.totals.total)}</span>
          </div>
          {order.payment === 'spei' && <p className="mt-2 text-xs text-humo">CLABE de demostración: 012 010 01234567890 1 (BBVA)</p>}
        </div>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-linea bg-white p-5" aria-labelledby="estado">
          <h2 id="estado" className="text-base font-semibold text-raiz">
            Estado del pedido
          </h2>
          <div className="mt-4">
            <OrderTimeline order={order} orientation="horizontal" />
          </div>
          <p className="mt-5 text-sm text-corteza">
            {order.shippingMethod === 'tienda' ? 'Listo para recoger a partir del' : 'Entrega estimada'}{' '}
            <strong className="font-semibold text-raiz">
              {order.shippingMethod === 'tienda' ? formatDateLocal(eta.from.toISOString()) : formatRange(eta.from, eta.to)}
            </strong>
          </p>
          <Link href={`/rastreo?pedido=${order.id}`} className="btn btn-primary mt-5 w-full">
            Rastrear mi pedido
          </Link>
        </section>

        <section className="rounded-xl border border-linea bg-white p-5 text-sm" aria-labelledby="entrega">
          <h2 id="entrega" className="text-base font-semibold text-raiz">
            Entrega y pago
          </h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-xs text-humo">{ship.name}</dt>
              <dd className="text-tinta">
                {order.address ? (
                  <>
                    {order.address.street}, {order.address.neighborhood}, {order.address.zip} {order.address.city}, {order.address.state}
                  </>
                ) : (
                  '28 de Agosto #410, Barrio de la Estación, Aguascalientes'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-humo">Forma de pago</dt>
              <dd className="text-tinta">
                {pay.name} {pending ? '(pendiente)' : '(aprobado)'}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-linea bg-white p-5" aria-labelledby="productos">
        <h2 id="productos" className="text-base font-semibold text-raiz">
          Productos
        </h2>
        <ul className="mt-2 divide-y divide-linea">
          {order.lines.map((l) => (
            <li key={`${l.slug}-${l.optionLabel ?? ''}`} className="flex items-center gap-3 py-3 text-sm">
              <Image src={l.image} alt="" width={56} height={56} className="size-14 rounded-md bg-lino" />
              <span className="min-w-0 flex-1">
                <span className="block text-raiz">{l.name}</span>
                <span className="text-xs text-humo">
                  {l.optionLabel ? `${l.optionLabel} · ` : ''}
                  {l.qty} × {money(l.unitPrice)}
                </span>
              </span>
              <span className="tabular-nums">{money(l.qty * l.unitPrice)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-1.5 border-t border-linea pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-humo">Subtotal</dt>
            <dd className="tabular-nums">{money(order.totals.subtotal)}</dd>
          </div>
          {order.totals.discount > 0 && (
            <div className="flex justify-between text-musgo">
              <dt>Descuento ({order.coupon})</dt>
              <dd className="tabular-nums">−{money(order.totals.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-humo">Envío</dt>
            <dd className="tabular-nums">{order.totals.shipping === 0 ? 'Gratis' : money(order.totals.shipping)}</dd>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold text-raiz">
            <dt>Total</dt>
            <dd className="tabular-nums">{money(order.totals.total)}</dd>
          </div>
        </dl>
      </section>

      {!user && (
        <section className="mt-6 flex flex-col items-start gap-4 rounded-xl bg-lino p-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h2 className="text-base font-semibold text-raiz">Guarda tus datos para la próxima</h2>
            <p className="mt-1 text-sm text-corteza">Con una cuenta ves tus pedidos, su rastreo y tus direcciones en un solo lugar.</p>
          </div>
          <Link href={`/cuenta?registro=${encodeURIComponent(order.email)}`} className="btn btn-outline shrink-0">
            Crear mi cuenta
          </Link>
        </section>
      )}

      <div className="mt-8 text-center">
        <Link href="/tienda" className="link text-sm">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
