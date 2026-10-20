'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { PiBookmarkSimple, PiHouse, PiMapPin, PiPackage, PiPencilSimple, PiPlus, PiSignOut, PiSquaresFour, PiTrash, PiUser, PiCheckCircle } from 'react-icons/pi';
import { useAccount, DEMO_USER } from '@/store/account';
import { useOrders } from '@/store/orders';
import { useCart } from '@/store/cart';
import { useUi } from '@/store/ui';
import { demoOrders } from '@/data/demo-orders';
import { MX_STATES } from '@/data/site';
import { getProduct } from '@/data/products';
import type { Product } from '@/data/catalog-types';
import { currentStatus, statusCopy, type Address, type Order } from '@/lib/orders';
import { money, formatDateLocal, plural } from '@/lib/format';
import { formatPhone, isEmail, isPhone, isZip } from '@/lib/validation';
import { cn } from '@/lib/cn';
import { TextField, SelectField, focusFirstError } from '@/components/ui/Field';
import { ProductCard } from '@/components/product/ProductCard';

export type View = 'resumen' | 'pedidos' | 'direcciones' | 'favoritos' | 'datos';

const TABS: { id: View; label: string; icon: typeof PiUser }[] = [
  { id: 'resumen', label: 'Resumen', icon: PiSquaresFour },
  { id: 'pedidos', label: 'Mis pedidos', icon: PiPackage },
  { id: 'direcciones', label: 'Direcciones', icon: PiMapPin },
  { id: 'favoritos', label: 'Favoritos', icon: PiBookmarkSimple },
  { id: 'datos', label: 'Mis datos', icon: PiUser },
];

function StatusPill({ order }: { order: Order }) {
  const s = currentStatus(order);
  const copy = statusCopy(s, order.shippingMethod);
  const tone = s === 'entregado' ? 'bg-musgo-claro text-musgo' : s === 'enviado' ? 'bg-[#e8eef3] text-[#2f5372]' : 'bg-[#fbf3e3] text-[#7a5410]';
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', tone)}>{copy.label}</span>;
}

