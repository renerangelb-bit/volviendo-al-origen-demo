import Link from 'next/link';
import { Emblem } from '@/components/layout/Logo';

export default function NotFound() {
  return (
    <div className="page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Emblem className="size-14 text-barro" />
      <p className="mt-6 text-sm font-semibold tracking-[0.14em] text-humo uppercase">Error 404</p>
      <h1 className="mt-2 text-3xl font-semibold text-raiz md:text-4xl">Esta página no existe</h1>
      <p className="mt-3 max-w-md text-humo">Puede que el enlace haya cambiado o que el producto ya no esté disponible.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/tienda" className="btn btn-primary">
          Ir a la tienda
        </Link>
        <Link href="/" className="btn btn-outline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
