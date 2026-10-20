'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PiCheckCircle, PiHandHeart, PiLeaf, PiPackage, PiTruck, PiWhatsappLogo, PiBell } from 'react-icons/pi';
import type { Product } from '@/data/catalog-types';
import { priceFor } from '@/data/products';
import { categoryName } from '@/data/categories';
import { COMMERCE, SITE } from '@/data/site';
import { money } from '@/lib/format';
import { cn } from '@/lib/cn';
import { isEmail } from '@/lib/validation';
import { maxQtyFor, useCart } from '@/store/cart';
import { useAccount } from '@/store/account';
import { useAddToCart } from '@/hooks/useAddToCart';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Stars } from '@/components/ui/Stars';
import { FavoriteRibbon } from './FavoriteButton';

function StockAlert({ product }: { product: Product }) {
  const add = useAccount((s) => s.addStockAlert);
  const user = useAccount((s) => s.user);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) return setError('Escribe un correo válido.');
    add(product.slug, email.trim());
    setSent(email.trim());
  };
  return (
    <div id="avisame" className="scroll-mt-40 rounded-lg border border-linea bg-lino p-4">
      {sent ? (
        <p className="flex gap-2 text-sm text-raiz" role="status">
          <PiCheckCircle className="mt-0.5 size-5 shrink-0 text-musgo" /> Te escribiremos a {sent} en cuanto vuelva {product.name}.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <p className="flex items-center gap-2 text-sm font-semibold text-raiz">
            <PiBell className="size-5 text-barro" /> Avísame cuando esté disponible
          </p>
          <div className="mt-3 flex gap-2">
            <label htmlFor="alerta-email" className="sr-only">
              Correo electrónico
            </label>
            <input
              id="alerta-email"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              className="field min-w-0 flex-1"
            />
            <button type="submit" className="btn btn-primary shrink-0">
              Avisarme
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-alerta">{error}</p>}
        </form>
      )}
    </div>
  );
}

