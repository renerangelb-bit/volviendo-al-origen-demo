import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PiClock, PiMapPin, PiPlant, PiRecycle, PiHandHeart, PiScales, PiChatsCircle, PiHeart, PiFlame, PiHandshake } from 'react-icons/pi';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  title: 'Quiénes somos',
  description: 'Somos una marca mexicana de cosmética consciente basada en Aguascalientes. Desde 2012 elaboramos jabones y champús sólidos a mano.',
};

const VALUES = [
  { icon: PiFlame, name: 'Pasión', text: 'Por el oficio artesanal y por cada ingrediente que elegimos.' },
  { icon: PiScales, name: 'Equidad', text: 'Comercio justo con quienes nos proveen y con quienes nos compran.' },
  { icon: PiHandshake, name: 'Compromiso', text: 'Con la tierra, con la producción local y con la calidad de cada pieza.' },
  { icon: PiChatsCircle, name: 'Comunicación', text: 'Te decimos qué lleva cada producto y te acompañamos al usarlo.' },
];

const STEPS = [
  { img: '/images/nosotros/cosecha.webp', name: 'Cosecha consciente', text: 'Recolectamos plantas como la sangre de grado cerca de Calvillo, agradeciendo a la tierra lo que nos da.' },
  { img: '/images/nosotros/saponificacion.webp', name: 'Saponificación en frío', text: 'Mezclamos aceites vegetales de coco, soya y palma certificada RSPO en lotes pequeños, a mano.' },
  { img: '/images/nosotros/corte.webp', name: 'Corte a mano', text: 'Cada barra se corta y se revisa una por una; por eso ninguna es idéntica a otra.' },
  { img: '/images/nosotros/empaque.webp', name: 'Empaque sin plástico', text: 'Empacamos en papel y materiales reutilizables para que a tu casa sólo llegue lo esencial.' },
];

const COMMITMENTS = [
  { icon: PiHeart, title: 'Libre de crueldad animal', text: 'Ningún producto ni ingrediente se prueba en animales.' },
  { icon: PiPlant, title: 'Palma certificada RSPO', text: 'Nuestro proveedor de aceite de palma cuenta con certificación de producción responsable.' },
  { icon: PiRecycle, title: 'Cosmética a granel', text: 'En tienda puedes traer tu envase y rellenarlo.' },
  { icon: PiHandHeart, title: 'Hecho en Aguascalientes', text: 'Producción local y comercio justo.' },
];

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-lino">
        <div className="page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm text-barro">Quiénes somos</p>
            <h1 className="mt-3 text-4xl leading-[1.08] font-semibold tracking-[-0.02em] text-raiz md:text-5xl">Cosmética consciente, hecha a mano en Aguascalientes</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-corteza">
              Somos una marca mexicana que une los poderes medicinales de la naturaleza con aceites herbales para crear productos naturales, sustentables y libres de residuos plásticos.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image src="/images/nosotros/cosecha.webp" alt="Ramas de romero, lavanda y flores de manzanilla y caléndula" fill preload sizes="(min-width: 768px) 46vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="page grid gap-10 py-14 md:grid-cols-[1fr_1.2fr] md:gap-16 md:py-20" aria-labelledby="historia">
        <h2 id="historia" className="text-3xl leading-tight font-semibold tracking-[-0.015em] text-raiz md:text-4xl">
          Todo empezó en 2012, en casa
        </h2>
        <div className="space-y-5 text-base leading-relaxed text-corteza md:text-lg">
          <p>
            Movidos por el deseo de elaborar nuestros propios productos de cuidado personal para la familia, preparamos nuestro primer champú con sangre de grado (Jatropha dioica), una planta que crece silvestre cerca de Calvillo y que la
            gente de la región usa desde hace generaciones.
          </p>
          <p>Con los años mejoramos esa fórmula combinándola con romero, y hoy es uno de los productos favoritos de nuestra clientela. De ahí vinieron los jabones, los champús sólidos, los aceites y todo lo demás.</p>
          <p>
            Queremos que el momento del baño sea una experiencia sensorial que te reconecte contigo, con la naturaleza y con quienes producen cerca de ti. <strong className="font-semibold text-raiz">{SITE.tagline}.</strong>
          </p>
          <Link href="/blog/nuestro-primer-paso-al-origen" className="link inline-block text-base">
            Lee la historia completa en el blog
          </Link>
        </div>
      </section>

      <section className="bg-raiz py-14 text-hueso md:py-20" aria-labelledby="valores">
        <div className="page">
          <h2 id="valores" className="section-title text-hueso">
            Lo que nos mueve
          </h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, name, text }) => (
              <li key={name}>
                <Icon className="size-8 text-arena" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-semibold">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-hueso/75">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page py-14 md:py-20" aria-labelledby="proceso">
        <h2 id="proceso" className="section-title">
          Nuestro proceso
        </h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.name}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-lino">
                <Image src={s.img} alt="" fill sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 text-sm font-semibold text-barro">Paso {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-raiz">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-corteza">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-lino py-14 md:py-20" aria-labelledby="compromisos">
        <div className="page">
          <h2 id="compromisos" className="section-title">
            Nuestros compromisos
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMMITMENTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-xl bg-hueso p-5">
                <Icon className="size-7 text-barro" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-raiz">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-corteza">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20" aria-labelledby="visitanos">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-lino">
          <Image src="/images/contacto/tienda.webp" alt="Jabones y champús sólidos en el mostrador de la tienda" fill sizes="(min-width: 768px) 46vw, 100vw" className="object-cover" />
        </div>
        <div>
          <h2 id="visitanos" className="text-3xl font-semibold tracking-[-0.015em] text-raiz">
            Visítanos en Barrio de la Estación
          </h2>
          <p className="mt-4 text-corteza">Conoce los aromas en persona, rellena tus envases en la zona de granel o recoge tu pedido en línea sin costo.</p>
          <ul className="mt-6 space-y-3 text-sm text-corteza">
            <li className="flex gap-3">
              <PiMapPin className="size-5 shrink-0 text-barro" aria-hidden="true" />
              {SITE.address.street}, {SITE.address.neighborhood}, {SITE.address.zip} {SITE.address.city}
            </li>
            {SITE.hours.map((h) => (
              <li key={h.days} className="flex gap-3">
                <PiClock className="size-5 shrink-0 text-barro" aria-hidden="true" />
                {h.days}: {h.time}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={SITE.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Cómo llegar
            </a>
            <Link href="/tienda" className="btn btn-outline">
              Comprar en línea
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
