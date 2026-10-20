'use client';

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Base = { label: string; error?: string; hint?: string; className?: string; optional?: boolean };

function Wrap({ id, label, error, hint, optional, className, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-raiz">
        {label}
        {optional && <span className="font-normal text-humo"> (opcional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-alerta">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-humo">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({ label, error, hint, optional, className, id: idProp, ...input }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={id}
        className="field"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...input}
      />
    </Wrap>
  );
}

export function SelectField({ label, error, hint, optional, className, id: idProp, children, ...select }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <select id={id} className="field" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} {...select}>
        {children}
      </select>
    </Wrap>
  );
}

export function TextAreaField({ label, error, hint, optional, className, id: idProp, ...area }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea id={id} className="field min-h-32 resize-y" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} {...area} />
    </Wrap>
  );
}

/** Enfoca el primer campo con error después de validar. */
export function focusFirstError(form: HTMLFormElement | null) {
  window.requestAnimationFrame(() => {
    form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
}
