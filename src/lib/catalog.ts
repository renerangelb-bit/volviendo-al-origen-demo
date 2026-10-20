import { PRODUCTS, minPrice } from '@/data/products';
import { CATEGORIES, NEEDS } from '@/data/categories';
import type { CategoryId, NeedId, Product } from '@/data/catalog-types';
import { searchProducts } from './search';

export const SORTS = [
  { id: 'mas-vendidos', label: 'Más vendidos' },
  { id: 'novedades', label: 'Novedades' },
  { id: 'precio-asc', label: 'Precio: menor a mayor' },
  { id: 'precio-desc', label: 'Precio: mayor a menor' },
  { id: 'nombre', label: 'Nombre (A–Z)' },
] as const;
export type SortId = (typeof SORTS)[number]['id'] | 'relevancia';

export const PRICE_RANGES = [
  { id: 'hasta-100', label: 'Hasta $100', test: (n: number) => n <= 100 },
  { id: '100-200', label: '$100 a $200', test: (n: number) => n > 100 && n <= 200 },
  { id: 'mas-200', label: 'Más de $200', test: (n: number) => n > 200 },
] as const;
export type PriceId = (typeof PRICE_RANGES)[number]['id'];

export const PAGE_SIZE = 12;

export type Filters = {
  q: string;
  categoria: CategoryId | null;
  necesidad: NeedId[];
  precio: PriceId | null;
  disponibles: boolean;
  orden: SortId;
  pagina: number;
};

type Raw = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

export function parseFilters(sp: Raw): Filters {
  const q = first(sp.q).slice(0, 80);
  const cat = first(sp.categoria);
  const needs = first(sp.necesidad)
    .split(',')
    .filter((n): n is NeedId => NEEDS.some((x) => x.id === n));
  const precio = first(sp.precio);
  const orden = first(sp.orden);
  const pagina = Math.max(1, Math.min(20, parseInt(first(sp.pagina), 10) || 1));
  return {
    q,
    categoria: CATEGORIES.some((c) => c.id === cat) ? (cat as CategoryId) : null,
    necesidad: needs,
    precio: PRICE_RANGES.some((p) => p.id === precio) ? (precio as PriceId) : null,
    disponibles: first(sp.disponibles) === '1',
    orden: SORTS.some((s) => s.id === orden) ? (orden as SortId) : q ? 'relevancia' : 'mas-vendidos',
    pagina,
  };
}

export function filtersToQuery(f: Filters) {
  const sp = new URLSearchParams();
  if (f.q) sp.set('q', f.q);
  if (f.categoria) sp.set('categoria', f.categoria);
  if (f.necesidad.length) sp.set('necesidad', f.necesidad.join(','));
  if (f.precio) sp.set('precio', f.precio);
  if (f.disponibles) sp.set('disponibles', '1');
  if (f.orden !== 'relevancia' && f.orden !== 'mas-vendidos') sp.set('orden', f.orden);
  if (f.pagina > 1) sp.set('pagina', String(f.pagina));
  const s = sp.toString();
  return s ? `?${s}` : '';
}

function base(f: Pick<Filters, 'q'>): Product[] {
  return f.q ? searchProducts(f.q) : PRODUCTS;
}

function matches(p: Product, f: Filters, skip?: 'categoria' | 'necesidad' | 'precio') {
  if (skip !== 'categoria' && f.categoria && p.category !== f.categoria) return false;
  if (skip !== 'necesidad' && f.necesidad.length && !f.necesidad.some((n) => p.needs.includes(n))) return false;
  if (skip !== 'precio' && f.precio) {
    const r = PRICE_RANGES.find((x) => x.id === f.precio)!;
    if (!r.test(minPrice(p))) return false;
  }
  if (f.disponibles && p.stock <= 0) return false;
  return true;
}

export function applyFilters(f: Filters): Product[] {
  const list = base(f).filter((p) => matches(p, f));
  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, 'es');
  switch (f.orden) {
    case 'relevancia':
      return list;
    case 'novedades':
      return [...list].sort((a, b) => b.addedAt.localeCompare(a.addedAt) || byName(a, b));
    case 'precio-asc':
      return [...list].sort((a, b) => minPrice(a) - minPrice(b) || byName(a, b));
    case 'precio-desc':
      return [...list].sort((a, b) => minPrice(b) - minPrice(a) || byName(a, b));
    case 'nombre':
      return [...list].sort(byName);
    default:
      // Más vendidos; los agotados al final.
      return [...list].sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || b.popularity - a.popularity);
  }
}

/** Conteos por opción considerando el resto de filtros activos (facetas). */
export function facetCounts(f: Filters) {
  const pool = base(f);
  const cats = Object.fromEntries(CATEGORIES.map((c) => [c.id, pool.filter((p) => p.category === c.id && matches(p, f, 'categoria')).length])) as Record<CategoryId, number>;
  const needs = Object.fromEntries(NEEDS.map((n) => [n.id, pool.filter((p) => p.needs.includes(n.id) && matches(p, f, 'necesidad')).length])) as Record<NeedId, number>;
  const prices = Object.fromEntries(PRICE_RANGES.map((r) => [r.id, pool.filter((p) => r.test(minPrice(p)) && matches(p, f, 'precio')).length])) as Record<PriceId, number>;
  return { cats, needs, prices };
}

export function activeFilterCount(f: Filters) {
  return (f.categoria ? 1 : 0) + f.necesidad.length + (f.precio ? 1 : 0) + (f.disponibles ? 1 : 0);
}
