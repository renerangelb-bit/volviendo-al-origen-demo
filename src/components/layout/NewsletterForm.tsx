'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { PiCheckCircle, PiCopy } from 'react-icons/pi';
import { useAccount } from '@/store/account';
import { isEmail } from '@/lib/validation';
import { useUi } from '@/store/ui';

export function NewsletterForm({ tone = 'arena' }: { tone?: 'arena' | 'dark' }) {
  const subscribe = useAccount((s) => s.subscribe);
  const toast = useUi((s) => s.toast);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError('Escribe un correo válido, por ejemplo nombre@correo.com.');
      return;
    }
    setError('');
    subscribe(email.trim());
    setDone(email.trim());
  };

  if (done) {
    return (
      <div className="rounded-md border border-raiz/15 bg-hueso/70 p-4 text-sm" role="status">
        <p className="flex items-center gap-2 font-semibold text-raiz">
          <PiCheckCircle className="size-5 text-musgo" /> ¡Gracias por volver al origen!
        </p>
        <p className="mt-1 text-corteza">Enviamos la bienvenida a {done}. Usa este código en tu primera compra:</p>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText('BIENVENIDA10');
            toast({ title: 'Código copiado', description: 'Pégalo en el carrito o al pagar.', tone: 'success' });
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-dashed border-barro px-3 py-2 font-semibold tracking-[0.14em] text-barro"
        >
          BIENVENIDA10 <PiCopy className="size-4" aria-label="Copiar código" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`nl-${tone}`} className="sr-only">
          Tu correo para recibir novedades
        </label>
        <input
          id={`nl-${tone}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `nl-${tone}-err` : undefined}
          className="field min-w-0 flex-1 bg-hueso"
        />
        <button type="submit" className="btn btn-primary shrink-0">
          Suscribirme
        </button>
      </div>
      {error && (
        <p id={`nl-${tone}-err`} className="text-sm text-alerta">
          {error}
        </p>
      )}
      <p className="text-xs text-corteza/80">
        Al suscribirte aceptas nuestro{' '}
        <Link href="/politicas/aviso-de-privacidad" className="underline underline-offset-2">
          aviso de privacidad
        </Link>
        . Puedes darte de baja cuando quieras.
      </p>
    </form>
  );
}
