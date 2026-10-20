import { COMMERCE, type ShippingMethodId } from '@/data/site';
import { getProduct, priceFor } from '@/data/products';
import type { Product } from '@/data/catalog-types';

export type CartLine = { key: string; slug: string; optionId?: string; qty: number };

export const lineKey = (slug: string, optionId?: string) => (optionId ? `${slug}::${optionId}` : slug);

export type ResolvedLine = CartLine & { product: Product; unitPrice: number; optionLabel?: string; lineTotal: number };

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const l of lines) {
    const product = getProduct(l.slug);
    if (!product) continue;
    const unitPrice = priceFor(product, l.optionId);
    const optionLabel = product.options?.values.find((v) => v.id === l.optionId)?.label;
    out.push({ ...l, product, unitPrice, optionLabel, lineTotal: unitPrice * l.qty });
  }
  return out;
}

export function findCoupon(code: string | null | undefined) {
  if (!code) return undefined;
  return COMMERCE.coupons.find((c) => c.code === code.trim().toUpperCase());
}

export type Totals = {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  /** null cuando aún no se elige método (carrito): se muestra como estimado. */
  shippingMethod: ShippingMethodId | null;
  freeShipping: boolean;
  remainingForFree: number;
  total: number;
};

export function computeTotals(lines: CartLine[], couponCode?: string | null, method: ShippingMethodId | null = null): Totals {
  const resolved = resolveLines(lines);
  const itemCount = resolved.reduce((n, l) => n + l.qty, 0);
  const subtotal = resolved.reduce((n, l) => n + l.lineTotal, 0);
  const coupon = findCoupon(couponCode);
  const discount = coupon ? Math.round(subtotal * coupon.percent) / 100 : 0;
  const net = subtotal - discount;
  const freeShipping = net >= COMMERCE.freeShippingFrom;
  const m = COMMERCE.shippingMethods.find((s) => s.id === (method ?? 'estandar'))!;
  let shipping = m.price;
  if (m.freeEligible && freeShipping) shipping = 0;
  if (itemCount === 0) shipping = 0;
  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    shippingMethod: method,
    freeShipping,
    remainingForFree: Math.max(0, COMMERCE.freeShippingFrom - net),
    total: Math.max(0, net + shipping),
  };
}
