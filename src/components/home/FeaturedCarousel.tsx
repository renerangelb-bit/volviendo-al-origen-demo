'use client';

import { useRef, useState, useEffect } from 'react';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import type { Product } from '@/data/catalog-types';
import { ProductCard } from '@/components/product/ProductCard';

export function FeaturedCarousel({ products }: { products: Product[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * (window.innerWidth >= 1024 ? 2 : 1), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <ul ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:px-0">
        {products.map((p, i) => (
          <li key={p.slug} className="w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-[calc(25%-15px)]">
            <ProductCard product={p} priority={i < 2} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 40vw, 68vw" />
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => scroll(-1)}
        disabled={edges.start}
        aria-label="Ver productos anteriores"
        className="absolute top-[38%] -left-5 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-linea bg-hueso text-raiz shadow-flotante transition-opacity disabled:opacity-0 lg:grid xl:-left-14"
      >
        <PiCaretLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        disabled={edges.end}
        aria-label="Ver más productos"
        className="absolute top-[38%] -right-5 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-linea bg-hueso text-raiz shadow-flotante transition-opacity disabled:opacity-0 lg:grid xl:-right-14"
      >
        <PiCaretRight className="size-5" />
      </button>
    </div>
  );
}
