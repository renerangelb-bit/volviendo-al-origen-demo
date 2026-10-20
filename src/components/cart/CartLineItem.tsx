'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PiBookmarkSimple, PiTrash } from 'react-icons/pi';
import type { ResolvedLine } from '@/lib/pricing';
import { money } from '@/lib/format';
import { maxQtyFor, useCart } from '@/store/cart';
import { useUi } from '@/store/ui';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { cn } from '@/lib/cn';

export function CartLineItem({ line, index, variant = 'drawer', onNavigate }: { line: ResolvedLine; index: number; variant?: 'drawer' | 'page'; onNavigate?: () => void }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const restore = useCart((s) => s.restore);
  const saveForLater = useCart((s) => s.saveForLater);
  const toast = useUi((s) => s.toast);
  const { product } = line;
  const max = maxQtyFor(product.slug);
  const href = `/producto/${product.slug}${line.optionId ? `?opcion=${line.optionId}` : ''}`;
  const page = variant === 'page';

  const onRemove = () => {
    const snapshot = { key: line.key, slug: line.slug, optionId: line.optionId, qty: line.qty };
    remove(line.key);
    toast({ title: 'Producto eliminado', description: product.name, action: { label: 'Deshacer', onClick: () => restore(snapshot, index) } });
  };

  return (
    <li className={cn('flex gap-3.5', page ? 'py-5 sm:gap-5' : 'py-4')}>
      <Link href={href} onClick={onNavigate} className="shrink-0 overflow-hidden rounded-md bg-lino">
        <Image src={product.images[0]} alt={product.name} width={page ? 112 : 84} height={page ? 112 : 84} className={page ? 'size-24 sm:size-28' : 'size-20'} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={href} onClick={onNavigate} className="line-clamp-2 text-sm font-medium text-raiz hover:underline sm:text-[0.9375rem]">
              {product.name}
            </Link>
            {line.optionLabel && <p className="mt-0.5 text-xs text-humo">{line.optionLabel}</p>}
            <p className="mt-0.5 text-xs text-humo">{money(line.unitPrice)} c/u</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-raiz tabular-nums">{money(line.lineTotal)}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-3">
          <QuantityStepper size="sm" value={line.qty} max={max} label={product.name} onChange={(n) => (n < 1 ? onRemove() : setQty(line.key, n))} />
          {page && (
            <button type="button" onClick={() => saveForLater(line.key)} className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-corteza hover:bg-lino">
              <PiBookmarkSimple className="size-4" /> Guardar para después
            </button>
          )}
          <button type="button" onClick={onRemove} className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-humo hover:bg-lino hover:text-alerta" aria-label={`Eliminar ${product.name}`}>
            <PiTrash className="size-4" /> {page && 'Eliminar'}
          </button>
        </div>
        {line.qty >= max && <p className="mt-1 text-xs text-humo">Máximo disponible por pedido: {max}.</p>}
      </div>
    </li>
  );
}
