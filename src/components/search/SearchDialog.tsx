'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { PiMagnifyingGlass, PiX } from 'react-icons/pi';
import { Sheet } from '@/components/ui/Sheet';
import { useUi } from '@/store/ui';
import { searchProducts, SEARCH_SUGGESTIONS } from '@/lib/search';
import { money } from '@/lib/format';
import { categoryName } from '@/data/categories';
import { minPrice } from '@/data/products';

export function SearchDialog() {
  const open = useUi((s) => s.panel === 'search');
  const close = useUi((s) => s.close);
  const router = useRouter();
  const [q, setQ] = useState('');
  const results = useMemo(() => searchProducts(q), [q]);

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  const go = (query: string) => {
    if (!query.trim()) return;
    close();
    router.push(`/tienda?q=${encodeURIComponent(query.trim())}`);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(q);
  };

  return (
    <Sheet open={open} onClose={close} side="top" label="Buscar productos" className="max-h-[92dvh]">
      <div className="page w-full py-4 md:py-6">
        <form onSubmit={onSubmit} role="search" className="flex items-center gap-2">
          <label htmlFor="buscador" className="sr-only">
            Buscar productos
          </label>
          <div className="relative flex-1">
            <PiMagnifyingGlass className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-humo" aria-hidden="true" />
            <input
              id="buscador"
              data-autofocus
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              placeholder="Busca champú, jabón de café, lavanda…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="field h-13 pl-11 text-base"
            />
          </div>
          <button type="button" onClick={close} aria-label="Cerrar buscador" className="grid size-12 place-items-center rounded-md text-raiz hover:bg-lino">
            <PiX className="size-6" />
          </button>
        </form>

        <div className="mt-5 overflow-y-auto">
          {!q.trim() ? (
            <div>
              <p className="text-sm text-humo">Búsquedas frecuentes</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => setQ(s)} className="rounded-full border border-linea bg-white px-4 py-2 text-sm text-raiz hover:border-raiz">
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : results.length === 0 ? (
            <div className="py-6">
              <p className="font-medium text-raiz">No encontramos productos para “{q.trim()}”.</p>
              <p className="mt-1 text-sm text-humo">Prueba con un ingrediente (romero, café, lavanda) o una necesidad como “caída del cabello”.</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-humo" aria-live="polite">
                {results.length} {results.length === 1 ? 'producto' : 'productos'}
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {results.slice(0, 6).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/producto/${p.slug}`} onClick={close} className="flex items-center gap-3 rounded-lg p-2 hover:bg-lino">
                      <Image src={p.images[0]} alt="" width={64} height={64} className="size-16 shrink-0 rounded-md bg-lino" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-raiz">{p.name}</span>
                        <span className="block text-xs text-humo">{categoryName(p.category)}</span>
                        <span className="block text-sm text-raiz">{p.options ? `Desde ${money(minPrice(p))}` : money(p.price)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => go(q)} className="btn btn-outline mt-4 w-full sm:w-auto">
                Ver los {results.length} resultados en la tienda
              </button>
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
}
