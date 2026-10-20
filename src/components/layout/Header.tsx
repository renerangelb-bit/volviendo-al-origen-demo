'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PiFacebookLogo, PiInstagramLogo, PiList, PiMagnifyingGlass, PiShoppingCartSimple, PiUser, PiWhatsappLogo, PiX, PiPackage, PiMapPin } from 'react-icons/pi';
import { NAV, SITE } from '@/data/site';
import { useCart } from '@/store/cart';
import { useAccount } from '@/store/account';
import { useHydrated } from '@/store/hydration';
import { useUi } from '@/store/ui';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { Sheet } from '@/components/ui/Sheet';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href === '/tienda') return pathname.startsWith('/tienda') || pathname.startsWith('/producto');
  return pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const panel = useUi((s) => s.panel);
  const open = useUi((s) => s.open);
  const close = useUi((s) => s.close);
  const cartHydrated = useHydrated(useCart);
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const user = useAccount((s) => s.user);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el menú móvil al navegar.
  useEffect(() => {
    if (useUi.getState().panel === 'menu') close();
  }, [pathname, close]);

  const shownCount = cartHydrated ? count : 0;
  const firstName = user?.name.split(' ')[0];

  return (
    <>
    <header className={cn('sticky top-0 z-40 bg-hueso/95 backdrop-blur-md transition-shadow', scrolled && 'shadow-[0_1px_0_var(--color-linea)]')}>
      <div className="page grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
        <div className="flex items-center gap-1">
          <button type="button" className="-ml-2 grid size-11 place-items-center rounded-md text-raiz md:hidden" aria-label="Abrir menú" onClick={() => open('menu')}>
            <PiList className="size-6" />
          </button>
          <div className="hidden items-center gap-1 md:flex">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-9 place-items-center rounded-full text-raiz hover:bg-lino">
              <PiWhatsappLogo className="size-5" />
            </a>
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid size-9 place-items-center rounded-full text-raiz hover:bg-lino">
              <PiFacebookLogo className="size-5" />
            </a>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-full text-raiz hover:bg-lino">
              <PiInstagramLogo className="size-5" />
            </a>
          </div>
        </div>

        <Link href="/" aria-label="Volviendo al Origen, ir al inicio" className="rounded-md">
          <Logo />
        </Link>

        <div className="flex items-center justify-end gap-0.5 md:gap-1.5">
          <button type="button" aria-label="Buscar productos" onClick={() => open('search')} className="grid size-11 place-items-center rounded-md text-raiz hover:bg-lino">
            <PiMagnifyingGlass className="size-[1.4rem]" />
          </button>
          <Link href="/cuenta" className="hidden h-11 items-center gap-2 rounded-md px-2 text-sm text-raiz hover:bg-lino md:flex" aria-label={firstName ? `Mi cuenta, ${firstName}` : 'Iniciar sesión'}>
            <PiUser className="size-[1.35rem]" />
            <span className="max-w-28 truncate">{firstName ? `Hola, ${firstName}` : 'Iniciar sesión'}</span>
          </Link>
          <button
            type="button"
            onClick={() => open('cart')}
            aria-label={`Abrir carrito, ${shownCount} ${shownCount === 1 ? 'producto' : 'productos'}`}
            className="relative -mr-2 grid size-11 place-items-center rounded-md text-raiz hover:bg-lino"
          >
            <PiShoppingCartSimple className="size-[1.55rem]" />
            {shownCount > 0 && (
              <span key={shownCount} className="absolute top-1 right-0.5 grid min-w-[1.15rem] animate-subir place-items-center rounded-full bg-barro px-1 text-[0.6875rem] leading-[1.15rem] font-semibold text-hueso">
                {shownCount > 99 ? '99+' : shownCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav aria-label="Principal" className="hidden border-t border-linea/70 md:block">
        <ul className="page flex h-11 items-center justify-center gap-8 text-[0.8125rem] font-medium">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative py-3 text-humo transition-colors hover:text-raiz',
                    active && 'text-raiz after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:bg-raiz',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>

    {/* Fuera del <header>: su backdrop-filter crearía un bloque contenedor para los elementos fixed. */}
    <Sheet open={panel === 'menu'} onClose={close} side="left" label="Menú">
        <div className="flex items-center justify-between border-b border-linea px-4 py-3">
          <Logo compact />
          <button type="button" onClick={close} aria-label="Cerrar menú" className="grid size-11 place-items-center rounded-md text-raiz">
            <PiX className="size-6" />
          </button>
        </div>
        <nav aria-label="Menú móvil" className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="divide-y divide-linea">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  className={cn('flex h-14 items-center text-lg', isActive(pathname, item.href) ? 'font-semibold text-raiz' : 'text-tinta')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-2">
            <Link href="/cuenta" onClick={close} className="flex h-12 items-center gap-3 rounded-md bg-lino px-4 text-sm font-medium text-raiz">
              <PiUser className="size-5" /> {firstName ? `Mi cuenta (${firstName})` : 'Iniciar sesión o crear cuenta'}
            </Link>
            <Link href="/rastreo" onClick={close} className="flex h-12 items-center gap-3 rounded-md bg-lino px-4 text-sm font-medium text-raiz">
              <PiPackage className="size-5" /> Rastrear mi pedido
            </Link>
          </div>
          <div className="mt-8 space-y-3 text-sm text-humo">
            <p className="flex gap-2">
              <PiMapPin className="mt-0.5 size-4 shrink-0" />
              {SITE.address.street}, {SITE.address.neighborhood}, {SITE.address.city}
            </p>
            <div className="flex gap-2">
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-11 place-items-center rounded-full border border-linea text-raiz">
                <PiWhatsappLogo className="size-5" />
              </a>
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid size-11 place-items-center rounded-full border border-linea text-raiz">
                <PiFacebookLogo className="size-5" />
              </a>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-11 place-items-center rounded-full border border-linea text-raiz">
                <PiInstagramLogo className="size-5" />
              </a>
            </div>
          </div>
        </nav>
    </Sheet>
    </>
  );
}
