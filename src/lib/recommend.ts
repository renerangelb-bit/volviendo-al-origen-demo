import { PRODUCTS, getProduct } from '@/data/products';
import type { Product } from '@/data/catalog-types';

/** Un complemento lógico para lo que ya hay en el carrito (rutina capilar, cuidado del jabón…). */
export function complementFor(slugs: string[]): { product: Product; reason: string } | null {
  const inCart = new Set(slugs);
  const items = slugs.map(getProduct).filter(Boolean) as Product[];
  const hasShampoo = items.some((p) => p.type === 'Champú sólido');
  const hasConditioner = items.some((p) => p.type === 'Acondicionador sólido');
  const hasBar = items.some((p) => p.art.kind === 'bar' || p.art.kind === 'puck' || p.art.kind === 'conditioner');
  const pick = (slug: string, reason: string) => {
    const p = getProduct(slug);
    return p && !inCart.has(slug) && p.stock > 0 ? { product: p, reason } : null;
  };
  if (hasShampoo && !hasConditioner) {
    const r = pick('acondicionador-solido-romero-eucalipto', 'Completa tu rutina capilar');
    if (r) return r;
  }
  if (hasBar) {
    const r = pick('estropajo-jabonero', 'Para que tu jabón dure hasta el final');
    if (r) return r;
  }
  if (items.some((p) => p.category === 'aceites')) {
    const r = pick('velas-aromaticas', 'Aromas para tu espacio');
    if (r && !r.product.options) return r;
  }
  const popular = PRODUCTS.filter((p) => !inCart.has(p.slug) && p.stock > 0 && !p.options).sort((a, b) => b.popularity - a.popularity)[0];
  return popular ? { product: popular, reason: 'Lo más pedido esta semana' } : null;
}
