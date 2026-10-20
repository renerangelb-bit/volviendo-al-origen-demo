import type { Metadata } from 'next';
import { TrackingPage } from '@/components/orders/TrackingPage';
import { normalizeOrderId } from '@/lib/orders';

export const metadata: Metadata = {
  title: 'Rastrear pedido',
  description: 'Consulta el estado de tu pedido de Volviendo al Origen con tu número de pedido.',
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.pedido) ? sp.pedido[0] : sp.pedido;
  const id = normalizeOrderId(raw ?? '');
  return <TrackingPage key={id} initialId={id} />;
}
