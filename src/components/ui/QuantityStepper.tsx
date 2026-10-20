'use client';

import { PiMinus, PiPlus } from 'react-icons/pi';
import { cn } from '@/lib/cn';

type Props = {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max: number;
  label: string;
  size?: 'sm' | 'md';
  className?: string;
};

export function QuantityStepper({ value, onChange, min = 1, max, label, size = 'md', className }: Props) {
  const h = size === 'sm' ? 'h-9' : 'h-12';
  const w = size === 'sm' ? 'w-9' : 'w-11';
  return (
    <div className={cn('inline-flex items-center rounded-md border border-borde bg-white', h, className)} role="group" aria-label={`Cantidad de ${label}`}>
      <button
        type="button"
        className={cn('grid h-full place-items-center text-raiz disabled:text-arena-oscura', w)}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Quitar uno"
      >
        <PiMinus className="size-4" />
      </button>
      <output className={cn('min-w-8 text-center font-semibold tabular-nums', size === 'sm' ? 'text-sm' : 'text-base')} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={cn('grid h-full place-items-center text-raiz disabled:text-arena-oscura', w)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Agregar uno"
      >
        <PiPlus className="size-4" />
      </button>
    </div>
  );
}
