import { PRODUCTS } from '@/data/products';
import { categoryName, needName } from '@/data/categories';
import type { Product } from '@/data/catalog-types';
import { normalize } from './format';

const index = PRODUCTS.map((p) => ({
  p,
  name: normalize(p.name),
  rest: normalize([p.type, p.short, categoryName(p.category), ...p.needs.map(needName), p.ingredients ?? ''].join(' ')),
}));

/** Búsqueda tolerante a acentos: todas las palabras deben aparecer; el nombre pesa más. */
export function searchProducts(query: string, limit?: number): Product[] {
  const terms = normalize(query).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const scored: { p: Product; s: number }[] = [];
  for (const row of index) {
    let s = 0;
    let all = true;
    for (const t of terms) {
      const stem = t.length > 4 ? t.replace(/(es|s)$/, '') : t;
      if (row.name.includes(stem)) s += row.name.startsWith(stem) ? 6 : 4;
      else if (row.rest.includes(stem)) s += 1;
      else all = false;
    }
    if (all && s > 0) scored.push({ p: row.p, s: s + row.p.popularity / 100 });
  }
  scored.sort((a, b) => b.s - a.s);
  return (limit ? scored.slice(0, limit) : scored).map((r) => r.p);
}

export const SEARCH_SUGGESTIONS = ['Champú sólido', 'Romero', 'Lavanda', 'Caída del cabello', 'Jabón café', 'Velas'];
