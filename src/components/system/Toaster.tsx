'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PiCheckCircle, PiWarningCircle, PiX } from 'react-icons/pi';
import { useUi } from '@/store/ui';
import { cn } from '@/lib/cn';

export function Toaster() {
  const toasts = useUi((s) => s.toasts);
  const dismiss = useUi((s) => s.dismiss);
  return (
    <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed inset-x-0 bottom-3 z-[60] flex flex-col items-center gap-2 px-3 sm:top-24 sm:bottom-auto sm:items-end sm:px-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.tone === 'error' ? 'alert' : 'status'}
          className="pointer-events-auto flex w-full max-w-sm animate-subir items-center gap-3 rounded-lg border border-linea bg-hueso p-3 pr-2 shadow-flotante"
        >
          {t.image ? (
            <Image src={t.image} alt="" width={56} height={56} className="size-14 shrink-0 rounded-md bg-lino object-cover" />
          ) : t.tone === 'error' ? (
            <PiWarningCircle className="size-6 shrink-0 text-alerta" aria-hidden="true" />
          ) : (
            <PiCheckCircle className="size-6 shrink-0 text-musgo" aria-hidden="true" />
          )}
          <div className="min-w-0 flex-1">
            <p className={cn('text-sm font-semibold', t.tone === 'error' ? 'text-alerta' : 'text-raiz')}>{t.title}</p>
            {t.description && <p className="truncate text-sm text-humo">{t.description}</p>}
            {t.action &&
              (t.action.href ? (
                <Link href={t.action.href} className="link text-sm font-medium" onClick={() => dismiss(t.id)}>
                  {t.action.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className="link text-sm font-medium"
                  onClick={() => {
                    t.action?.onClick?.();
                    dismiss(t.id);
                  }}
                >
                  {t.action.label}
                </button>
              ))}
          </div>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Cerrar aviso" className="grid size-9 shrink-0 place-items-center self-start rounded-md text-humo hover:bg-lino">
            <PiX className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
