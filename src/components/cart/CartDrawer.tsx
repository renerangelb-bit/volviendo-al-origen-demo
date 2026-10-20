'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PiShoppingCartSimple, PiX, PiPlus } from 'react-icons/pi';
import { Sheet } from '@/components/ui/Sheet';
import { useUi } from '@/store/ui';
import { useCart } from '@/store/cart';
import { useHydrated } from '@/store/hydration';
import { computeTotals, resolveLines } from '@/lib/pricing';
import { money, plural } from '@/lib/format';
import { complementFor } from '@/lib/recommend';
import { PRODUCTS } from '@/data/products';
import { useAddToCart } from '@/hooks/useAddToCart';
import { CartLineItem } from './CartLineItem';
import { FreeShippingMeter } from './FreeShippingMeter';

export function CartDrawer() {
  const open = useUi((s) => s.panel === 'cart');
  const close = useUi((s) => s.close);
  const hydrated = useHydrated(useCart);
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.coupon);
  const addToCart = useAddToCart();
  const resolved = resolveLines(lines);
  const totals = computeTotals(lines, coupon);
  const complement = complementFor(lines.map((l) => l.slug));
  const empty = hydrated && resolved.length === 0;

  return (
    <Sheet open={open} onClose={close} side="right" label="Tu carrito">
      <div className="flex items-center justify-between border-b border-linea px-5 py-4">
        <h2 className="text-base font-semibold text-raiz">
          Tu carrito {totals.itemCount > 0 && <span className="font-normal text-humo">({plural(totals.itemCount, 'producto', 'productos')})</span>}
        </h2>
        <button type="button" onClick={close} aria-label="Cerrar carrito" className="-mr-2 grid size-11 place-items-center rounded-md text-raiz hover:bg-lino">
          <PiX className="size-6" />
        </button>
      </div>

      {empty ? (
        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8">
          <div className="text-center">
            <PiShoppingCartSimple className="mx-auto size-10 text-arena-oscura" aria-hidden="true" />
            <p className="mt-3 font-semibold text-raiz">Tu carrito está vacío</p>
            <p className="mt-1 text-sm text-humo">Empieza por lo que más nos piden.</p>
          </div>
          <ul className="mt-6 divide-y divide-linea border-y border-linea">
            {PRODUCTS.filter((p) => p.badge === 'Más vendido' && !p.options)
              .slice(0, 3)
              .map((p) => (
                <li key={p.slug} className="flex items-center gap-3 py-3">
                  <Image src={p.images[0]} alt="" width={56} height={56} className="size-14 rounded-md bg-lino" />
                  <Link href={`/producto/${p.slug}`} onClick={close} className="min-w-0 flex-1 text-sm text-raiz hover:underline">
                    <span className="line-clamp-2">{p.name}</span>
                    <span className="text-humo">{money(p.price)}</span>
                  </Link>
                  <button type="button" onClick={() => addToCart(p)} className="btn btn-outline btn-sm" aria-label={`Agregar ${p.name} al carrito`}>
                    <PiPlus className="size-3.5" /> Agregar
                  </button>
                </li>
              ))}
          </ul>
          <Link href="/tienda" onClick={close} className="btn btn-primary mt-6">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5">
            <div className="pt-4">
              <FreeShippingMeter remaining={totals.remainingForFree} />
            </div>
            {!hydrated ? (
              <div className="space-y-3 py-6" aria-hidden="true">
                {[0, 1].map((i) => (
                  <div key={i} className="h-20 animate-pulso rounded-md bg-lino" />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-linea">
                {resolved.map((l, i) => (
                  <CartLineItem key={l.key} line={l} index={i} onNavigate={close} />
                ))}
              </ul>
            )}
            {complement && hydrated && (
              <div className="mb-5 rounded-lg border border-linea p-3">
                <p className="text-xs font-medium text-humo">{complement.reason}</p>
                <div className="mt-2 flex items-center gap-3">
                  <Image src={complement.product.images[0]} alt="" width={56} height={56} className="size-14 rounded-md bg-lino" />
                  <Link href={`/producto/${complement.product.slug}`} onClick={close} className="min-w-0 flex-1 text-sm text-raiz hover:underline">
                    <span className="line-clamp-2">{complement.product.name}</span>
                    <span className="text-humo">{money(complement.product.price)}</span>
                  </Link>
                  <button type="button" onClick={() => addToCart(complement.product)} className="btn btn-outline btn-sm" aria-label={`Agregar ${complement.product.name} al carrito`}>
                    <PiPlus className="size-3.5" /> Agregar
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-linea bg-hueso px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-humo">Subtotal</dt>
                <dd className="font-medium tabular-nums">{money(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-musgo">
                  <dt>Descuento ({coupon})</dt>
                  <dd className="tabular-nums">−{money(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-humo">Envío estándar</dt>
                <dd className="tabular-nums">{totals.shipping === 0 ? 'Gratis' : money(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-linea pt-2 text-base font-semibold text-raiz">
                <dt>Total estimado</dt>
                <dd className="tabular-nums">{money(totals.total)}</dd>
              </div>
            </dl>
            <div className="mt-4 grid gap-2">
              <Link href="/checkout" onClick={close} className="btn btn-primary">
                Pagar ahora
              </Link>
              <Link href="/carrito" onClick={close} className="btn btn-outline">
                Ver carrito
              </Link>
            </div>
          </div>
        </>
      )}
    </Sheet>
  );
}
