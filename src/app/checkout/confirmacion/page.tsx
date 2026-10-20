import type { Metadata } from 'next';
import { Confirmation } from '@/components/checkout/Confirmation';
import { normalizeOrderId } from '@/lib/orders';

export const metadata: Metadata = {
  title: 'Pedido confirmado',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.pedido) ? sp.pedido[0] : sp.pedido;
  return <Confirmation orderId={normalizeOrderId(raw ?? '')} />;
}
