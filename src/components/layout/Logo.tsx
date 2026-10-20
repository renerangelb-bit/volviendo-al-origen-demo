import { cn } from '@/lib/cn';

/** Emblema de anillos (como los de un tronco: el origen) + nombre. Sustituir por el logotipo oficial en producción. */
export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none" stroke="currentColor">
      <circle cx="24" cy="24" r="22" strokeWidth="2.2" />
      <circle cx="24.6" cy="23.4" r="17.5" strokeWidth="1.4" strokeDasharray="9 2.5" />
      <circle cx="23.6" cy="24.4" r="13" strokeWidth="1.6" />
      <circle cx="24.4" cy="23.8" r="8.6" strokeWidth="1.3" strokeDasharray="5 2" />
      <circle cx="24" cy="24" r="4.4" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-raiz', className)}>
      <Emblem className={compact ? 'size-9' : 'size-10 md:size-12'} />
      <span className="flex flex-col text-left leading-[1.02] tracking-[-0.01em]">
        <span className={cn('font-medium', compact ? 'text-[0.95rem]' : 'text-[1rem] md:text-[1.15rem]')}>Volviendo</span>
        <span className={cn('font-medium', compact ? 'text-[0.95rem]' : 'text-[1rem] md:text-[1.15rem]')}>al Origen</span>
      </span>
    </span>
  );
}
