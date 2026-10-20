'use client';

import { useState, type FormEvent } from 'react';
import { PiTag, PiX } from 'react-icons/pi';
import { useCart } from '@/store/cart';
import { findCoupon } from '@/lib/pricing';

export function CouponForm() {
  const coupon = useCart((s) => s.coupon);
  const apply = useCart((s) => s.applyCoupon);
  const remove = useCart((s) => s.removeCoupon);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = apply(code);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok) setCode('');
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-dashed border-musgo bg-musgo-claro px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2 text-musgo">
          <PiTag className="size-4" /> <strong className="font-semibold tracking-[0.08em]">{coupon}</strong> {findCoupon(coupon)?.label}
        </span>
        <button
          type="button"
          onClick={() => {
            remove();
            setMsg(null);
          }}
          aria-label={`Quitar cupón ${coupon}`}
          className="grid size-8 place-items-center rounded-md text-humo hover:bg-hueso"
        >
          <PiX className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="cupon" className="text-sm font-medium text-raiz">
        Cupón de descuento
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          id="cupon"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Ej. BIENVENIDA10"
          autoComplete="off"
          aria-invalid={msg && !msg.ok ? true : undefined}
          aria-describedby={msg ? 'cupon-msg' : undefined}
          className="field h-11 min-h-0 min-w-0 flex-1 uppercase placeholder:normal-case"
        />
        <button type="submit" className="btn btn-outline h-11 min-h-0 shrink-0">
          Aplicar
        </button>
      </div>
      {msg && (
        <p id="cupon-msg" role={msg.ok ? 'status' : 'alert'} className={msg.ok ? 'mt-1.5 text-sm text-musgo' : 'mt-1.5 text-sm text-alerta'}>
          {msg.text}
        </p>
      )}
    </form>
  );
}
