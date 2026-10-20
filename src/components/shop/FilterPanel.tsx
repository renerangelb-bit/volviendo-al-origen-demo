'use client';

import { PiCaretDown } from 'react-icons/pi';
import { CATEGORIES, NEEDS } from '@/data/categories';
import { PRICE_RANGES, type Filters, type facetCounts } from '@/lib/catalog';
import { cn } from '@/lib/cn';

type Props = {
  filters: Filters;
  counts: ReturnType<typeof facetCounts>;
  onChange: (patch: Partial<Filters>) => void;
  idPrefix: string;
};

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-linea py-4">
      <summary className="flex items-center justify-between text-sm font-semibold text-raiz">
        {title}
        <PiCaretDown className="size-4 text-humo transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function Option({
  type,
  name,
  id,
  checked,
  disabled,
  onChange,
  label,
  count,
}: {
  type: 'radio' | 'checkbox';
  name: string;
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label htmlFor={id} className={cn('flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-1 text-sm', disabled && !checked ? 'cursor-default text-humo/60' : 'text-tinta hover:bg-lino')}>
      <input
        id={id}
        type={type}
        name={name}
        checked={checked}
        disabled={disabled && !checked}
        onChange={onChange}
        className={cn('size-[1.05rem] shrink-0 accent-raiz', type === 'radio' ? 'rounded-full' : 'rounded')}
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-humo tabular-nums">{count}</span>}
    </label>
  );
}

export function FilterPanel({ filters, counts, onChange, idPrefix }: Props) {
  return (
    <div>
      <Group title="Categoría">
        <div className="space-y-0.5">
          <Option type="radio" name={`${idPrefix}-cat`} id={`${idPrefix}-cat-todas`} checked={!filters.categoria} onChange={() => onChange({ categoria: null })} label="Todas" />
          {CATEGORIES.map((c) => (
            <Option
              key={c.id}
              type="radio"
              name={`${idPrefix}-cat`}
              id={`${idPrefix}-cat-${c.id}`}
              checked={filters.categoria === c.id}
              disabled={counts.cats[c.id] === 0}
              onChange={() => onChange({ categoria: c.id })}
              label={c.name}
              count={counts.cats[c.id]}
            />
          ))}
        </div>
      </Group>
      <Group title="Necesidad">
        <div className="space-y-0.5">
          {NEEDS.map((n) => {
            const on = filters.necesidad.includes(n.id);
            return (
              <Option
                key={n.id}
                type="checkbox"
                name={`${idPrefix}-need`}
                id={`${idPrefix}-need-${n.id}`}
                checked={on}
                disabled={counts.needs[n.id] === 0}
                onChange={() => onChange({ necesidad: on ? filters.necesidad.filter((x) => x !== n.id) : [...filters.necesidad, n.id] })}
                label={n.name}
                count={counts.needs[n.id]}
              />
            );
          })}
        </div>
      </Group>
      <Group title="Precio">
        <div className="space-y-0.5">
          <Option type="radio" name={`${idPrefix}-price`} id={`${idPrefix}-price-todos`} checked={!filters.precio} onChange={() => onChange({ precio: null })} label="Cualquier precio" />
          {PRICE_RANGES.map((r) => (
            <Option
              key={r.id}
              type="radio"
              name={`${idPrefix}-price`}
              id={`${idPrefix}-price-${r.id}`}
              checked={filters.precio === r.id}
              disabled={counts.prices[r.id] === 0}
              onChange={() => onChange({ precio: r.id })}
              label={r.label}
              count={counts.prices[r.id]}
            />
          ))}
        </div>
      </Group>
      <Group title="Disponibilidad">
        <Option type="checkbox" name={`${idPrefix}-stock`} id={`${idPrefix}-stock`} checked={filters.disponibles} onChange={() => onChange({ disponibles: !filters.disponibles })} label="Ocultar agotados" />
      </Group>
    </div>
  );
}
