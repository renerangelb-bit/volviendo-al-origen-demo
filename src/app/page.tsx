import Image from 'next/image';
import Link from 'next/link';
import { PiArrowsClockwise, PiHandHeart, PiInstagramLogo, PiLeaf, PiMapPin, PiPlant, PiShieldCheck, PiStorefront, PiTruck, PiWhatsappLogo } from 'react-icons/pi';
import { CATEGORIES } from '@/data/categories';
import { FEATURED_SLUGS, PRODUCTS, getProduct } from '@/data/products';
import { TESTIMONIALS } from '@/data/testimonials';
import { COMMERCE, SITE } from '@/data/site';
import type { Product } from '@/data/catalog-types';
import { money, plural } from '@/lib/format';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { Routines } from '@/components/home/Routines';

const CATEGORY_IMAGE: Record<string, string> = {
  jabones: 'jabon-cafe',
  'cuidado-capilar': 'champu-solido-romero-eucalipto',
  aceites: 'aceite-esencial-lavanda',
  'cuidado-personal': 'cold-cream',
  hogar: 'velas-aromaticas',
  accesorios: 'cepillo-dental-bambu',
};

const HERO_POINTS = [
  { icon: PiMapPin, label: 'Hecho en Aguascalientes' },
  { icon: PiPlant, label: 'Ingredientes naturales' },
  { icon: PiLeaf, label: 'Sin plásticos' },
  { icon: PiHandHeart, label: 'Artesanal' },
];

const TRUST = [
  { icon: PiTruck, title: `Envío gratis desde ${money(COMMERCE.freeShippingFrom)}`, text: 'A todo México con paquetería nacional.' },
  { icon: PiShieldCheck, title: 'Pago seguro', text: 'Tarjeta, Mercado Pago, SPEI u OXXO.' },
  { icon: PiWhatsappLogo, title: 'Te asesoramos', text: 'Por WhatsApp, antes y después de comprar.' },
  { icon: PiStorefront, title: 'Recoge en tienda', text: 'Sin costo en Barrio de la Estación.' },
  { icon: PiArrowsClockwise, title: 'Cambios sencillos', text: '15 días para cambios en productos sin abrir.' },
];

