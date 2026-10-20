'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PiCheck } from 'react-icons/pi';
import { getProduct } from '@/data/products';
import type { Product } from '@/data/catalog-types';
import { money } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useCart } from '@/store/cart';
import { useUi } from '@/store/ui';

const ROUTINES = [
  {
    id: 'graso',
    name: 'Cabello graso',
    intro: 'Limpieza profunda sin resecar las puntas.',
    steps: ['champu-solido-carbon-menta', 'acondicionador-solido-romero-eucalipto', 'tonico-capilar-aceite-de-romero'],
    guide: '/blog/rutina-para-cabello-graso',
  },
  {
    id: 'caida',
    name: 'Caída del cabello',
    intro: 'La sangre de grado y el romero, nuestros aliados de siempre.',
    steps: ['champu-solido-jamaica', 'tonico-capilar-aceite-de-romero', 'aceite-de-jojoba'],
    guide: '/blog/nuestro-primer-paso-al-origen',
  },
  {
    id: 'sensible',
    name: 'Piel sensible',
    intro: 'Fórmulas suaves con manzanilla, avena y caléndula.',
    steps: ['jabon-jazmin-manzanilla', 'jabon-almendra-y-avena', 'aceite-calendula'],
    guide: '/tienda?necesidad=piel-sensible',
  },
];

const STEP_LABEL = ['Limpia', 'Equilibra', 'Nutre'];

export function Routines() {
  const [active, setActive] = useState(ROUTINES[0].id);
  const add = useCart((s) => s.add);
  const open = useUi((s) => s.open);
  const routine = ROUTINES.find((r) => r.id === active)!;
  const products = routine.steps.map(getProduct).filter(Boolean) as Product[];
  const total = products.reduce((n, p) => n + p.price, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-12">
      <div>
        <h2 className="section-title">Arma tu rutina</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-humo">Tres pasos que funcionan juntos. Elige tu necesidad y llévate la rutina completa.</p>
        <div className="mt-6 flex flex-wrap gap-2 lg:flex-col" role="tablist" aria-label="Rutinas">
          {ROUTINES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              id={`tab-${r.id}`}
              aria-selected={r.id === active}
              aria-controls="rutina-panel"
              onClick={() => setActive(r.id)}
              className={cn(
                'rounded-full border px-4 py-2.5 text-left text-sm transition-colors lg:rounded-md lg:px-4 lg:py-3',
                r.id === active ? 'border-raiz bg-raiz text-hueso' : 'border-linea bg-white text-raiz hover:border-raiz',
              )}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      <div id="rutina-panel" role="tabpanel" aria-labelledby={`tab-${routine.id}`} key={routine.id} className="animate-aparecer">
        <p className="text-sm text-humo">{routine.intro}</p>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.slug} className="card-surface flex gap-3 p-3 sm:flex-col sm:p-4">
              <Link href={`/producto/${p.slug}`} className="relative block size-24 shrink-0 overflow-hidden rounded-md bg-lino sm:aspect-square sm:size-auto">
                <Image src={p.images[0]} alt={p.name} fill sizes="(min-width: 640px) 20vw, 96px" className="object-cover" />
              </Link>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-barro">
                  Paso {i + 1}: {STEP_LABEL[i].toLowerCase()}
                </p>
                <Link href={`/producto/${p.slug}`} className="mt-1 block text-sm font-medium text-raiz hover:underline">
                  {p.name}
                </Link>
                <p className="mt-1 text-sm text-humo">{money(p.price)}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              products.forEach((p) => add(p.slug, 1));
              open('cart');
            }}
          >
            Agregar la rutina ({money(total)})
          </button>
          <Link href={routine.guide} className="link text-sm">
            Cómo usarla paso a paso
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-musgo sm:ml-auto">
            <PiCheck className="size-4" /> Tus productos se suman al carrito actual
          </span>
        </div>
      </div>
    </div>
  );
}
