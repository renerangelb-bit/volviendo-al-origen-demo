import type { Metadata } from 'next';
import { AccountPage } from '@/components/account/AccountPage';
import type { View } from '@/components/account/AccountDashboard';

export const metadata: Metadata = {
  title: 'Mi cuenta',
  robots: { index: false, follow: true },
};

const VIEWS: View[] = ['resumen', 'pedidos', 'direcciones', 'favoritos', 'datos'];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : (sp[k] as string | undefined));
  const vista = one('vista') as View | undefined;
  return <AccountPage initialView={vista && VIEWS.includes(vista) ? vista : 'resumen'} registerEmail={one('registro')} returnTo={one('volver')} />;
}
