import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PiClock, PiEnvelopeSimple, PiMapPin, PiWhatsappLogo, PiQuestion } from 'react-icons/pi';
import { SITE } from '@/data/site';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escríbenos por WhatsApp, correo o visítanos en Barrio de la Estación, Aguascalientes.',
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ContactoPage({ searchParams }: Props) {
  const sp = await searchParams;
  const motivo = Array.isArray(sp.motivo) ? sp.motivo[0] : sp.motivo;
  return (
    <div className="page pt-10 pb-20">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-[-0.02em] text-raiz md:text-5xl">Queremos saber de ti</h1>
        <p className="mt-4 text-lg text-corteza">Resolvemos dudas de productos, pedidos y mayoreo. Por WhatsApp respondemos más rápido.</p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
        <div>
          <ContactForm key={motivo ?? ''} initialReason={motivo} />
          <Link href="/ayuda" className="mt-6 flex items-center gap-3 rounded-xl bg-lino p-4 text-sm text-corteza hover:bg-arena">
            <PiQuestion className="size-6 shrink-0 text-barro" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-raiz">¿Dudas sobre envíos, pagos o devoluciones?</strong> Quizá tu respuesta ya está en el centro de ayuda.
            </span>
          </Link>
        </div>

        <aside className="space-y-4">
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl bg-raiz p-5 text-hueso hover:bg-corteza">
            <PiWhatsappLogo className="size-9 shrink-0" aria-hidden="true" />
            <span>
              <span className="block text-sm text-hueso/75">WhatsApp</span>
              <span className="block text-lg font-semibold">{SITE.phoneDisplay}</span>
            </span>
          </a>
          <div className="space-y-4 rounded-xl border border-linea bg-white p-5 text-sm text-corteza">
            <p className="flex gap-3">
              <PiEnvelopeSimple className="size-5 shrink-0 text-barro" aria-hidden="true" />
              <a href={`mailto:${SITE.email}`} className="link">
                {SITE.email}
              </a>
            </p>
            <p className="flex gap-3">
              <PiMapPin className="size-5 shrink-0 text-barro" aria-hidden="true" />
              <span>
                {SITE.address.street}, {SITE.address.neighborhood}
                <br />
                {SITE.address.zip} {SITE.address.city}
                <br />
                <a href={SITE.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="link">
                  ¿Cómo llegar?
                </a>
              </span>
            </p>
            <div className="flex gap-3">
              <PiClock className="size-5 shrink-0 text-barro" aria-hidden="true" />
              <ul>
                {SITE.hours.map((h) => (
                  <li key={h.days}>
                    {h.days}: {h.time}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-lino">
            <Image src="/images/contacto/tienda.webp" alt="Productos en el mostrador de la tienda de Barrio de la Estación" fill sizes="(min-width: 1024px) 22rem, 100vw" className="object-cover" />
          </div>
        </aside>
      </div>
    </div>
  );
}
