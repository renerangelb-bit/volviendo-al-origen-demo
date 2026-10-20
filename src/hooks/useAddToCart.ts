'use client';

import { useCallback } from 'react';
import type { Product } from '@/data/catalog-types';
import { useCart, maxQtyFor } from '@/store/cart';
import { useUi } from '@/store/ui';
import { lineKey } from '@/lib/pricing';

type Options = { qty?: number; optionId?: string; feedback?: 'toast' | 'drawer' };

/** Agrega al carrito con retroalimentación: aviso breve desde tarjetas, carrito lateral desde la ficha. */
export function useAddToCart() {
  const add = useCart((s) => s.add);
  const open = useUi((s) => s.open);
  const toast = useUi((s) => s.toast);

  return useCallback(
    (p: Product, { qty = 1, optionId, feedback = 'toast' }: Options = {}) => {
      const key = lineKey(p.slug, optionId);
      const before = useCart.getState().lines.find((l) => l.key === key)?.qty ?? 0;
      const after = add(p.slug, qty, optionId);
      if (after <= before) {
        toast({
          title: 'Llegaste al máximo disponible',
          description: `Puedes llevar hasta ${maxQtyFor(p.slug)} piezas de ${p.name} por pedido.`,
          tone: 'error',
        });
        return false;
      }
      const option = p.options?.values.find((v) => v.id === optionId)?.label;
      if (feedback === 'drawer') {
        open('cart');
      } else {
        toast({
          title: after - before > 1 ? `Agregaste ${after - before} piezas` : 'Agregado a tu carrito',
          description: option ? `${p.name} · ${option}` : p.name,
          image: p.images[0],
          tone: 'success',
          action: { label: 'Ver carrito', onClick: () => open('cart') },
        });
      }
      return true;
    },
    [add, open, toast],
  );
}
