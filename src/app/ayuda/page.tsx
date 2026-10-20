import type { Metadata } from 'next';
import Link from 'next/link';
import { PiPackage, PiWhatsappLogo, PiFileText } from 'react-icons/pi';
import { HelpCenter } from '@/components/help/HelpCenter';
import { SITE } from '@/data/site';
import { FAQ } from '@/data/faq';

export const metadata: Metadata = {
  title: 'Ayuda y preguntas frecuentes',
  description: 'Envíos, pagos, rastreo, cambios y devoluciones, y cómo usar la cosmética sólida.',
};

export default function AyudaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.flatMap((t) => t.items).map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  };
  return (
    <div className="page pt-10 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-4xl font-semibold tracking-[-0.02em] text-raiz md:text-5xl">¿Cómo te ayudamos?</h1>
      <p className="mt-3 max-w-xl text-lg text-corteza">Respuestas rápidas sobre envíos, pagos, pedidos y nuestros productos.</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        <li>
          <Link href="/rastreo" className="flex h-full items-center gap-4 rounded-xl bg-lino p-5 hover:bg-arena">
            <PiPackage className="size-8 shrink-0 text-barro" aria-hidden="true" />
            <span>
              <span className="block font-semibold text-raiz">Rastrear mi pedido</span>
              <span className="block text-sm text-corteza">Con tu número VAO-</span>
            </span>
          </Link>
        </li>
        <li>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-full items-center gap-4 rounded-xl bg-lino p-5 hover:bg-arena">
            <PiWhatsappLogo className="size-8 shrink-0 text-barro" aria-hidden="true" />
            <span>
              <span className="block font-semibold text-raiz">Escríbenos por WhatsApp</span>
              <span className="block text-sm text-corteza">L a V 10:00–20:00, S y D 10:00–15:00</span>
            </span>
          </a>
        </li>
        <li>
          <Link href="/politicas/envios-y-devoluciones" className="flex h-full items-center gap-4 rounded-xl bg-lino p-5 hover:bg-arena">
            <PiFileText className="size-8 shrink-0 text-barro" aria-hidden="true" />
            <span>
              <span className="block font-semibold text-raiz">Envíos y devoluciones</span>
              <span className="block text-sm text-corteza">Tiempos, costos y cambios</span>
            </span>
          </Link>
        </li>
      </ul>

      <div className="mt-12">
        <HelpCenter />
      </div>

      <p className="mt-12 text-xs text-humo">Montos, tiempos y políticas son de referencia para la demostración y deben confirmarse con Volviendo al Origen.</p>
    </div>
  );
}
