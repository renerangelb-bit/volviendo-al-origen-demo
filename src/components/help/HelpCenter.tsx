'use client';

import { useMemo, useState } from 'react';
import { PiCaretDown, PiMagnifyingGlass } from 'react-icons/pi';
import { FAQ } from '@/data/faq';
import { normalize } from '@/lib/format';

export function HelpCenter() {
  const [q, setQ] = useState('');
  const term = normalize(q);
  const topics = useMemo(
    () =>
      FAQ.map((t) => ({
        ...t,
        items: term ? t.items.filter((i) => normalize(`${i.q} ${i.a}`).includes(term)) : t.items,
      })).filter((t) => t.items.length > 0),
    [term],
  );
  const total = topics.reduce((n, t) => n + t.items.length, 0);

  return (
    <div>
      <div className="relative max-w-xl">
        <label htmlFor="faq-search" className="sr-only">
          Buscar en preguntas frecuentes
        </label>
        <PiMagnifyingGlass className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-humo" aria-hidden="true" />
        <input id="faq-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca tu pregunta: envío, devolución, factura…" className="field h-13 pl-12 text-base" />
      </div>
      {term && (
        <p className="mt-3 text-sm text-humo" aria-live="polite">
          {total === 0 ? 'No encontramos preguntas con esa palabra. Prueba con otra o escríbenos.' : `${total} ${total === 1 ? 'resultado' : 'resultados'}`}
        </p>
      )}

      {!term && (
        <nav aria-label="Temas de ayuda" className="mt-6 flex flex-wrap gap-2">
          {FAQ.map((t) => (
            <a key={t.id} href={`#${t.id}`} className="rounded-full border border-linea bg-white px-4 py-2 text-sm text-raiz hover:border-raiz">
              {t.title}
            </a>
          ))}
        </nav>
      )}

      <div className="mt-10 space-y-10">
        {topics.map((t) => (
          <section key={t.id} id={t.id} aria-labelledby={`${t.id}-t`} className="scroll-mt-40">
            <h2 id={`${t.id}-t`} className="section-title">
              {t.title}
            </h2>
            <div className="mt-4 border-t border-linea">
              {t.items.map((i) => (
                <details key={i.q} className="group border-b border-linea" open={!!term}>
                  <summary className="flex min-h-14 items-center justify-between gap-4 py-4 text-left text-base font-medium text-raiz">
                    {i.q}
                    <PiCaretDown className="size-5 shrink-0 text-humo transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="max-w-3xl pb-5 text-[0.9375rem] leading-relaxed text-corteza">{i.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
