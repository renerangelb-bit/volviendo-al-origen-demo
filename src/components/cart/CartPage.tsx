'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PiLockSimple, PiShoppingCartSimple, PiTrash } from 'react-icons/pi';
import { useCart } from '@/store/cart';
import { useHydrated } from '@/store/hydration';
import { computeTotals, resolveLines } from '@/lib/pricing';
import { money, plural } from '@/lib/format';
import { cn } from '@/lib/cn';
import { FEATURED_SLUGS, getProduct } from '@/data/products';
import type { Product } from '@/data/catalog-types';
import { ProductCard } from '@/components/product/ProductCard';
import { CartLineItem } from './CartLineItem';
import { CouponForm } from './CouponForm';
import { FreeShippingMeter } from './FreeShippingMeter';

export function CartPage() {
  const hydrated = useHydrated(useCart);
  const lines = useCart((s) => s.lines);
  const saved = useCart((s) => s.saved);
  const coupon = useCart((s) => s.coupon);
  const moveToCart = useCart((s) => s.moveToCart);
  const removeSaved = useCart((s) => s.removeSaved);
  const [tab, setTab] = useState<'cart' | 'saved'>('cart');
  const resolved = resolveLines(lines);
  const savedResolved = resolveLines(saved);
  const totals = computeTotals(lines, coupon);

  if (!hydrated) {
    return (
      <div className="page py-10" aria-busy="true">
        <div className="h-9 w-56 animate-pulso rounded bg-lino" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulso rounded-lg bg-lino" />
            ))}
          </div>
          <div className="h-80 animate-pulso rounded-lg bg-lino" />
        </div>
      </div>
    );
  }

  const suggestions = FEATURED_SLUGS.map(getProduct)
    .filter((p): p is Product => !!p && !lines.some((l) => l.slug === p.slug))
    .slice(0, 4);

  return (
    <div className="page pt-8 pb-20 md:pt-10">
      <h1 className="text-3xl font-semibold tracking-[-0.015em] text-raiz md:text-4xl">Tu carrito</h1>

      <div className="mt-6 flex gap-6 border-b border-linea" role="tablist" aria-label="Carrito y productos guardados">
        {(
          [
            ['cart', `Agregados (${totals.itemCount})`],
            ['saved', `Guardados (${saved.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn('-mb-px border-b-2 pb-3 text-sm font-medium transition-colors', tab === id ? 'border-raiz text-raiz' : 'border-transparent text-humo hover:text-raiz')}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'saved' ? (
        <div className="py-6" role="tabpanel">
          {savedResolved.length === 0 ? (
            <p className="py-10 text-center text-sm text-humo">Aquí aparecen los productos que guardes para después.</p>
          ) : (
            <ul className="divide-y divide-linea">
              {savedResolved.map((l) => (
                <li key={l.key} className="flex items-center gap-4 py-4">
                  <Image src={l.product.images[0]} alt="" width={80} height={80} className="size-20 rounded-md bg-lino" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/producto/${l.slug}`} className="text-sm font-medium text-raiz hover:underline">
                      {l.product.name}
                    </Link>
                    {l.optionLabel && <p className="text-xs text-humo">{l.optionLabel}</p>}
                    <p className="text-sm text-humo">
                      {money(l.unitPrice)} · {plural(l.qty, 'pieza', 'piezas')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button type="button" onClick={() => moveToCart(l.key)} className="btn btn-primary btn-sm" disabled={l.product.stock <= 0}>
                      Mover al carrito
                    </button>
                    <button type="button" onClick={() => removeSaved(l.key)} className="btn btn-sm text-humo hover:text-alerta" aria-label={`Quitar ${l.product.name} de guardados`}>
                      <PiTrash className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : resolved.length === 0 ? (
        <div className="py-12 text-center" role="tabpanel">
          <PiShoppingCartSimple className="mx-auto size-12 text-arena-oscura" aria-hidden="true" />
          <p className="mt-4 text-lg font-semibold text-raiz">Tu carrito está vacío</p>
          <p className="mt-1 text-sm text-humo">Descubre nuestros jabones, champús sólidos y aceites hechos a mano.</p>
          <Link href="/tienda" className="btn btn-primary mt-6">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="mt-2 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-12" role="tabpanel">
          <ul className="divide-y divide-linea">
            {resolved.map((l, i) => (
              <CartLineItem key={l.key} line={l} index={i} variant="page" />
            ))}
          </ul>

          <aside aria-label="Resumen de compra" className="h-fit space-y-5 rounded-xl border border-linea bg-white p-5 lg:sticky lg:top-36">
            <h2 className="text-lg font-semibold text-raiz">Resumen de compra</h2>
            <FreeShippingMeter remaining={totals.remainingForFree} />
            <CouponForm />
            <dl className="space-y-2 border-t border-linea pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-humo">Subtotal ({plural(totals.itemCount, 'producto', 'productos')})</dt>
                <dd className="tabular-nums">{money(totals.subtotal)}</dd>
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
              <div className="flex justify-between border-t border-linea pt-3 text-base font-semibold text-raiz">
                <dt>Total estimado</dt>
                <dd className="tabular-nums">{money(totals.total)}</dd>
              </div>
            </dl>
            <p className="text-xs text-humo">IVA incluido. El costo final de envío depende del método que elijas al pagar.</p>
            <Link href="/checkout" className="btn btn-primary w-full">
              Continuar al pago
            </Link>
            <Link href="/tienda" className="block text-center text-sm text-barro underline underline-offset-2">
              Seguir comprando
            </Link>
            <p className="flex items-center justify-center gap-1.5 text-xs text-humo">
              <PiLockSimple className="size-4" /> Pago seguro con tarjeta, Mercado Pago, SPEI u OXXO
            </p>
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="mt-16 border-t border-linea pt-12" aria-labelledby="sugeridos">
          <h2 id="sugeridos" className="section-title">
            También te puede gustar
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {suggestions.map((p) => (
              <li key={p.slug} className="flex">
                <ProductCard product={p} className="w-full" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
