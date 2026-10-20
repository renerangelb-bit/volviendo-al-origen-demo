import { PiTruck } from 'react-icons/pi';
import { COMMERCE } from '@/data/site';
import { money } from '@/lib/format';

export function FreeShippingMeter({ remaining, compact = false }: { remaining: number; compact?: boolean }) {
  const pct = Math.min(100, Math.round(((COMMERCE.freeShippingFrom - remaining) / COMMERCE.freeShippingFrom) * 100));
  const reached = remaining <= 0;
  return (
    <div className={compact ? '' : 'rounded-lg bg-lino p-3.5'}>
      <p className="flex items-center gap-2 text-sm text-raiz">
        <PiTruck className="size-5 shrink-0 text-barro" aria-hidden="true" />
        {reached ? (
          <span>
            <strong className="font-semibold">Tu envío estándar es gratis.</strong>
          </span>
        ) : (
          <span>
            Te faltan <strong className="font-semibold">{money(remaining)}</strong> para el envío gratis.
          </span>
        )}
      </p>
      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-arena"
        role="progressbar"
        aria-label="Avance hacia el envío gratis"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className="h-full rounded-full bg-musgo transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
