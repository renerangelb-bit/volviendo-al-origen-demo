'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  side: 'right' | 'left' | 'bottom' | 'top';
  label: string;
  children: ReactNode;
  className?: string;
};

/** Panel modal (carrito, menú, filtros, buscador): bloquea el scroll, atrapa el foco y cierra con Escape. */
export function Sheet({ open, onClose, side, label, children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    if (!panel) return;
    const previous = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => {
      const target = panel.querySelector<HTMLElement>('[data-autofocus]') ?? panel.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus({ preventScroll: true });
    }, 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [open]);

  const position = {
    right: 'inset-y-0 right-0 w-full max-w-[26rem] translate-x-full',
    left: 'inset-y-0 left-0 w-[88%] max-w-sm -translate-x-full',
    bottom: 'inset-x-0 bottom-0 max-h-[90dvh] translate-y-full rounded-t-2xl',
    top: 'inset-x-0 top-0 max-h-[92dvh] -translate-y-full',
  }[side];

  return (
    <>
      <div className="scrim fixed inset-0 z-50 bg-raiz/45 backdrop-blur-[2px]" data-open={open} onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={label} data-open={open} className={cn('sheet fixed z-50 flex flex-col bg-hueso shadow-panel', position, className)}>
        {children}
      </div>
    </>
  );
}
