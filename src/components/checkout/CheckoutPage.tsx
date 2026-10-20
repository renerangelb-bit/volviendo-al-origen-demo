'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PiCaretDown, PiCheck, PiCreditCard, PiLockSimple, PiMoney, PiBank, PiStorefront, PiTruck, PiLightning, PiSpinnerGap, PiPencilSimple, PiWallet } from 'react-icons/pi';
import { COMMERCE, MX_STATES, type ShippingMethodId } from '@/data/site';
import { useCart } from '@/store/cart';
import { useAccount } from '@/store/account';
import { useOrders } from '@/store/orders';
import { useHydrated } from '@/store/hydration';
import { computeTotals, resolveLines } from '@/lib/pricing';
import { PAYMENT_METHODS, type PaymentMethodId } from '@/lib/orders';
import { money, plural } from '@/lib/format';
import { cn } from '@/lib/cn';
import { formatPhone, isEmail, isPhone, isZip } from '@/lib/validation';
import { TextField, SelectField, focusFirstError } from '@/components/ui/Field';
import { CouponForm } from '@/components/cart/CouponForm';

type Address = { street: string; neighborhood: string; zip: string; city: string; state: string; references: string };
const EMPTY_ADDRESS: Address = { street: '', neighborhood: '', zip: '', city: '', state: '', references: '' };

const ZIP_STATES: [RegExp, string][] = [
  [/^20/, 'Aguascalientes'],
  [/^(0|1[0-6])/, 'Ciudad de México'],
  [/^4[4-9]/, 'Jalisco'],
  [/^6[4-7]/, 'Nuevo León'],
  [/^76/, 'Querétaro'],
  [/^3[6-8]/, 'Guanajuato'],
  [/^5[0-7]/, 'Estado de México'],
  [/^98|^99/, 'Zacatecas'],
  [/^7[2-5]/, 'Puebla'],
];

const SHIP_ICON: Record<ShippingMethodId, typeof PiTruck> = { estandar: PiTruck, express: PiLightning, tienda: PiStorefront };
const PAY_ICON: Record<PaymentMethodId, typeof PiCreditCard> = { tarjeta: PiCreditCard, mercadopago: PiWallet, spei: PiBank, oxxo: PiMoney };