export function ProductView({ product: p }: { product: Product }) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const options = p.options?.values ?? [];
  const [optionId, setOptionId] = useState<string | undefined>(options[0]?.id);
  const [qty, setQty] = useState(1);
  const [image, setImage] = useState(0);
  const [stuck, setStuck] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const inCart = useCart((s) => s.lines.find((l) => l.slug === p.slug && l.optionId === optionId)?.qty ?? 0);
  const soldOut = p.stock <= 0;
  const max = Math.max(1, maxQtyFor(p.slug) - inCart);
  const price = priceFor(p, optionId);
  const option = options.find((o) => o.id === optionId);
  const optionImage = p.art.kind === 'candle' && optionId ? `/images/products/${p.slug}--${optionId}.webp` : null;
  const gallery = optionImage ? [optionImage, ...p.images] : p.images;

  // Opción desde la URL (?opcion=) para abrir la variante correcta desde el carrito o un enlace compartido.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('opcion');
    if (fromUrl && options.some((o) => o.id === fromUrl)) setOptionId(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setQty((q) => Math.min(q, max));
  }, [max]);

  // Barra fija en móvil cuando el botón principal queda arriba de la vista (también con saltos de scroll).
  useEffect(() => {
    const el = buyRef.current;
    if (!el || soldOut) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      setStuck(el.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [soldOut]);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    document.documentElement.style.setProperty('--chat-offset', stuck && mobile ? '4.75rem' : '0px');
    return () => {
      document.documentElement.style.removeProperty('--chat-offset');
    };
  }, [stuck]);

  const chooseOption = (id: string) => {
    setOptionId(id);
    setImage(0);
    const url = new URL(window.location.href);
    url.searchParams.set('opcion', id);
    window.history.replaceState(null, '', url.pathname + url.search);
  };

  const add = (feedback: 'drawer' | 'toast' = 'drawer') => addToCart(p, { qty, optionId, feedback });
  const buyNow = () => {
    if (inCart === 0) addToCart(p, { qty, optionId, feedback: 'toast' });
    router.push('/checkout');
  };

  const stockText = soldOut
    ? 'Agotado por ahora'
    : p.stock <= 5
      ? `Últimas ${p.stock} piezas`
      : 'Disponible · sale en 1 a 2 días hábiles';

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
      {/* Galería */}
      <div className="md:sticky md:top-36 md:self-start">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-linea bg-lino">
          {gallery.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? `${p.name}${option ? `, ${option.label}` : ''}` : `${p.name}, detalle`}
              fill
              preload={i === 0}
              sizes="(min-width: 768px) 46vw, 100vw"
              className={cn('object-cover transition-opacity duration-500', i === image ? 'opacity-100' : 'opacity-0')}
            />
          ))}
          <FavoriteRibbon slug={p.slug} name={p.name} className="left-4" />
          {soldOut && <span className="absolute top-3 right-3 rounded-full bg-raiz px-3 py-1 text-xs font-semibold text-hueso">Agotado</span>}
        </div>
        <div className="mt-3 flex gap-3" role="group" aria-label="Imágenes del producto">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setImage(i)}
              aria-label={`Ver imagen ${i + 1} de ${gallery.length}`}
              aria-pressed={i === image}
              className={cn('relative size-20 overflow-hidden rounded-lg border-2 bg-lino transition-colors', i === image ? 'border-raiz' : 'border-transparent hover:border-arena-oscura')}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Compra */}
      <div>
        <p className="text-sm text-humo">
          <Link href={`/tienda?categoria=${p.category}`} className="hover:text-raiz hover:underline">
            {categoryName(p.category)}
          </Link>{' '}
          / {p.type}
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-[-0.015em] text-raiz md:text-[2.5rem]">{p.name}</h1>
        <a href="#opiniones" className="mt-3 inline-flex items-center gap-2 text-sm text-humo hover:text-raiz">
          <Stars rating={p.rating} size="md" /> <span className="underline underline-offset-2">{p.reviewCount} opiniones</span>
        </a>
        <p className="mt-5 text-3xl font-semibold text-raiz tabular-nums">{money(price)}</p>
        <p className="mt-1 text-xs text-humo">Precio en pesos mexicanos, IVA incluido.</p>
        <p className="mt-5 text-base leading-relaxed text-corteza">{p.short}</p>

        {p.options && (
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-raiz">
              {p.options.name}: <span className="font-normal text-humo">{option?.label}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.options.values.map((o) => (
                <label
                  key={o.id}
                  className={cn(
                    'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md border px-3.5 py-2 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-barro',
                    o.id === optionId ? 'border-raiz bg-raiz text-hueso' : 'border-borde bg-white text-raiz hover:border-raiz',
                  )}
                >
                  <input type="radio" name="opcion" value={o.id} checked={o.id === optionId} onChange={() => chooseOption(o.id)} className="sr-only" />
                  {o.swatch && <span className="size-4 rounded-full ring-1 ring-black/10" style={{ background: o.swatch }} aria-hidden="true" />}
                  {o.label}
                  {o.price && o.price !== p.price && <span className={o.id === optionId ? 'text-hueso/80' : 'text-humo'}>{money(o.price)}</span>}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <p className={cn('mt-6 flex items-center gap-2 text-sm', soldOut ? 'text-alerta' : 'text-musgo')}>
          <span className={cn('size-2 rounded-full', soldOut ? 'bg-alerta' : 'bg-musgo')} aria-hidden="true" />
          {stockText}
        </p>

        {soldOut ? (
          <div className="mt-4">
            <StockAlert product={p} />
          </div>
        ) : (
          <div ref={buyRef} className="mt-4 flex flex-wrap gap-3">
            <QuantityStepper value={qty} onChange={setQty} max={max} label={p.name} />
            <button type="button" onClick={() => add('drawer')} className="btn btn-primary min-w-0 flex-1" disabled={maxQtyFor(p.slug) - inCart <= 0}>
              Agregar al carrito
            </button>
            <button type="button" onClick={buyNow} className="btn btn-outline w-full">
              Comprar ahora
            </button>
            {inCart > 0 && (
              <p className="w-full text-xs text-humo">
                Ya tienes {inCart} en tu carrito.{' '}
                <Link href="/carrito" className="link">
                  Ver carrito
                </Link>
              </p>
            )}
          </div>
        )}

        <ul className="mt-6 grid gap-3 rounded-lg border border-linea p-4 text-sm text-corteza">
          <li className="flex gap-3">
            <PiTruck className="size-5 shrink-0 text-barro" aria-hidden="true" />
            <span>
              Envío gratis en compras mayores a {money(COMMERCE.freeShippingFrom)}. Envío estándar {money(130)}, o recoge gratis en tienda.
            </span>
          </li>
          <li className="flex gap-3">
            <PiPackage className="size-5 shrink-0 text-barro" aria-hidden="true" />
            <span>Empacado sin plástico. Cambios en 15 días si el producto está sin abrir.</span>
          </li>
          <li className="flex gap-3">
            <PiWhatsappLogo className="size-5 shrink-0 text-barro" aria-hidden="true" />
            <span>
              ¿Dudas sobre cuál elegir?{' '}
              <a href={`${SITE.whatsapp}?text=${encodeURIComponent(`Hola, tengo una pregunta sobre ${p.name}`)}`} target="_blank" rel="noopener noreferrer" className="link">
                Pregúntanos por WhatsApp
              </a>
            </span>
          </li>
        </ul>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-humo">
          <li className="flex items-center gap-1.5">
            <PiHandHeart className="size-4 text-barro" aria-hidden="true" /> Hecho a mano en Aguascalientes
          </li>
          <li className="flex items-center gap-1.5">
            <PiLeaf className="size-4 text-barro" aria-hidden="true" /> Libre de crueldad animal
          </li>
        </ul>
      </div>

      {/* Barra fija móvil */}
      {!soldOut && (
        <div
          className={cn(
            'fixed inset-x-0 bottom-0 z-30 border-t border-linea bg-hueso/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden',
            stuck ? 'translate-y-0' : 'translate-y-full',
          )}
          aria-hidden={!stuck}
        >
          <div className="flex items-center gap-3">
            <Image src={gallery[0]} alt="" width={48} height={48} className="size-12 shrink-0 rounded-md bg-lino" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-raiz">{p.name}</p>
              <p className="text-sm text-humo">
                {money(price)}
                {option ? ` · ${option.label}` : ''}
              </p>
            </div>
            <button type="button" onClick={() => add('drawer')} tabIndex={stuck ? 0 : -1} className="btn btn-primary btn-sm shrink-0 px-5">
              Agregar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
