import Link from 'next/link';
import { PiCaretDown } from 'react-icons/pi';
import type { Product } from '@/data/catalog-types';
import { money } from '@/lib/format';
import { COMMERCE } from '@/data/site';

function Section({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-linea">
      <summary className="flex min-h-14 items-center justify-between gap-4 py-4 text-base font-semibold text-raiz">
        {title}
        <PiCaretDown className="size-5 shrink-0 text-humo transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-6 text-[0.9375rem] leading-relaxed text-corteza">{children}</div>
    </details>
  );
}

export function ProductDetails({ product: p }: { product: Product }) {
  return (
    <div className="border-t border-linea">
      <Section title="Descripción" open>
        <div className="space-y-3">
          {p.description.map((d) => (
            <p key={d}>{d}</p>
          ))}
          {p.benefits && (
            <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-barro">
              {p.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {p.idealFor && (
            <p>
              <strong className="font-semibold text-raiz">Ideal para:</strong> {p.idealFor}
            </p>
          )}
          {p.sku && <p className="text-xs text-humo">SKU {p.sku}</p>}
        </div>
      </Section>
      {p.ingredients && (
        <Section title="Ingredientes">
          <p>{p.ingredients}</p>
        </Section>
      )}
      {p.howTo && (
        <Section title="Modo de uso">
          <ol className="list-decimal space-y-1.5 pl-5 marker:text-barro">
            {p.howTo.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ol>
        </Section>
      )}
      {p.precautions && (
        <Section title="Precauciones">
          <ul className="list-disc space-y-1 pl-5 marker:text-barro">
            {p.precautions.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </Section>
      )}
      <Section title="Envíos y devoluciones">
        <ul className="list-disc space-y-1.5 pl-5 marker:text-barro">
          <li>Preparamos tu pedido en 1 a 2 días hábiles.</li>
          <li>
            Envío estándar {money(130)} (3 a 6 días hábiles), gratis desde {money(COMMERCE.freeShippingFrom)}. Express {money(220)} (1 a 3 días hábiles).
          </li>
          <li>Recoge sin costo en 28 de Agosto #410, Barrio de la Estación, Aguascalientes.</li>
          <li>Cambios y devoluciones de productos sin abrir dentro de 15 días naturales.</li>
        </ul>
        <Link href="/politicas/envios-y-devoluciones" className="link mt-3 inline-block text-sm">
          Leer la política completa
        </Link>
      </Section>
    </div>
  );
}
