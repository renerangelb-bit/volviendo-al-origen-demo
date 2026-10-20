import Link from 'next/link';
import { COMMERCE } from '@/data/site';
import { money } from '@/lib/format';

export function AnnouncementBar() {
  return (
    <div className="bg-raiz text-hueso">
      <p className="page flex h-9 items-center justify-center text-center text-[0.6875rem] font-medium tracking-[0.14em] uppercase sm:text-xs">
        <Link href="/ayuda#envios" className="hover:underline hover:underline-offset-4">
          Envío gratis en compras mayores a {money(COMMERCE.freeShippingFrom)}
        </Link>
      </p>
    </div>
  );
}
