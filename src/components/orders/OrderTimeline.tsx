import { PiCheck } from 'react-icons/pi';
import { STATUS_FLOW, currentStatus, statusCopy, type Order } from '@/lib/orders';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/cn';

/** Línea de tiempo con los estados operativos de la propuesta: recibido → pagado → preparando → empaquetado → enviado → entregado. */
export function OrderTimeline({ order, orientation = 'vertical' }: { order: Order; orientation?: 'vertical' | 'horizontal' }) {
  const current = currentStatus(order);
  const reachedIndex = STATUS_FLOW.indexOf(current);

  if (orientation === 'horizontal') {
    const copy = statusCopy(current, order.shippingMethod);
    return (
      <div>
        <ol className="grid grid-cols-6 gap-1" aria-label="Avance del pedido">
          {STATUS_FLOW.map((s, i) => (
            <li key={s} aria-current={s === current ? 'step' : undefined}>
              <span className={cn('block h-1.5 rounded-full', i <= reachedIndex ? 'bg-musgo' : 'bg-arena')} />
              <span className="sr-only">{statusCopy(s, order.shippingMethod).label}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-corteza">
          Paso {reachedIndex + 1} de {STATUS_FLOW.length}: <strong className="font-semibold text-raiz">{copy.label}</strong>
        </p>
      </div>
    );
  }

  return (
    <ol className="relative" aria-label="Historial del pedido">
      {STATUS_FLOW.map((s, i) => {
        const copy = statusCopy(s, order.shippingMethod);
        const event = order.history.find((h) => h.status === s);
        const done = i <= reachedIndex;
        const isCurrent = s === current;
        const last = i === STATUS_FLOW.length - 1;
        return (
          <li key={s} className="relative flex gap-4 pb-7 last:pb-0" aria-current={isCurrent ? 'step' : undefined}>
            {!last && <span className={cn('absolute top-8 bottom-0 left-[0.9375rem] w-0.5', i < reachedIndex ? 'bg-musgo' : 'bg-arena')} aria-hidden="true" />}
            <span
              className={cn(
                'relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2',
                done ? 'border-musgo bg-musgo text-hueso' : 'border-arena-oscura bg-hueso text-humo',
                isCurrent && 'ring-4 ring-musgo/20',
              )}
            >
              {done ? <PiCheck className="size-4" aria-hidden="true" /> : <span className="text-xs font-semibold">{i + 1}</span>}
            </span>
            <div className="pt-1">
              <p className={cn('text-sm font-semibold', done ? 'text-raiz' : 'text-humo')}>
                {copy.label}
                {isCurrent && <span className="ml-2 rounded-full bg-musgo-claro px-2 py-0.5 text-[0.6875rem] font-semibold text-musgo">Estado actual</span>}
              </p>
              {done && <p className="mt-0.5 text-sm text-corteza">{copy.detail}</p>}
              {event && <p className="mt-0.5 text-xs text-humo">{formatDateTime(event.at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
