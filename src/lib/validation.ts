export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const digitsOnly = (v: string) => v.replace(/\D/g, '');
export const isPhone = (v: string) => digitsOnly(v).length === 10;
export const isZip = (v: string) => /^\d{5}$/.test(v.trim());

export type Errors<T extends string> = Partial<Record<T, string>>;

export function required(v: string | undefined | null, msg: string) {
  return v && v.trim() ? undefined : msg;
}

/** Formatea 4491234567 → 449 123 4567 mientras se escribe. */
export function formatPhone(v: string) {
  const d = digitsOnly(v).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}
