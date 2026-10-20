import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SITE } from '@/data/site';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchDialog } from '@/components/search/SearchDialog';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { Toaster } from '@/components/system/Toaster';
import { StoreHydration } from '@/components/system/StoreHydration';

const montserrat = localFont({
  src: [
    { path: '../../public/fonts/montserrat-variable.woff', weight: '100 900', style: 'normal' },
    { path: '../../public/fonts/montserrat-italic-variable.woff', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Volviendo al Origen | Cosmética sólida artesanal de Aguascalientes',
    template: '%s | Volviendo al Origen',
  },
  description: SITE.description,
  keywords: ['champú sólido', 'jabón artesanal', 'cosmética sólida', 'zero waste', 'Aguascalientes', 'cosmética natural'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: SITE.name,
    title: 'Volviendo al Origen | Cosmética sólida artesanal',
    description: SITE.description,
    images: [{ url: '/images/hero/hero.webp', width: 1600, height: 1000, alt: 'Jabones y champús sólidos artesanales' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#2e2017',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={montserrat.variable}>
      <body className="flex min-h-dvh flex-col">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <AnnouncementBar />
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <SearchDialog />
        <ChatWidget />
        <Toaster />
        <StoreHydration />
      </body>
    </html>
  );
}
