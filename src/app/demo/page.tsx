import type { Metadata } from 'next';
import Link from 'next/link';
import { DemoReset } from '@/components/demo/DemoTools';

export const metadata: Metadata = {
  title: 'Guía de la demo',
  robots: { index: false, follow: false },
};

const STEPS: { title: string; text: string; href: string; cta: string }[] = [
  { title: 'Inicio (Home v2)', text: 'Hero, beneficios y confianza, destacados, compra por categoría, historia, rutinas y comunidad, en el orden de la propuesta.', href: '/', cta: 'Abrir inicio' },
  { title: 'Tienda con filtros', text: 'Filtra por categoría, necesidad, precio y disponibilidad; ordena y comparte la URL: los filtros se conservan.', href: '/tienda?necesidad=caida', cta: 'Ver productos para la caída' },
  { title: 'Ficha con variantes', text: 'Elige el aroma de la vela, ajusta la cantidad y agrega: se abre el carrito lateral. En móvil aparece una barra fija para agregar.', href: '/producto/velas-aromaticas', cta: 'Abrir Velas Aromáticas' },
  { title: 'Carrito y cupón', text: 'Cambia cantidades, guarda para después y aplica el cupón BIENVENIDA10. El medidor muestra cuánto falta para el envío gratis.', href: '/carrito', cta: 'Ir al carrito' },
  { title: 'Checkout y confirmación', text: 'Datos, envío (estándar, express o recoger en tienda) y forma de pago. Con OXXO o SPEI se genera una referencia de pago.', href: '/checkout', cta: 'Ir al checkout' },
  { title: 'Rastreo de pedidos', text: 'Prueba VAO-10482 (enviado) o el pedido que acabas de crear; con «Simular siguiente estado» recorres todo el flujo operativo.', href: '/rastreo?pedido=VAO-10482', cta: 'Rastrear VAO-10482' },
  { title: 'Mi cuenta', text: '«Entrar con cuenta demo» muestra historial, direcciones guardadas, favoritos y datos. El checkout se prellena con la cuenta.', href: '/cuenta', cta: 'Abrir Mi cuenta' },
  { title: 'Asistente y buscador', text: 'El botón de chat responde envíos, pagos, devoluciones y estado de pedidos, y escala a WhatsApp. La lupa busca en vivo.', href: '/ayuda', cta: 'Abrir centro de ayuda' },
];

export default function DemoPage() {
  return (
    <div className="page max-w-4xl pt-10 pb-20">
      <p className="text-sm text-barro">Prototipo NEXA para Volviendo al Origen</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.02em] text-raiz">Guía de la demo</h1>
      <p className="mt-3 max-w-2xl text-corteza">
        Recorrido sugerido para presentar la propuesta. Todo funciona en el navegador: no hay cobros reales y los datos se guardan sólo en este dispositivo.
      </p>
      <ol className="mt-10 space-y-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-4 rounded-xl border border-linea bg-white p-5 sm:flex-row sm:items-center">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-raiz text-sm font-semibold text-hueso">{i + 1}</span>
            <div className="flex-1">
              <h2 className="font-semibold text-raiz">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-corteza">{s.text}</p>
            </div>
            <Link href={s.href} className="btn btn-outline btn-sm shrink-0">
              {s.cta}
            </Link>
          </li>
        ))}
      </ol>
      <section className="mt-12 rounded-xl bg-lino p-6">
        <h2 className="font-semibold text-raiz">Empezar de cero</h2>
        <p className="mt-1 mb-4 text-sm text-corteza">Borra el carrito, la sesión y los pedidos creados en este navegador antes de cada presentación.</p>
        <DemoReset />
      </section>
    </div>
  );
}
