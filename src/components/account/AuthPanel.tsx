'use client';

import { useRef, useState, type FormEvent } from 'react';
import { PiCheckCircle, PiSparkle } from 'react-icons/pi';
import { useAccount, DEMO_USER, DEMO_ADDRESSES } from '@/store/account';
import { useUi } from '@/store/ui';
import { isEmail, isPhone, formatPhone } from '@/lib/validation';
import { TextField, focusFirstError } from '@/components/ui/Field';
import { cn } from '@/lib/cn';

type Mode = 'login' | 'register' | 'forgot';

export function AuthPanel({ initialEmail, onDone }: { initialEmail?: string; onDone?: () => void }) {
  const login = useAccount((s) => s.login);
  const toast = useUi((s) => s.toast);
  const [mode, setMode] = useState<Mode>(initialEmail ? 'register' : 'login');
  const [email, setEmail] = useState(initialEmail ?? '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentTo, setSentTo] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const switchTo = (m: Mode) => {
    setMode(m);
    setErrors({});
    setSentTo(null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!isEmail(email)) err.email = 'Escribe un correo válido.';
    if (mode !== 'forgot' && password.length < 6) err.password = 'La contraseña debe tener al menos 6 caracteres.';
    if (mode === 'register') {
      if (name.trim().length < 3) err.name = 'Escribe tu nombre y apellido.';
      if (phone && !isPhone(phone)) err.phone = 'El teléfono debe tener 10 dígitos.';
    }
    setErrors(err);
    if (Object.keys(err).length) {
      focusFirstError(formRef.current);
      return;
    }
    if (mode === 'forgot') {
      setSentTo(email.trim());
      return;
    }
    if (mode === 'login') {
      const isDemo = email.trim().toLowerCase() === DEMO_USER.email;
      const guessName = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      login(isDemo ? DEMO_USER : { name: guessName, email: email.trim(), phone: '', newsletter: false }, isDemo ? DEMO_ADDRESSES : undefined);
      toast({ title: `Hola de nuevo, ${(isDemo ? DEMO_USER.name : guessName).split(' ')[0]}`, tone: 'success' });
    } else {
      login({ name: name.trim(), email: email.trim(), phone: formatPhone(phone), newsletter }, []);
      toast({ title: 'Tu cuenta está lista', description: 'Ya puedes guardar direcciones y ver tus pedidos.', tone: 'success' });
    }
    onDone?.();
  };

  const demoLogin = () => {
    login(DEMO_USER, DEMO_ADDRESSES);
    toast({ title: 'Entraste con la cuenta demo', description: 'Pedidos, direcciones y favoritos de ejemplo.', tone: 'success' });
    onDone?.();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
      <div className="rounded-xl border border-linea bg-white p-5 sm:p-8">
        {mode !== 'forgot' && (
          <div className="mb-6 grid grid-cols-2 rounded-lg bg-lino p-1" role="tablist" aria-label="Acceso">
            {(
              [
                ['login', 'Iniciar sesión'],
                ['register', 'Crear cuenta'],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchTo(m)}
                className={cn('h-10 rounded-md text-sm font-medium transition-colors', mode === m ? 'bg-hueso text-raiz shadow-sm' : 'text-humo hover:text-raiz')}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {mode === 'forgot' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-raiz">Recupera tu contraseña</h2>
            <p className="mt-1 text-sm text-humo">Te enviaremos un enlace para crear una nueva.</p>
          </div>
        )}

        {sentTo ? (
          <div role="status" className="rounded-lg bg-musgo-claro p-4 text-sm text-musgo">
            <p className="flex items-center gap-2 font-semibold">
              <PiCheckCircle className="size-5" /> Revisa tu correo
            </p>
            <p className="mt-1">Si {sentTo} tiene una cuenta, recibirás un enlace para restablecer tu contraseña en unos minutos.</p>
            <button type="button" onClick={() => switchTo('login')} className="link mt-3 text-sm">
              Volver a iniciar sesión
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4">
            {mode === 'register' && <TextField label="Nombre completo" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />}
            <TextField label="Correo electrónico" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            {mode === 'register' && (
              <TextField label="Teléfono" optional type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} error={errors.phone} hint="Para avisarte por WhatsApp sobre tu envío." />
            )}
            {mode !== 'forgot' && (
              <TextField
                label="Contraseña"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                hint={mode === 'register' ? 'Mínimo 6 caracteres.' : undefined}
              />
            )}
            {mode === 'login' && (
              <button type="button" onClick={() => switchTo('forgot')} className="link text-sm">
                ¿Olvidaste tu contraseña?
              </button>
            )}
            {mode === 'register' && (
              <label className="flex items-start gap-2.5 text-sm text-tinta">
                <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-0.5 size-4 accent-raiz" />
                Quiero recibir tips, lanzamientos y promociones por correo.
              </label>
            )}
            <button type="submit" className="btn btn-primary w-full">
              {mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear cuenta' : 'Enviar enlace'}
            </button>
            {mode === 'forgot' && (
              <button type="button" onClick={() => switchTo('login')} className="btn btn-outline w-full">
                Volver
              </button>
            )}
          </form>
        )}
      </div>

      <aside className="h-fit rounded-xl bg-lino p-6">
        <h2 className="text-base font-semibold text-raiz">Con tu cuenta puedes</h2>
        <ul className="mt-3 space-y-2 text-sm text-corteza">
          {['Ver el estado y la guía de tus pedidos', 'Guardar direcciones para pagar más rápido', 'Volver a comprar tus favoritos en un clic', 'Recibir promociones exclusivas'].map((t) => (
            <li key={t} className="flex gap-2">
              <PiCheckCircle className="mt-0.5 size-4 shrink-0 text-musgo" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-arena-oscura pt-5">
          <p className="text-sm text-corteza">¿Presentando la demo? Entra con una cuenta que ya tiene pedidos y direcciones.</p>
          <button type="button" onClick={demoLogin} className="btn btn-outline mt-3 w-full bg-hueso">
            <PiSparkle className="size-4" /> Entrar con cuenta demo
          </button>
        </div>
      </aside>
    </div>
  );
}
