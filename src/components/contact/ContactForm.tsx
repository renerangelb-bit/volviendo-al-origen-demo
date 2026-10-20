'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PiCheckCircle, PiSpinnerGap } from 'react-icons/pi';
import { TextField, SelectField, TextAreaField, focusFirstError } from '@/components/ui/Field';
import { formatPhone, isEmail, isPhone } from '@/lib/validation';
import { useAccount } from '@/store/account';

export const REASONS = [
  { id: 'producto', label: 'Duda sobre un producto' },
  { id: 'pedido', label: 'Mi pedido' },
  { id: 'mayoreo', label: 'Mayoreo' },
  { id: 'granel', label: 'Cosmética a granel' },
  { id: 'otro', label: 'Otro' },
] as const;

export function ContactForm({ initialReason }: { initialReason?: string }) {
  const user = useAccount((s) => s.user);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    reason: REASONS.some((r) => r.id === initialReason) ? (initialReason as string) : '',
    order: '',
    message: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const ref = useRef<HTMLFormElement>(null);

  // Prellena con la cuenta cuando se termina de leer localStorage.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email, phone: f.phone || user.phone }));
  }, [user]);

  const set = (k: keyof typeof form, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 2) err.name = 'Escribe tu nombre.';
    if (!isEmail(form.email)) err.email = 'Escribe un correo válido para poder responderte.';
    if (form.phone && !isPhone(form.phone)) err.phone = 'El teléfono debe tener 10 dígitos.';
    if (!form.reason) err.reason = 'Elige el motivo de tu mensaje.';
    if (form.message.trim().length < 10) err.message = 'Cuéntanos un poco más (mínimo 10 caracteres).';
    if (!form.consent) err.consent = 'Necesitamos tu autorización para responderte.';
    setErrors(err);
    if (Object.keys(err).length) return focusFirstError(ref.current);
    setState('sending');
    window.setTimeout(() => setState('sent'), 900);
  };

  if (state === 'sent') {
    return (
      <div className="rounded-xl border border-linea bg-white p-8 text-center" role="status">
        <PiCheckCircle className="mx-auto size-12 text-musgo" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold text-raiz">¡Gracias por volver al origen!</h2>
        <p className="mt-2 text-corteza">Recibimos tu mensaje, {form.name.split(' ')[0]}. Te respondemos a {form.email} en menos de 24 horas hábiles.</p>
        <button
          type="button"
          className="btn btn-outline mt-6"
          onClick={() => {
            setForm((f) => ({ ...f, message: '', order: '' }));
            setState('idle');
          }}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form ref={ref} onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl border border-linea bg-white p-5 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nombre" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
        <TextField label="Correo electrónico" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
        <TextField label="Teléfono" optional type="tel" inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} error={errors.phone} />
        <SelectField label="Motivo" value={form.reason} onChange={(e) => set('reason', e.target.value)} error={errors.reason}>
          <option value="">Elige una opción</option>
          {REASONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </SelectField>
      </div>
      {form.reason === 'pedido' && <TextField label="Número de pedido" optional placeholder="VAO-10482" value={form.order} onChange={(e) => set('order', e.target.value.toUpperCase())} />}
      <TextAreaField label="Mensaje" value={form.message} onChange={(e) => set('message', e.target.value)} error={errors.message} placeholder={form.reason === 'mayoreo' ? 'Cuéntanos de tu negocio, ciudad y productos de interés.' : '¿En qué te podemos ayudar?'} />
      <div>
        <label className="flex items-start gap-2.5 text-sm text-tinta">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            className="mt-0.5 size-4 accent-raiz"
          />
          <span>
            Autorizo el uso de mis datos para responderte, de acuerdo con el{' '}
            <Link href="/politicas/aviso-de-privacidad" className="link">
              aviso de privacidad
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 text-sm text-alerta">
            {errors.consent}
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-56" disabled={state === 'sending'}>
        {state === 'sending' ? (
          <>
            <PiSpinnerGap className="size-4 animate-spin" aria-hidden="true" /> Enviando…
          </>
        ) : (
          'Enviar mensaje'
        )}
      </button>
    </form>
  );
}
