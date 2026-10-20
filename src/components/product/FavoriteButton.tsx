'use client';

import { useAccount } from '@/store/account';
import { useHydrated } from '@/store/hydration';
import { useUi } from '@/store/ui';
import { cn } from '@/lib/cn';

/** Listón de "Guardar" (como en el mockup de la tienda) que agrega el producto a favoritos. */
export function FavoriteRibbon({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const hydrated = useHydrated(useAccount);
  const fav = useAccount((s) => s.favorites.includes(slug));
  const toggle = useAccount((s) => s.toggleFavorite);
  const toast = useUi((s) => s.toast);
  const on = hydrated && fav;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
      title={on ? 'Quitar de favoritos' : 'Guardar'}
      onClick={() => {
        const added = toggle(slug);
        toast({
          title: added ? 'Guardado en favoritos' : 'Quitado de favoritos',
          description: name,
          action: added ? { label: 'Ver favoritos', href: '/cuenta?vista=favoritos' } : undefined,
        });
      }}
      className={cn('group/fav absolute top-0 left-3 z-10 grid h-12 w-9 place-items-start justify-center pt-0', className)}
    >
      <svg viewBox="0 0 28 38" className="h-10 w-7 drop-shadow-sm transition-transform group-hover/fav:translate-y-0.5" aria-hidden="true">
        <path d="M2 0h24v35l-12-8-12 8z" className={cn('transition-colors', on ? 'fill-raiz' : 'fill-hueso/90 stroke-raiz')} strokeWidth="1.5" />
        {on && <path d="M9 13l3.5 3.5L19 10" stroke="#fffdf9" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </button>
  );
}
