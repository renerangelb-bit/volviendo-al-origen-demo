'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PiSlidersHorizontal, PiX, PiMagnifyingGlass } from 'react-icons/pi';
import { CATEGORIES, needName } from '@/data/categories';
import { PRICE_RANGES, SORTS, PAGE_SIZE, activeFilterCount, applyFilters, facetCounts, filtersToQuery, type Filters, type SortId } from '@/lib/catalog';
import { ProductCard } from '@/components/product/ProductCard';
import { Sheet } from '@/components/ui/Sheet';
import { FilterPanel } from './FilterPanel';

export function Catalog({ initial }: { initial: Filters }) {
  const [filters, setFilters] = useState<Filters>(initial);
  const [sheetOpen, setSheetOpen] = useState(false);
  const results = useMemo(() => applyFilters(filters), [filters]);
  const counts = useMemo(() => facetCounts(filters), [filters]);
  const shown = results.slice(0, filters.pagina * PAGE_SIZE);
  const category = CATEGORIES.find((c) => c.id === filters.categoria);
  const active = activeFilterCount(filters);
  const firstRender = useRef(true);

  // Mantiene la URL sincronizada sin recargar: los filtros se pueden compartir y sobreviven a una recarga.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const url = `/tienda${filtersToQuery(filters)}`;
    if (url !== window.location.pathname + window.location.search) window.history.replaceState(null, '', url);
  }, [filters]);

  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, pagina: 1, ...patch }));
  const clearAll = () => setFilters((f) => ({ ...f, categoria: null, necesidad: [], precio: null, disponibles: false, pagina: 1 }));

  const chips: { label: string; remove: () => void }[] = [];
  if (filters.q) chips.push({ label: `“${filters.q}”`, remove: () => update({ q: '', orden: filters.orden === 'relevancia' ? 'mas-vendidos' : filters.orden }) });
  if (category) chips.push({ label: category.name, remove: () => update({ categoria: null }) });
  filters.necesidad.forEach((n) => chips.push({ label: needName(n), remove: () => update({ necesidad: filters.necesidad.filter((x) => x !== n) }) }));
  if (filters.precio) chips.push({ label: PRICE_RANGES.find((r) => r.id === filters.precio)!.label, remove: () => update({ precio: null }) });
  if (filters.disponibles) chips.push({ label: 'Sin agotados', remove: () => update({ disponibles: false }) });

  const title = filters.q ? `Resultados para “${filters.q}”` : (category?.name ?? 'Tienda');
  const sortOptions = filters.q ? [{ id: 'relevancia', label: 'Más relevantes' }, ...SORTS] : SORTS;

  return (
    <div className="page pt-8 pb-16 md:pt-10">
      <nav aria-label="Ruta de navegación" className="text-xs text-humo">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <Link href="/" className="hover:text-raiz hover:underline">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            {category || filters.q ? (
              <Link href="/tienda" className="hover:text-raiz hover:underline">
                Tienda
              </Link>
            ) : (
              <span aria-current="page">Tienda</span>
            )}
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{category.name}</li>
            </>
          )}
        </ol>
      </nav>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.015em] text-raiz md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm text-humo">{category ? category.blurb : 'Cosmética sólida y artesanal, hecha en Aguascalientes.'}</p>
        </div>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
        <aside aria-label="Filtros" className="hidden lg:block">
          <div className="sticky top-36">
            <div className="flex items-center justify-between border-b border-linea pb-3">
              <p className="text-sm font-semibold tracking-[0.12em] text-raiz uppercase">Filtros</p>
              {active > 0 && (
                <button type="button" onClick={clearAll} className="link text-xs">
                  Limpiar todo
                </button>
              )}
            </div>
            <FilterPanel filters={filters} counts={counts} onChange={update} idPrefix="d" />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linea pb-4">
            <p className="text-sm text-humo" aria-live="polite">
              Mostrando {shown.length} de {results.length} {results.length === 1 ? 'producto' : 'productos'}
            </p>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button type="button" onClick={() => setSheetOpen(true)} className="btn btn-outline btn-sm flex-1 sm:flex-none lg:hidden">
                <PiSlidersHorizontal className="size-4" /> Filtros{active > 0 && ` (${active})`}
              </button>
              <label htmlFor="orden" className="sr-only">
                Ordenar por
              </label>
              <select id="orden" value={filters.orden} onChange={(e) => update({ orden: e.target.value as SortId })} className="field h-9 min-h-0 flex-1 py-1 text-sm sm:w-56 sm:flex-none">
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Ordenar: {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Filtros activos">
              {chips.map((c) => (
                <li key={c.label}>
                  <button type="button" onClick={c.remove} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-lino pr-2.5 pl-3 text-xs text-raiz hover:bg-arena" aria-label={`Quitar filtro ${c.label}`}>
                    {c.label} <PiX className="size-3.5" />
                  </button>
                </li>
              ))}
              {chips.length > 1 && (
                <li>
                  <button
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, q: '', categoria: null, necesidad: [], precio: null, disponibles: false, pagina: 1, orden: 'mas-vendidos' }))}
                    className="h-8 px-2 text-xs text-barro underline underline-offset-2"
                  >
                    Quitar todos
                  </button>
                </li>
              )}
            </ul>
          )}

          {results.length === 0 ? (
            <div className="mt-10 rounded-lg bg-lino px-6 py-12 text-center">
              <PiMagnifyingGlass className="mx-auto size-8 text-barro" aria-hidden="true" />
              <p className="mt-3 font-semibold text-raiz">No hay productos con esta combinación.</p>
              <p className="mt-1 text-sm text-humo">Quita algún filtro o busca por ingrediente, como romero, café o lavanda.</p>
              <button type="button" onClick={() => setFilters((f) => ({ ...f, q: '', categoria: null, necesidad: [], precio: null, disponibles: false, pagina: 1, orden: 'mas-vendidos' }))} className="btn btn-primary mt-6">
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5">
                {shown.map((p, i) => (
                  <li key={p.slug} className="flex">
                    <ProductCard product={p} priority={i < 3} className="w-full" sizes="(min-width: 1024px) 22vw, (min-width: 640px) 31vw, 46vw" />
                  </li>
                ))}
              </ul>
              {shown.length < results.length && (
                <div className="mt-10 text-center">
                  <p className="mb-3 text-xs text-humo">
                    Viste {shown.length} de {results.length}
                  </p>
                  <button type="button" onClick={() => setFilters((f) => ({ ...f, pagina: f.pagina + 1 }))} className="btn btn-outline min-w-56">
                    Ver más productos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} side="bottom" label="Filtros">
        <div className="flex items-center justify-between border-b border-linea px-5 py-3">
          <p className="font-semibold text-raiz">Filtros</p>
          <button type="button" onClick={() => setSheetOpen(false)} aria-label="Cerrar" className="-mr-2 grid size-11 place-items-center rounded-md text-raiz">
            <PiX className="size-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          <FilterPanel filters={filters} counts={counts} onChange={update} idPrefix="m" />
        </div>
        <div className="grid grid-cols-2 gap-2 border-t border-linea px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={clearAll} className="btn btn-outline" disabled={active === 0}>
            Limpiar
          </button>
          <button type="button" onClick={() => setSheetOpen(false)} className="btn btn-primary">
            Ver {results.length} {results.length === 1 ? 'producto' : 'productos'}
          </button>
        </div>
      </Sheet>
    </div>
  );
}
