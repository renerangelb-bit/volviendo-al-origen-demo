import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { COMMERCE } from '@/data/site';
import { getProduct } from '@/data/products';
import { findCoupon, lineKey, type CartLine } from '@/lib/pricing';

type CartState = {
  lines: CartLine[];
  saved: CartLine[];
  coupon: string | null;
  /** Agrega y devuelve la cantidad final de esa línea (limitada por stock y máximo por artículo). */
  add: (slug: string, qty?: number, optionId?: string) => number;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  restore: (line: CartLine, index: number) => void;
  saveForLater: (key: string) => void;
  moveToCart: (key: string) => void;
  removeSaved: (key: string) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  clear: () => void;
};

export const maxQtyFor = (slug: string) => {
  const p = getProduct(slug);
  return Math.max(0, Math.min(COMMERCE.maxQtyPerItem, p?.stock ?? 0));
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      saved: [],
      coupon: null,
      add: (slug, qty = 1, optionId) => {
        const key = lineKey(slug, optionId);
        const max = maxQtyFor(slug);
        const existing = get().lines.find((l) => l.key === key);
        const next = Math.min(max, (existing?.qty ?? 0) + qty);
        if (next <= 0) return 0;
        set((s) => ({
          lines: existing ? s.lines.map((l) => (l.key === key ? { ...l, qty: next } : l)) : [...s.lines, { key, slug, optionId, qty: next }],
          saved: s.saved.filter((l) => l.key !== key),
        }));
        return next;
      },
      setQty: (key, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.key === key ? { ...l, qty: Math.max(0, Math.min(maxQtyFor(l.slug), qty)) } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      restore: (line, index) =>
        set((s) => {
          if (s.lines.some((l) => l.key === line.key)) return s;
          const lines = [...s.lines];
          lines.splice(Math.min(index, lines.length), 0, line);
          return { lines };
        }),
      saveForLater: (key) =>
        set((s) => {
          const line = s.lines.find((l) => l.key === key);
          if (!line) return s;
          return { lines: s.lines.filter((l) => l.key !== key), saved: [line, ...s.saved.filter((l) => l.key !== key)] };
        }),
      moveToCart: (key) => {
        const line = get().saved.find((l) => l.key === key);
        if (!line) return;
        set((s) => ({ saved: s.saved.filter((l) => l.key !== key) }));
        get().add(line.slug, line.qty, line.optionId);
      },
      removeSaved: (key) => set((s) => ({ saved: s.saved.filter((l) => l.key !== key) })),
      applyCoupon: (code) => {
        const c = findCoupon(code);
        if (!code.trim()) return { ok: false, message: 'Escribe un código de cupón.' };
        if (!c) return { ok: false, message: `El cupón “${code.trim().toUpperCase()}” no es válido o ya expiró.` };
        set({ coupon: c.code });
        return { ok: true, message: `Cupón ${c.code} aplicado: ${c.label}.` };
      },
      removeCoupon: () => set({ coupon: null }),
      clear: () => set({ lines: [], coupon: null }),
    }),
    {
      name: 'vao-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines, saved: s.saved, coupon: s.coupon }),
    },
  ),
);
