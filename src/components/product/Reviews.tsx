import type { Product } from '@/data/catalog-types';
import { Stars } from '@/components/ui/Stars';

/* Reseñas de ejemplo para presentar el componente; en producción se muestran reseñas verificadas de WooCommerce. */
const POOL: Record<string, string[]> = {
  'cuidado-capilar': [
    'Desde la primera semana noto el cuero cabelludo menos graso y el cabello con más brillo.',
    'Hace bastante espuma y rinde muchísimo si la dejas secar entre usos.',
    'Me costó acostumbrarme a la barra, pero ya no regreso al champú en botella.',
  ],
  jabones: ['El aroma es delicioso y no me reseca la piel.', 'Dura muchísimo si lo dejas en una jabonera con drenaje.', 'Lo uso en cara y cuerpo sin ningún problema.'],
  aceites: ['Aroma muy natural, nada artificial.', 'Lo pongo en el difusor antes de dormir y me ayuda a relajarme.', 'Llegó bien sellado y protegido.'],
  'cuidado-personal': ['Textura muy agradable, se absorbe rápido.', 'Perfecto para el frío de invierno.', 'Un poco rinde mucho.'],
  hogar: ['Llena de aroma toda la sala.', 'Se consume parejo y el aroma dura.', 'Muy bonito empaque para regalar.'],
  accesorios: ['Buena calidad, se siente resistente.', 'Práctico y sin plástico, justo lo que buscaba.', 'Llegó rápido y bien empacado.'],
};

export function Reviews({ product: p }: { product: Product }) {
  const texts = POOL[p.category] ?? POOL.jabones;
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const share = star === 5 ? 0.68 : star === 4 ? 0.22 : star === 3 ? 0.07 : star === 2 ? 0.02 : 0.01;
    return { star, n: Math.round(p.reviewCount * share) };
  });
  const scores = [5, 5, 4];
  return (
    <section id="opiniones" aria-labelledby="opiniones-title" className="scroll-mt-36">
      <h2 id="opiniones-title" className="section-title">
        Opiniones
      </h2>
      <div className="mt-6 grid gap-8 md:grid-cols-[16rem_1fr] md:gap-12">
        <div>
          <p className="text-5xl font-semibold text-raiz">{p.rating.toFixed(1)}</p>
          <Stars rating={p.rating} size="md" className="mt-2" />
          <p className="mt-1 text-sm text-humo">{p.reviewCount} opiniones</p>
          <ul className="mt-4 space-y-1.5" aria-label="Distribución de calificaciones">
            {dist.map((d) => (
              <li key={d.star} className="flex items-center gap-2 text-xs text-humo">
                <span className="w-3 tabular-nums">{d.star}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-arena">
                  <span className="block h-full rounded-full bg-oro" style={{ width: `${(d.n / Math.max(1, p.reviewCount)) * 100}%` }} />
                </span>
                <span className="w-6 text-right tabular-nums">{d.n}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="divide-y divide-linea border-y border-linea">
            {texts.map((t, i) => (
              <li key={t} className="py-5">
                <Stars rating={scores[i]} />
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-tinta">{t}</p>
                <p className="mt-2 text-xs text-humo">Reseña de ejemplo</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-humo">Contenido de demostración: en la tienda en línea se publicarán reseñas verificadas de compradores.</p>
        </div>
      </div>
    </section>
  );
}
