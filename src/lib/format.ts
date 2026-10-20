const mxnWhole = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const mxnCents = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** $1,200 · $35.50 — sin decimales cuando el monto es entero. */
export function money(n: number) {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? mxnWhole.format(rounded) : mxnCents.format(rounded);
}

const dateLong = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const dateShort = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** Fechas "AAAA-MM-DD" (sin hora) se formatean en UTC para que servidor y navegador coincidan. */
export function formatDay(isoDay: string) {
  return dateLong.format(new Date(isoDay.length === 10 ? `${isoDay}T12:00:00Z` : isoDay));
}

/** Fechas con hora (pedidos creados en el navegador) en la zona horaria local de la persona. */
export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
}

export function formatDateLocal(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export function formatShortDay(iso: string) {
  return dateShort.format(new Date(iso));
}

export function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

/** Quita acentos y pasa a minúsculas para búsquedas tolerantes ("jabon" encuentra "Jabón"). */
export function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** "26 al 30 de octubre" o "30 de octubre al 3 de noviembre" (zona horaria local). */
export function formatRange(from: Date, to: Date) {
  const day = new Intl.DateTimeFormat('es-MX', { day: 'numeric' });
  const dayMonth = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' });
  if (from.toDateString() === to.toDateString()) return dayMonth.format(from);
  if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) return `${day.format(from)} al ${dayMonth.format(to)}`;
  return `${dayMonth.format(from)} al ${dayMonth.format(to)}`;
}