function Steps({ step }: { step: 1 | 2 }) {
  const items = ['Datos y envío', 'Pago', 'Confirmación'];
  return (
    <ol className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm" aria-label="Pasos de la compra">
      {items.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3" aria-current={current ? 'step' : undefined}>
            <span
              className={cn(
                'grid size-7 place-items-center rounded-full text-xs font-semibold',
                done ? 'bg-musgo text-hueso' : current ? 'bg-raiz text-hueso' : 'border border-arena-oscura text-humo',
              )}
            >
              {done ? <PiCheck className="size-4" aria-label="Completado" /> : n}
            </span>
            <span className={cn(current ? 'font-semibold text-raiz' : 'text-humo', 'hidden sm:inline')}>{label}</span>
            {n < items.length && <span className="h-px w-6 bg-arena-oscura sm:w-10" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

export function CheckoutPage() {
  const router = useRouter();
  const cartReady = useHydrated(useCart);
  const accountReady = useHydrated(useAccount);
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.coupon);
  const clearCart = useCart((s) => s.clear);
  const user = useAccount((s) => s.user);
  const savedAddresses = useAccount((s) => s.addresses);
  const defaultAddressId = useAccount((s) => s.defaultAddressId);
  const saveAddressToAccount = useAccount((s) => s.saveAddress);
  const createOrder = useOrders((s) => s.create);

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<ShippingMethodId>('estandar');
  const [addressMode, setAddressMode] = useState<'saved' | 'new'>('new');
  const [addressId, setAddressId] = useState<string | null>(null);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [remember, setRemember] = useState(true);
  const [payment, setPayment] = useState<PaymentMethodId>('tarjeta');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const prefilled = useRef(false);

  // Prellenado con la cuenta (una sola vez, cuando ya se leyó localStorage).
  useEffect(() => {
    if (!accountReady || prefilled.current) return;
    prefilled.current = true;
    if (user) {
      setEmail(user.email);
      setName(user.name);
      setPhone(user.phone);
    }
    if (savedAddresses.length) {
      setAddressMode('saved');
      setAddressId(defaultAddressId ?? savedAddresses[0].id);
    }
  }, [accountReady, user, savedAddresses, defaultAddressId]);

  const resolved = resolveLines(lines);
  const totals = computeTotals(lines, coupon, method);
  const ready = cartReady && accountReady;

  if (!ready) {
    return (
      <div className="page py-10" aria-busy="true">
        <div className="h-8 w-48 animate-pulso rounded bg-lino" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="h-[32rem] animate-pulso rounded-xl bg-lino" />
          <div className="h-80 animate-pulso rounded-xl bg-lino" />
        </div>
      </div>
    );
  }

  if (resolved.length === 0 && !processing) {
    return (
      <div className="page py-16 text-center">
        <h1 className="text-2xl font-semibold text-raiz">No hay productos para pagar</h1>
        <p className="mt-2 text-humo">Agrega algo a tu carrito para continuar.</p>
        <Link href="/tienda" className="btn btn-primary mt-6">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const setAddr = (k: keyof Address, v: string) => {
    setAddress((a) => {
      const next = { ...a, [k]: v };
      if (k === 'zip' && /^\d{5}$/.test(v) && !a.state) {
        const st = ZIP_STATES.find(([re]) => re.test(v));
        if (st) next.state = st[1];
      }
      return next;
    });
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  };

  const selectedSaved = savedAddresses.find((a) => a.id === addressId);
  const usingSaved = method !== 'tienda' && addressMode === 'saved' && !!selectedSaved;

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!isEmail(email)) e.email = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    if (name.trim().length < 3) e.name = 'Escribe tu nombre y apellido.';
    if (!isPhone(phone)) e.phone = 'El teléfono debe tener 10 dígitos.';
    if (method !== 'tienda' && !usingSaved) {
      if (!address.street.trim()) e.street = 'Escribe la calle y el número.';
      if (!address.neighborhood.trim()) e.neighborhood = 'Escribe la colonia.';
      if (!isZip(address.zip)) e.zip = 'El código postal tiene 5 dígitos.';
      if (!address.city.trim()) e.city = 'Escribe la ciudad o municipio.';
      if (!address.state) e.state = 'Elige un estado.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onContinue = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validateStep1()) {
      focusFirstError(formRef.current);
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onPay = (ev: FormEvent) => {
    ev.preventDefault();
    if (!terms) {
      setErrors({ terms: 'Debes aceptar los términos y el aviso de privacidad para continuar.' });
      focusFirstError(formRef.current);
      return;
    }
    setProcessing(true);
    const finalAddress =
      method === 'tienda'
        ? undefined
        : usingSaved && selectedSaved
          ? { name: name.trim(), phone: formatPhone(phone), street: selectedSaved.street, neighborhood: selectedSaved.neighborhood, zip: selectedSaved.zip, city: selectedSaved.city, state: selectedSaved.state, references: selectedSaved.references }
          : { name: name.trim(), phone: formatPhone(phone), ...address, references: address.references || undefined };
    window.setTimeout(() => {
      const order = createOrder({
        email: email.trim(),
        customerName: name.trim(),
        phone: formatPhone(phone),
        shippingMethod: method,
        address: finalAddress,
        payment,
        lines: resolved.map((l) => ({ slug: l.slug, name: l.product.name, optionLabel: l.optionLabel, qty: l.qty, unitPrice: l.unitPrice, image: l.product.images[0] })),
        coupon: coupon ?? undefined,
        totals: { subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total },
        paid: PAYMENT_METHODS.find((m) => m.id === payment)!.instant,
      });
      if (user && remember && method !== 'tienda' && !usingSaved) {
        saveAddressToAccount({ label: 'Nueva dirección', name: name.trim(), phone: formatPhone(phone), ...address });
      }
      clearCart();
      router.replace(`/checkout/confirmacion?pedido=${order.id}`);
    }, 1400);
  };

  const shippingLabel = (id: ShippingMethodId) => {
    const m = COMMERCE.shippingMethods.find((s) => s.id === id)!;
    if (m.price === 0) return 'Gratis';
    if (m.freeEligible && totals.freeShipping) return 'Gratis';
    return money(m.price);
  };

  const summary = (
    <div className="space-y-5">
      <ul className="divide-y divide-linea">
        {resolved.map((l) => (
          <li key={l.key} className="flex items-center gap-3 py-3">
            <span className="relative shrink-0">
              <Image src={l.product.images[0]} alt="" width={56} height={56} className="size-14 rounded-md bg-lino" />
              <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-corteza text-[0.6875rem] font-semibold text-hueso">{l.qty}</span>
            </span>
            <span className="min-w-0 flex-1 text-sm">
              <span className="line-clamp-2 text-raiz">{l.product.name}</span>
              {l.optionLabel && <span className="block text-xs text-humo">{l.optionLabel}</span>}
            </span>
            <span className="text-sm text-raiz tabular-nums">{money(l.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <CouponForm />
      <dl className="space-y-2 border-t border-linea pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-humo">Subtotal</dt>
          <dd className="tabular-nums">{money(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-musgo">
            <dt>Descuento ({coupon})</dt>
            <dd className="tabular-nums">−{money(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-humo">{COMMERCE.shippingMethods.find((s) => s.id === method)!.name}</dt>
          <dd className="tabular-nums">{totals.shipping === 0 ? 'Gratis' : money(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-linea pt-3 text-base font-semibold text-raiz">
          <dt>Total</dt>
          <dd className="tabular-nums">{money(totals.total)}</dd>
        </div>
      </dl>
      <p className="text-xs text-humo">Precios en MXN con IVA incluido.</p>
    </div>
  );

  return (
    <div className="page pt-8 pb-20 md:pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-[-0.015em] text-raiz">Finalizar compra</h1>
        <Steps step={step} />
      </div>

      {/* Resumen colapsable en móvil */}
      <div className="mt-6 rounded-xl border border-linea bg-white lg:hidden">
        <button type="button" onClick={() => setSummaryOpen((o) => !o)} aria-expanded={summaryOpen} className="flex w-full items-center justify-between px-4 py-3.5 text-sm">
          <span className="flex items-center gap-2 font-medium text-raiz">
            {summaryOpen ? 'Ocultar' : 'Ver'} resumen ({plural(totals.itemCount, 'producto', 'productos')})
            <PiCaretDown className={cn('size-4 transition-transform', summaryOpen && 'rotate-180')} />
          </span>
          <span className="font-semibold text-raiz tabular-nums">{money(totals.total)}</span>
        </button>
        {summaryOpen && <div className="border-t border-linea px-4 pb-4">{summary}</div>}
      </div>

      <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-[1fr_24rem] lg:gap-12">
        <form ref={formRef} onSubmit={step === 1 ? onContinue : onPay} noValidate className="space-y-8">
          {step === 1 ? (
            <>
              <section className="space-y-4" aria-labelledby="contacto">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id="contacto" className="text-lg font-semibold text-raiz">
                    Contacto
                  </h2>
                  {!user && (
                    <Link href="/cuenta?volver=checkout" className="link text-sm">
                      ¿Ya tienes cuenta? Inicia sesión
                    </Link>
                  )}
                </div>
                <TextField label="Correo electrónico" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} hint="Aquí te enviaremos la confirmación y el seguimiento." />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Nombre completo" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
                  <TextField label="Teléfono (10 dígitos)" type="tel" autoComplete="tel-national" inputMode="numeric" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} error={errors.phone} placeholder="449 123 4567" />
                </div>
              </section>

              <section className="space-y-3" aria-labelledby="entrega">
                <h2 id="entrega" className="text-lg font-semibold text-raiz">
                  Entrega
                </h2>
                <div className="grid gap-2" role="radiogroup" aria-labelledby="entrega">
                  {COMMERCE.shippingMethods.map((m) => {
                    const Icon = SHIP_ICON[m.id];
                    const on = method === m.id;
                    return (
                      <label key={m.id} className={cn('flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-barro', on ? 'border-raiz bg-lino' : 'border-linea bg-white hover:border-arena-oscura')}>
                        <input type="radio" name="envio" value={m.id} checked={on} onChange={() => setMethod(m.id)} className="size-4 accent-raiz" />
                        <Icon className="size-6 shrink-0 text-barro" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-raiz">{m.name}</span>
                          <span className="block text-xs text-humo">{m.detail}</span>
                        </span>
                        <span className="text-sm font-semibold text-raiz">{shippingLabel(m.id)}</span>
                      </label>
                    );
                  })}
                </div>
                {!totals.freeShipping && method === 'estandar' && <p className="text-xs text-humo">Agrega {money(totals.remainingForFree)} más y tu envío estándar es gratis.</p>}
              </section>

              {method !== 'tienda' && (
                <section className="space-y-4" aria-labelledby="direccion">
                  <h2 id="direccion" className="text-lg font-semibold text-raiz">
                    Dirección de envío
                  </h2>
                  {savedAddresses.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {savedAddresses.map((a) => {
                        const on = addressMode === 'saved' && addressId === a.id;
                        return (
                          <label key={a.id} className={cn('flex cursor-pointer gap-3 rounded-lg border p-4 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-barro', on ? 'border-raiz bg-lino' : 'border-linea bg-white')}>
                            <input
                              type="radio"
                              name="direccion"
                              checked={on}
                              onChange={() => {
                                setAddressMode('saved');
                                setAddressId(a.id);
                              }}
                              className="mt-0.5 size-4 accent-raiz"
                            />
                            <span>
                              <span className="block font-semibold text-raiz">{a.label}</span>
                              <span className="block text-humo">
                                {a.street}, {a.neighborhood}
                              </span>
                              <span className="block text-humo">
                                {a.zip} {a.city}, {a.state}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                      <label className={cn('flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-barro', addressMode === 'new' ? 'border-raiz bg-lino' : 'border-linea bg-white')}>
                        <input type="radio" name="direccion" checked={addressMode === 'new'} onChange={() => setAddressMode('new')} className="size-4 accent-raiz" />
                        <span className="font-semibold text-raiz">Usar otra dirección</span>
                      </label>
                    </div>
                  )}
                  {(addressMode === 'new' || savedAddresses.length === 0) && (
                    <div className="grid gap-4 sm:grid-cols-6">
                      <TextField className="sm:col-span-6" label="Calle y número" autoComplete="address-line1" value={address.street} onChange={(e) => setAddr('street', e.target.value)} error={errors.street} placeholder="Av. Madero 120, int. 4" />
                      <TextField className="sm:col-span-2" label="Código postal" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={address.zip} onChange={(e) => setAddr('zip', e.target.value.replace(/\D/g, '').slice(0, 5))} error={errors.zip} />
                      <TextField className="sm:col-span-4" label="Colonia" autoComplete="address-level3" value={address.neighborhood} onChange={(e) => setAddr('neighborhood', e.target.value)} error={errors.neighborhood} />
                      <TextField className="sm:col-span-3" label="Ciudad o municipio" autoComplete="address-level2" value={address.city} onChange={(e) => setAddr('city', e.target.value)} error={errors.city} />
                      <SelectField className="sm:col-span-3" label="Estado" autoComplete="address-level1" value={address.state} onChange={(e) => setAddr('state', e.target.value)} error={errors.state}>
                        <option value="">Elige un estado</option>
                        {MX_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </SelectField>
                      <TextField className="sm:col-span-6" label="Referencias para la entrega" optional value={address.references} onChange={(e) => setAddr('references', e.target.value)} placeholder="Entre calles, color de la fachada…" />
                      {user && (
                        <label className="flex items-center gap-2.5 text-sm text-tinta sm:col-span-6">
                          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-raiz" />
                          Guardar esta dirección en mi cuenta
                        </label>
                      )}
                    </div>
                  )}
                </section>
              )}

              <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-64">
                Continuar al pago
              </button>
            </>
          ) : (
            <>
              <section className="rounded-xl border border-linea bg-white p-5 text-sm" aria-labelledby="revision">
                <div className="flex items-start justify-between gap-4">
                  <h2 id="revision" className="text-base font-semibold text-raiz">
                    Datos de entrega
                  </h2>
                  <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-sm text-barro underline underline-offset-2">
                    <PiPencilSimple className="size-4" /> Editar
                  </button>
                </div>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-humo">Contacto</dt>
                    <dd className="text-tinta">
                      {name}
                      <br />
                      {email}
                      <br />
                      {phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-humo">{COMMERCE.shippingMethods.find((m) => m.id === method)!.name}</dt>
                    <dd className="text-tinta">
                      {method === 'tienda' ? (
                        <>28 de Agosto #410, Barrio de la Estación, Aguascalientes</>
                      ) : usingSaved && selectedSaved ? (
                        <>
                          {selectedSaved.street}, {selectedSaved.neighborhood}
                          <br />
                          {selectedSaved.zip} {selectedSaved.city}, {selectedSaved.state}
                        </>
                      ) : (
                        <>
                          {address.street}, {address.neighborhood}
                          <br />
                          {address.zip} {address.city}, {address.state}
                        </>
                      )}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="space-y-3" aria-labelledby="pago">
                <h2 id="pago" className="text-lg font-semibold text-raiz">
                  Forma de pago
                </h2>
                <div className="grid gap-2" role="radiogroup" aria-labelledby="pago">
                  {PAYMENT_METHODS.map((m) => {
                    const Icon = PAY_ICON[m.id];
                    const on = payment === m.id;
                    return (
                      <label key={m.id} className={cn('flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-barro', on ? 'border-raiz bg-lino' : 'border-linea bg-white hover:border-arena-oscura')}>
                        <input type="radio" name="pago" value={m.id} checked={on} onChange={() => setPayment(m.id)} className="size-4 accent-raiz" />
                        <Icon className="size-6 shrink-0 text-barro" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-raiz">{m.name}</span>
                          <span className="block text-xs text-humo">{m.detail}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                <p className="flex gap-2 rounded-lg bg-musgo-claro p-3 text-xs leading-relaxed text-musgo">
                  <PiLockSimple className="size-4 shrink-0" aria-hidden="true" />
                  Modo demostración: no se realiza ningún cargo. En la tienda real, al confirmar se abre la pasarela segura (Mercado Pago, Openpay o Stripe) para completar el pago.
                </p>
              </section>

              <div className="space-y-1.5">
                <label className="flex items-start gap-2.5 text-sm text-tinta">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => {
                      setTerms(e.target.checked);
                      setErrors({});
                    }}
                    aria-invalid={errors.terms ? true : undefined}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                    className="mt-0.5 size-4 accent-raiz"
                  />
                  <span>
                    Acepto los{' '}
                    <Link href="/politicas/terminos-y-condiciones" target="_blank" className="link">
                      términos y condiciones
                    </Link>{' '}
                    y el{' '}
                    <Link href="/politicas/aviso-de-privacidad" target="_blank" className="link">
                      aviso de privacidad
                    </Link>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <p id="terms-error" role="alert" className="text-sm text-alerta">
                    {errors.terms}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                  Volver
                </button>
                <button type="submit" className="btn btn-primary sm:min-w-72" disabled={processing}>
                  {processing ? (
                    <>
                      <PiSpinnerGap className="size-4 animate-spin" aria-hidden="true" /> Procesando pago…
                    </>
                  ) : (
                    `Confirmar y pagar ${money(totals.total)}`
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <aside aria-label="Resumen del pedido" className="hidden h-fit rounded-xl border border-linea bg-white p-5 lg:sticky lg:top-36 lg:block">
          <h2 className="mb-2 text-lg font-semibold text-raiz">Tu pedido</h2>
          {summary}
        </aside>
      </div>
    </div>
  );
}