export default function HomePage() {
  const featured = FEATURED_SLUGS.map(getProduct).filter(Boolean) as Product[];
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, PRODUCTS.filter((p) => p.category === c.id).length]));

  return (
    <>
      {/* 02 · Hero */}
      <section className="relative overflow-hidden bg-lino">
        <div className="relative aspect-[16/11] sm:aspect-[16/9] md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-[54%]">
          <Image src="/images/hero/hero.webp" alt="Jabones artesanales apilados con ramas de romero y un champú sólido" fill preload sizes="(min-width: 768px) 54vw, 100vw" className="object-cover object-[72%_center]" />
        </div>
        <div className="page relative">
          <div className="py-10 md:w-[44%] md:py-24 lg:py-28">
            <h1 className="text-[2.375rem] leading-[1.06] font-semibold tracking-[-0.02em] text-raiz sm:text-5xl lg:text-[3.5rem]">
              Cosmética sólida para volver a <span className="whitespace-nowrap text-barro">lo esencial</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-corteza md:text-lg">
              Jabones, champús y aceites hechos a mano en Aguascalientes con ingredientes de origen natural, sin empaques de plástico.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/tienda" className="btn btn-primary">
                Comprar ahora
              </Link>
              <Link href="/nosotros" className="btn btn-outline">
                Conoce nuestra historia
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-corteza sm:flex sm:flex-wrap sm:gap-x-6">
              {HERO_POINTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="size-5 shrink-0 text-barro" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 03 · Beneficios y confianza */}
      <section aria-label="Por qué comprar con nosotros" className="border-y border-linea bg-hueso">
        <ul className="page no-scrollbar flex snap-x gap-6 overflow-x-auto py-6 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:py-8">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex w-[72%] shrink-0 snap-start items-start gap-3 sm:w-[42%] md:w-auto md:flex-col md:items-center md:text-center">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-barro/50 text-barro md:size-14">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-raiz">{title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-humo">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 · Productos destacados */}
      <section className="page py-14 md:py-20" aria-labelledby="destacados">
        <div className="mb-7 flex items-end justify-between gap-4">
          <h2 id="destacados" className="section-title">
            Productos destacados
          </h2>
          <Link href="/tienda" className="link shrink-0 text-sm">
            Ver todos los productos
          </Link>
        </div>
        <FeaturedCarousel products={featured} />
      </section>

      {/* 05 · Compra por categoría */}
      <section className="bg-lino py-14 md:py-20" aria-labelledby="categorias">
        <div className="page">
          <h2 id="categorias" className="section-title text-center">
            Compra por categoría
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {CATEGORIES.map((c) => {
              const img = getProduct(CATEGORY_IMAGE[c.id])!.images[0];
              return (
                <li key={c.id}>
                  <Link href={`/tienda?categoria=${c.id}`} className="group block overflow-hidden rounded-lg border border-linea bg-hueso">
                    <span className="relative block aspect-square overflow-hidden">
                      <Image src={img} alt="" fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 31vw, 46vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </span>
                    <span className="block px-3 py-3">
                      <span className="block text-sm font-semibold text-raiz">{c.name}</span>
                      <span className="block text-xs text-humo">{plural(counts[c.id], 'producto', 'productos')}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 06 · Historia y proceso */}
      <section className="page grid items-center gap-8 py-14 md:grid-cols-2 md:gap-14 md:py-20" aria-labelledby="historia">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-lino md:order-2">
          <Image src="/images/home/historia.webp" alt="Mascarillas sólidas de carbón, arcilla rosa y arcilla amarilla junto a sus polvos" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="md:order-1">
          <h2 id="historia" className="text-3xl leading-tight font-semibold tracking-[-0.015em] text-raiz md:text-4xl">
            Volver al origen es volver a lo que importa
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-corteza">
            <p>
              Todo empezó en 2012, con un champú de sangre de grado que preparábamos en casa para la familia. La planta crece silvestre cerca de Calvillo, y la cosechamos agradeciendo a la tierra lo que nos da.
            </p>
            <p>Hoy seguimos haciendo cada barra a mano, por saponificación en frío, con aceites vegetales y sin empaques de plástico.</p>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-linea py-5">
            <div>
              <dt className="text-xs text-humo">Desde</dt>
              <dd className="text-2xl font-semibold text-raiz">2012</dd>
            </div>
            <div>
              <dt className="text-xs text-humo">Productos</dt>
              <dd className="text-2xl font-semibold text-raiz">{PRODUCTS.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-humo">Hechos en</dt>
              <dd className="text-2xl font-semibold text-raiz">Ags.</dd>
            </div>
          </dl>
          <Link href="/nosotros" className="btn btn-primary mt-8">
            Conoce más de nosotros
          </Link>
        </div>
      </section>

      {/* 07 · Rutinas y relacionados */}
      <section className="border-t border-linea bg-hueso py-14 md:py-20">
        <div className="page">
          <Routines />
        </div>
      </section>

      {/* 08 · Comunidad */}
      <section className="bg-lino py-14 md:py-20" aria-labelledby="clientes">
        <div className="page">
          <h2 id="clientes" className="section-title text-center">
            Lo que dicen nuestros clientes
          </h2>
          <ul className="no-scrollbar -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {TESTIMONIALS.map((t) => (
              <li key={t.quote} className="w-[80%] shrink-0 snap-start sm:w-auto">
                <figure className="flex h-full flex-col rounded-lg bg-hueso p-5">
                  <span className="text-4xl leading-none text-barro" aria-hidden="true">
                    “
                  </span>
                  <blockquote className="mt-1 flex-1 text-sm leading-relaxed text-tinta">{t.quote}</blockquote>
                  <figcaption className="mt-4 text-xs text-humo">
                    {t.name}, {t.place}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-humo">Testimonios de ejemplo para la demostración; se sustituirán por reseñas reales de clientes.</p>
        </div>
      </section>

      <section className="page py-14 md:py-20" aria-labelledby="instagram">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 id="instagram" className="section-title">
            Síguenos en Instagram
          </h2>
          <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="link text-sm">
            {SITE.instagramHandle}
          </a>
        </div>
        <ul className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <li key={n}>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-md bg-lino">
                <Image src={`/images/instagram/ig-${n}.webp`} alt={`Publicación ${n} de Instagram de Volviendo al Origen`} fill sizes="(min-width: 1024px) 16vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <PiInstagramLogo className="size-5" /> Ver más en Instagram
          </a>
        </div>
      </section>
    </>
  );
}
