'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data/catalog-types';
import { minPrice } from '@/data/products';
import { money } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useAddToCart } from '@/hooks/useAddToCart';
import { Stars } from '@/components/ui/Stars';
import { FavoriteRibbon } from './FavoriteButton';

type Props = { product: Product; priority?: boolean; className?: string; sizes?: string };

export function ProductCard({ product: p, priority = false, className, sizes = '(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw' }: Props) {
  const addToCart = useAddToCart();
  const href = `/producto/${p.slug}`;
  const soldOut = p.stock <= 0;
  const optionVerb = p.options?.name === 'Aroma' ? 'Elegir aroma' : 'Elegir presentación';

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative">
        <Link href={href} className="relative block aspect-square overflow-hidden rounded-lg border border-linea bg-lino" tabIndex={-1} aria-hidden="true">
          <Image src={p.images[0]} alt="" fill sizes={sizes} preload={priority} className="object-cover transition-opacity duration-500 group-hover:opacity-0" />
          <Image src={p.images[1]} alt="" fill sizes={sizes} className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {soldOut && <span className="absolute inset-0 bg-hueso/35" />}
        </Link>
        <FavoriteRibbon slug={p.slug} name={p.name} />
        {(soldOut || p.badge) && (
          <span
            className={cn(
              'absolute top-2.5 right-2.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold',
              soldOut ? 'bg-raiz text-hueso' : p.badge === 'Nuevo' ? 'bg-musgo text-hueso' : 'bg-hueso/95 text-raiz ring-1 ring-linea',
            )}
          >
            {soldOut ? 'Agotado' : p.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <p className="text-xs text-humo">{p.type}</p>
        <h3 className="mt-0.5 text-sm leading-snug font-medium text-raiz sm:text-[0.9375rem]">
          <Link href={href} className="after:absolute after:inset-0 after:z-0 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-barro">
            {p.name}
          </Link>
        </h3>
        <Stars rating={p.rating} count={p.reviewCount} className="mt-1.5" />
        <p className="mt-1.5 text-[0.9375rem] font-semibold text-raiz tabular-nums">{p.options && minPrice(p) !== p.price ? `Desde ${money(minPrice(p))}` : money(p.price)}</p>
        <div className="relative z-10 mt-auto pt-3">
          {soldOut ? (
            <Link href={`${href}#avisame`} className="btn btn-outline btn-sm w-full">
              Avísame
            </Link>
          ) : p.options ? (
            <Link href={href} className="btn btn-outline btn-sm w-full">
              {optionVerb}
            </Link>
          ) : (
            <button type="button" onClick={() => addToCart(p)} className="btn btn-outline btn-sm w-full" aria-label={`Agregar ${p.name} al carrito`}>
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
