import Link from 'next/link';
import { PiFacebookLogo, PiInstagramLogo, PiWhatsappLogo } from 'react-icons/pi';
import { SITE } from '@/data/site';
import { Logo } from './Logo';
import { NewsletterForm } from './NewsletterForm';

const INFO_LINKS = [
  { href: '/nosotros', label: 'Quiénes somos' },
  { href: '/politicas/envios-y-devoluciones', label: 'Envíos y devoluciones' },
  { href: '/ayuda', label: 'Preguntas frecuentes' },
  { href: '/rastreo', label: 'Rastrear pedido' },
  { href: '/contacto', label: 'Contacto' },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-arena text-raiz">
      <div className="page grid gap-10 py-12 md:grid-cols-[1.1fr_1fr_1fr_1.5fr] md:gap-8 md:py-14">
        <div className="space-y-5">
          <Link href="/" aria-label="Volviendo al Origen, ir al inicio" className="inline-block rounded-md">
            <Logo />
          </Link>
          <p className="max-w-56 text-sm leading-relaxed text-corteza">{SITE.tagline}.</p>
          <div className="flex gap-2">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-full bg-raiz text-hueso hover:bg-corteza">
              <PiWhatsappLogo className="size-5" />
            </a>
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid size-10 place-items-center rounded-full bg-raiz text-hueso hover:bg-corteza">
              <PiFacebookLogo className="size-5" />
            </a>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-full bg-raiz text-hueso hover:bg-corteza">
              <PiInstagramLogo className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-[0.14em] uppercase">Tienda</h2>
          <address className="space-y-1 text-sm leading-relaxed text-corteza not-italic">
            <p>{SITE.address.street}</p>
            <p>{SITE.address.neighborhood}</p>
            <p>
              {SITE.address.zip} {SITE.address.city}
            </p>
          </address>
          <dl className="mt-4 space-y-1 text-sm text-corteza">
            {SITE.hours.map((h) => (
              <div key={h.days}>
                <dt className="inline">{h.days}: </dt>
                <dd className="inline">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav aria-label="Información">
          <h2 className="mb-4 text-sm font-semibold tracking-[0.14em] uppercase">Información</h2>
          <ul className="space-y-2.5 text-sm">
            {INFO_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-corteza hover:text-raiz hover:underline hover:underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-2 text-sm font-semibold tracking-[0.14em] uppercase">Únete a nuestra comunidad</h2>
          <p className="mb-4 text-sm text-corteza">Recibe tips de uso, lanzamientos y promociones. Tu primera compra con 10% de descuento.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="bg-raiz text-hueso/85">
        <div className="page flex flex-col gap-3 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Volviendo al Origen. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/politicas/terminos-y-condiciones" className="hover:text-hueso hover:underline">
              Términos y condiciones
            </Link>
            <Link href="/politicas/aviso-de-privacidad" className="hover:text-hueso hover:underline">
              Aviso de privacidad
            </Link>
            <Link href="/demo" className="text-hueso/60 hover:text-hueso hover:underline">
              Prototipo de demostración · NEXA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