function OrderCard({ order, onReorder }: { order: Order; onReorder: (o: Order) => void }) {
  const count = order.lines.reduce((n, l) => n + l.qty, 0);
  return (
    <li className="rounded-xl border border-linea bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-raiz">{order.id}</p>
          <p className="text-xs text-humo">
            {formatDateLocal(order.createdAt)} · {plural(count, 'producto', 'productos')} · {money(order.totals.total)}
          </p>
        </div>
        <StatusPill order={order} />
      </div>
      <ul className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {order.lines.map((l) => (
          <li key={`${l.slug}-${l.optionLabel ?? ''}`} className="relative shrink-0">
            <Image src={l.image} alt={l.name} width={56} height={56} className="size-14 rounded-md bg-lino" />
            {l.qty > 1 && <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-corteza text-[0.6875rem] font-semibold text-hueso">{l.qty}</span>}
          </li>
        ))}
      </ul>
      {order.carrier && (
        <p className="mt-3 text-xs text-humo">
          {order.carrier.name} · guía {order.carrier.tracking}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/rastreo?pedido=${order.id}`} className="btn btn-primary btn-sm">
          Ver seguimiento
        </Link>
        <button type="button" onClick={() => onReorder(order)} className="btn btn-outline btn-sm">
          Volver a comprar
        </button>
      </div>
    </li>
  );
}

function AddressForm({ initial, onCancel, onSave }: { initial?: Address; onCancel: () => void; onSave: (a: Omit<Address, 'id'> & { id?: string }) => void }) {
  const [a, setA] = useState<Omit<Address, 'id'>>(
    initial ?? { label: '', name: '', phone: '', street: '', neighborhood: '', zip: '', city: '', state: '', references: '' },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const ref = useRef<HTMLFormElement>(null);
  const set = (k: keyof Omit<Address, 'id'>, v: string) => setA((x) => ({ ...x, [k]: v }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!a.label.trim()) err.label = 'Ponle un nombre, como Casa u Oficina.';
    if (a.name.trim().length < 3) err.name = 'Escribe el nombre de quien recibe.';
    if (!isPhone(a.phone)) err.phone = 'El teléfono debe tener 10 dígitos.';
    if (!a.street.trim()) err.street = 'Escribe la calle y el número.';
    if (!a.neighborhood.trim()) err.neighborhood = 'Escribe la colonia.';
    if (!isZip(a.zip)) err.zip = 'El código postal tiene 5 dígitos.';
    if (!a.city.trim()) err.city = 'Escribe la ciudad o municipio.';
    if (!a.state) err.state = 'Elige un estado.';
    setErrors(err);
    if (Object.keys(err).length) return focusFirstError(ref.current);
    onSave({ ...a, id: initial?.id });
  };
  return (
    <form ref={ref} onSubmit={submit} noValidate className="grid gap-4 rounded-xl border border-raiz/30 bg-white p-5 sm:grid-cols-6">
      <p className="text-base font-semibold text-raiz sm:col-span-6">{initial ? 'Editar dirección' : 'Nueva dirección'}</p>
      <TextField className="sm:col-span-2" label="Nombre de la dirección" placeholder="Casa" value={a.label} onChange={(e) => set('label', e.target.value)} error={errors.label} />
      <TextField className="sm:col-span-2" label="Quién recibe" autoComplete="name" value={a.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
      <TextField className="sm:col-span-2" label="Teléfono" type="tel" inputMode="numeric" value={a.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} error={errors.phone} />
      <TextField className="sm:col-span-6" label="Calle y número" autoComplete="address-line1" value={a.street} onChange={(e) => set('street', e.target.value)} error={errors.street} />
      <TextField className="sm:col-span-2" label="Código postal" inputMode="numeric" maxLength={5} value={a.zip} onChange={(e) => set('zip', e.target.value.replace(/\D/g, '').slice(0, 5))} error={errors.zip} />
      <TextField className="sm:col-span-4" label="Colonia" value={a.neighborhood} onChange={(e) => set('neighborhood', e.target.value)} error={errors.neighborhood} />
      <TextField className="sm:col-span-3" label="Ciudad o municipio" value={a.city} onChange={(e) => set('city', e.target.value)} error={errors.city} />
      <SelectField className="sm:col-span-3" label="Estado" value={a.state} onChange={(e) => set('state', e.target.value)} error={errors.state}>
        <option value="">Elige un estado</option>
        {MX_STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </SelectField>
      <TextField className="sm:col-span-6" label="Referencias" optional value={a.references ?? ''} onChange={(e) => set('references', e.target.value)} />
      <div className="flex gap-2 sm:col-span-6">
        <button type="submit" className="btn btn-primary">
          Guardar dirección
        </button>
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function AccountDashboard({ initialView }: { initialView: View }) {
  const user = useAccount((s) => s.user);
  const addresses = useAccount((s) => s.addresses);
  const defaultAddressId = useAccount((s) => s.defaultAddressId);
  const favorites = useAccount((s) => s.favorites);
  const logout = useAccount((s) => s.logout);
  const saveAddress = useAccount((s) => s.saveAddress);
  const removeAddress = useAccount((s) => s.removeAddress);
  const setDefault = useAccount((s) => s.setDefaultAddress);
  const updateProfile = useAccount((s) => s.updateProfile);
  const localOrders = useOrders((s) => s.orders);
  const addToCart = useCart((s) => s.add);
  const open = useUi((s) => s.open);
  const toast = useUi((s) => s.toast);
  const [view, setView] = useState<View>(initialView);
  const [editing, setEditing] = useState<Address | 'new' | null>(null);
  const [profile, setProfile] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '', birthday: user?.birthday ?? '', newsletter: user?.newsletter ?? false });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  const email = user?.email.toLowerCase() ?? '';
  const orders = useMemo(() => {
    const mine = localOrders.filter((o) => o.email.toLowerCase() === email);
    const demo = email === DEMO_USER.email ? demoOrders() : [];
    return [...mine, ...demo].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [localOrders, email]);
  const favProducts = favorites.map(getProduct).filter(Boolean) as Product[];

  useEffect(() => {
    const url = new URL(window.location.href);
    if (view === 'resumen') url.searchParams.delete('vista');
    else url.searchParams.set('vista', view);
    window.history.replaceState(null, '', url.pathname + url.search);
  }, [view]);

  if (!user) return null;
  const firstName = user.name.split(' ')[0];

  const reorder = (o: Order) => {
    let added = 0;
    o.lines.forEach((l) => {
      const p = getProduct(l.slug);
      if (!p || p.stock <= 0) return;
      const opt = p.options?.values.find((v) => v.label === l.optionLabel)?.id;
      if (addToCart(l.slug, l.qty, opt) > 0) added++;
    });
    if (added) open('cart');
    else toast({ title: 'Estos productos no están disponibles por ahora', tone: 'error' });
  };

  const saveProfile = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (profile.name.trim().length < 3) err.name = 'Escribe tu nombre y apellido.';
    if (!isEmail(profile.email)) err.email = 'Escribe un correo válido.';
    if (profile.phone && !isPhone(profile.phone)) err.phone = 'El teléfono debe tener 10 dígitos.';
    setProfileErrors(err);
    if (Object.keys(err).length) return;
    updateProfile({ ...profile, name: profile.name.trim(), email: profile.email.trim() });
    toast({ title: 'Datos actualizados', tone: 'success' });
  };

  const last = orders[0];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.015em] text-raiz md:text-4xl">Hola, {firstName}</h1>
          <p className="mt-1 text-sm text-humo">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            toast({ title: 'Cerraste sesión', description: 'Tu carrito sigue guardado en este dispositivo.' });
          }}
          className="inline-flex items-center gap-2 text-sm text-humo hover:text-raiz"
        >
          <PiSignOut className="size-5" /> Cerrar sesión
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[14rem_1fr] lg:gap-12">
        <nav aria-label="Secciones de mi cuenta" className="no-scrollbar -mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <ul className="flex gap-2 lg:flex-col lg:gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setView(id)}
                  aria-current={view === id ? 'page' : undefined}
                  className={cn(
                    'flex h-11 w-full items-center gap-2.5 rounded-md px-3.5 text-sm whitespace-nowrap transition-colors',
                    view === id ? 'bg-raiz text-hueso' : 'bg-lino text-raiz hover:bg-arena lg:bg-transparent',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                  {id === 'pedidos' && orders.length > 0 && <span className={cn('ml-auto text-xs', view === id ? 'text-hueso/80' : 'text-humo')}>{orders.length}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 animate-aparecer" key={view}>
          {view === 'resumen' && (
            <div className="grid gap-5 md:grid-cols-2">
              <section className="rounded-xl border border-linea bg-white p-5 md:col-span-2">
                <h2 className="text-base font-semibold text-raiz">Tu último pedido</h2>
                {last ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-corteza">
                        {last.id} · {formatDateLocal(last.createdAt)} · {money(last.totals.total)}
                      </p>
                      <div className="mt-2">
                        <StatusPill order={last} />
                      </div>
                    </div>
                    <Link href={`/rastreo?pedido=${last.id}`} className="btn btn-primary btn-sm">
                      Ver seguimiento
                    </Link>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-humo">
                    Aún no tienes pedidos.{' '}
                    <Link href="/tienda" className="link">
                      Ir a la tienda
                    </Link>
                  </p>
                )}
              </section>
              <section className="rounded-xl border border-linea bg-white p-5">
                <h2 className="text-base font-semibold text-raiz">Dirección principal</h2>
                {addresses.length ? (
                  (() => {
                    const a = addresses.find((x) => x.id === defaultAddressId) ?? addresses[0];
                    return (
                      <p className="mt-2 text-sm text-corteza">
                        <strong className="font-semibold text-raiz">{a.label}</strong>
                        <br />
                        {a.street}, {a.neighborhood}
                        <br />
                        {a.zip} {a.city}, {a.state}
                      </p>
                    );
                  })()
                ) : (
                  <p className="mt-2 text-sm text-humo">Sin direcciones guardadas.</p>
                )}
                <button type="button" onClick={() => setView('direcciones')} className="link mt-3 text-sm">
                  Administrar direcciones
                </button>
              </section>
              <section className="rounded-xl border border-linea bg-white p-5">
                <h2 className="text-base font-semibold text-raiz">Favoritos</h2>
                <p className="mt-2 text-sm text-corteza">{favProducts.length ? plural(favProducts.length, 'producto guardado', 'productos guardados') : 'Guarda productos con el listón de cada tarjeta.'}</p>
                <div className="mt-3 flex -space-x-2">
                  {favProducts.slice(0, 5).map((p) => (
                    <Image key={p.slug} src={p.images[0]} alt={p.name} width={44} height={44} className="size-11 rounded-full border-2 border-hueso bg-lino" />
                  ))}
                </div>
                <button type="button" onClick={() => setView('favoritos')} className="link mt-3 text-sm">
                  Ver favoritos
                </button>
              </section>
            </div>
          )}

          {view === 'pedidos' && (
            <section aria-labelledby="t-pedidos">
              <h2 id="t-pedidos" className="text-xl font-semibold text-raiz">
                Mis pedidos
              </h2>
              {orders.length === 0 ? (
                <div className="mt-4 rounded-xl bg-lino p-8 text-center">
                  <PiPackage className="mx-auto size-10 text-barro" aria-hidden="true" />
                  <p className="mt-3 font-semibold text-raiz">Todavía no tienes pedidos</p>
                  <p className="mt-1 text-sm text-humo">Cuando compres, aquí verás su estado y la guía de envío.</p>
                  <Link href="/tienda" className="btn btn-primary mt-5">
                    Ir a la tienda
                  </Link>
                </div>
              ) : (
                <ul className="mt-4 space-y-4">
                  {orders.map((o) => (
                    <OrderCard key={o.id} order={o} onReorder={reorder} />
                  ))}
                </ul>
              )}
            </section>
          )}

          {view === 'direcciones' && (
            <section aria-labelledby="t-dir" className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 id="t-dir" className="text-xl font-semibold text-raiz">
                  Direcciones
                </h2>
                {editing === null && (
                  <button type="button" onClick={() => setEditing('new')} className="btn btn-outline btn-sm">
                    <PiPlus className="size-4" /> Agregar
                  </button>
                )}
              </div>
              {editing !== null && (
                <AddressForm
                  initial={editing === 'new' ? undefined : editing}
                  onCancel={() => setEditing(null)}
                  onSave={(a) => {
                    saveAddress(a);
                    setEditing(null);
                    toast({ title: 'Dirección guardada', tone: 'success' });
                  }}
                />
              )}
              {addresses.length === 0 && editing === null ? (
                <div className="rounded-xl bg-lino p-8 text-center">
                  <PiHouse className="mx-auto size-10 text-barro" aria-hidden="true" />
                  <p className="mt-3 font-semibold text-raiz">Sin direcciones guardadas</p>
                  <p className="mt-1 text-sm text-humo">Guárdalas para pagar más rápido.</p>
                </div>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {addresses.map((a) => (
                    <li key={a.id} className={cn('rounded-xl border bg-white p-5 text-sm', a.id === defaultAddressId ? 'border-raiz' : 'border-linea')}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-raiz">{a.label}</p>
                        {a.id === defaultAddressId && <span className="rounded-full bg-lino px-2 py-0.5 text-xs text-corteza">Principal</span>}
                      </div>
                      <p className="mt-2 text-corteza">
                        {a.name} · {a.phone}
                        <br />
                        {a.street}, {a.neighborhood}
                        <br />
                        {a.zip} {a.city}, {a.state}
                      </p>
                      {a.references && <p className="mt-1 text-xs text-humo">{a.references}</p>}
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                        <button type="button" onClick={() => setEditing(a)} className="inline-flex items-center gap-1.5 text-barro underline underline-offset-2">
                          <PiPencilSimple className="size-4" /> Editar
                        </button>
                        {a.id !== defaultAddressId && (
                          <button type="button" onClick={() => setDefault(a.id)} className="text-barro underline underline-offset-2">
                            Hacer principal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            removeAddress(a.id);
                            toast({ title: 'Dirección eliminada', description: a.label });
                          }}
                          className="inline-flex items-center gap-1.5 text-humo hover:text-alerta"
                        >
                          <PiTrash className="size-4" /> Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {view === 'favoritos' && (
            <section aria-labelledby="t-fav">
              <h2 id="t-fav" className="text-xl font-semibold text-raiz">
                Favoritos
              </h2>
              {favProducts.length === 0 ? (
                <div className="mt-4 rounded-xl bg-lino p-8 text-center">
                  <PiBookmarkSimple className="mx-auto size-10 text-barro" aria-hidden="true" />
                  <p className="mt-3 font-semibold text-raiz">Aún no guardas productos</p>
                  <p className="mt-1 text-sm text-humo">Toca el listón de cualquier producto para guardarlo aquí.</p>
                  <Link href="/tienda" className="btn btn-primary mt-5">
                    Explorar la tienda
                  </Link>
                </div>
              ) : (
                <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                  {favProducts.map((p) => (
                    <li key={p.slug} className="flex">
                      <ProductCard product={p} className="w-full" />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {view === 'datos' && (
            <section aria-labelledby="t-datos" className="max-w-xl">
              <h2 id="t-datos" className="text-xl font-semibold text-raiz">
                Mis datos
              </h2>
              <form onSubmit={saveProfile} noValidate className="mt-4 space-y-4 rounded-xl border border-linea bg-white p-5">
                <TextField label="Nombre completo" autoComplete="name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} error={profileErrors.name} />
                <TextField label="Correo electrónico" type="email" autoComplete="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} error={profileErrors.email} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Teléfono" type="tel" inputMode="numeric" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: formatPhone(e.target.value) }))} error={profileErrors.phone} />
                  <TextField label="Cumpleaños" optional type="date" value={profile.birthday} onChange={(e) => setProfile((p) => ({ ...p, birthday: e.target.value }))} />
                </div>
                <label className="flex items-start gap-2.5 text-sm text-tinta">
                  <input type="checkbox" checked={profile.newsletter} onChange={(e) => setProfile((p) => ({ ...p, newsletter: e.target.checked }))} className="mt-0.5 size-4 accent-raiz" />
                  Recibir tips, lanzamientos y promociones por correo
                </label>
                <button type="submit" className="btn btn-primary">
                  Guardar cambios
                </button>
              </form>
              <div className="mt-5 rounded-xl border border-linea bg-white p-5">
                <h3 className="text-base font-semibold text-raiz">Contraseña</h3>
                <p className="mt-1 text-sm text-humo">Te enviaremos un enlace seguro a {user.email} para cambiarla.</p>
                <button type="button" onClick={() => toast({ title: 'Enlace enviado', description: `Revisa ${user.email}.`, tone: 'success' })} className="btn btn-outline btn-sm mt-3">
                  <PiCheckCircle className="size-4" /> Enviar enlace
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
