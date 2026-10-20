import type { Metadata } from 'next';
import { Catalog } from '@/components/shop/Catalog';
import { parseFilters, filtersToQuery } from '@/lib/catalog';
import { CATEGORIES } from '@/data/categories';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const cat = CATEGORIES.find((c) => c.id === f.categoria);
  if (f.q) return { title: `Búsqueda: ${f.q}`, robots: { index: false, follow: true } };
  if (cat) return { title: cat.name, description: `${cat.blurb} Cosmética sólida artesanal de Aguascalientes.` };
  return { title: 'Tienda', description: 'Jabones artesanales, champús y acondicionadores sólidos, aceites esenciales y accesorios sin plástico.' };
}

export default async function TiendaPage({ searchParams }: Props) {
  const filters = parseFilters(await searchParams);
  // La key reinicia el catálogo cuando se navega a otra búsqueda (por ejemplo, desde el buscador del encabezado).
  return <Catalog key={filtersToQuery(filters)} initial={filters} />;
}
