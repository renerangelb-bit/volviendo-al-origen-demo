import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POLICIES, getPolicy } from '@/data/policies';
import { formatDay } from '@/lib/format';
import { cn } from '@/lib/cn';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPolicy(slug);
  return p ? { title: p.title, description: p.intro } : { title: 'Política no encontrada' };
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <div className="page grid gap-10 pt-10 pb-20 lg:grid-cols-[14rem_1fr] lg:gap-16">
      <nav aria-label="Políticas" className="lg:sticky lg:top-36 lg:self-start">
        <p className="text-sm font-semibold tracking-[0.12em] text-raiz uppercase">Políticas</p>
        <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {POLICIES.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/politicas/${p.slug}`}
                aria-current={p.slug === policy.slug ? 'page' : undefined}
                className={cn('block rounded-md px-3 py-2 text-sm', p.slug === policy.slug ? 'bg-raiz text-hueso' : 'bg-lino text-raiz hover:bg-arena lg:bg-transparent')}
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <article className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-[-0.02em] text-raiz">{policy.title}</h1>
        <p className="mt-2 text-sm text-humo">Última actualización: {formatDay(policy.updated)}</p>
        <p className="mt-6 rounded-lg border border-dashed border-arena-oscura px-4 py-3 text-xs text-humo">Texto de referencia para la demostración; su contenido final debe revisarlo y aprobarlo Volviendo al Origen.</p>
        <div className="prose-vao mt-8 text-[1.0625rem] text-tinta">
          <p className="text-lg text-corteza">{policy.intro}</p>
          {policy.sections.map((s) => (
            <section key={s.title}>
              <h2 className="mt-10 mb-3 text-xl font-semibold text-raiz">{s.title}</h2>
              {s.body.map((b) => (
                <p key={b} className="mb-4 leading-relaxed">
                  {b}
                </p>
              ))}
              {s.list && (
                <ul className="mb-4 list-disc space-y-2 pl-5 leading-relaxed marker:text-barro">
                  {s.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
