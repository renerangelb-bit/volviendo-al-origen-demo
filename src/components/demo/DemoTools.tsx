'use client';

import { useState } from 'react';
import { PiArrowCounterClockwise, PiCheckCircle } from 'react-icons/pi';

const KEYS = ['vao-cart', 'vao-account', 'vao-orders'];

/** Borra carrito, cuenta y pedidos guardados en este navegador para empezar la presentación desde cero. */
export function DemoReset() {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => {
          try {
            KEYS.forEach((k) => window.localStorage.removeItem(k));
          } catch {
            /* almacenamiento no disponible */
          }
          setDone(true);
          window.setTimeout(() => window.location.assign('/'), 700);
        }}
      >
        <PiArrowCounterClockwise className="size-4" /> Reiniciar datos de la demo
      </button>
      {done && (
        <span className="flex items-center gap-1.5 text-sm text-musgo" role="status">
          <PiCheckCircle className="size-4" /> Listo, volviendo al inicio…
        </span>
      )}
    </div>
  );
}
