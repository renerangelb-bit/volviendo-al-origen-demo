import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct, relatedProducts } from '@/data/products';
import { categoryName } from '@/data/categories';
import { SITE } from '@/data/site';
import { ProductView } from '@/components/product/ProductView';
import { ProductDetails } from '@/components/product/ProductDetails';
import { Reviews } from '@/components/product/Reviews';
import { ProductCard } from '@/components/product/ProductCard';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: 'Producto no encontrado' };
  return {
    title: p.name,
    description: p.short,
    openGraph: { title: p.name, description: p.short, images: [{ url: p.images[0], width: 1000, height: 1000, alt: p.name }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = relatedProducts(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short,
    image: `${SITE.url}${product.images[0]}`,
    sku: product.sku ?? product.slug,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MXN',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE.url}/producto/${product.slug}`,
    },
  };

  return (
    <div className="page pt-6 pb-20 md:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Ruta de navegación" className="mb-6 text-xs text-humo">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <Link href="/" className="hover:text-raiz hover:underline">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/tienda" className="hover:text-raiz hover:underline">
              Tienda
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/tienda?categoria=${product.category}`} className="hover:text-raiz hover:underline">
              {categoryName(product.category)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-tinta">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductView product={product} />

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <ProductDetails product={product} />
        <aside className="h-fit rounded-xl bg-lino p-6">
          <h2 className="text-base font-semibold text-raiz">Hecho a mano, sin plástico</h2>
          <p className="mt-2 text-sm leading-relaxed text-corteza">
            Cada pieza se elabora en nuestro taller de Aguascalientes en lotes pequeños. Por eso el color y la forma pueden variar ligeramente entre una pieza y otra.
          </p>
          <Link href="/nosotros" className="link mt-4 inline-block text-sm">
            Conoce nuestro proceso
          </Link>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="relacionados">
          <h2 id="relacionados" className="section-title">
            Complementa tu rutina
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug} className="flex">
                <ProductCard product={r} className="w-full" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-16">
        <Reviews product={product} />
      </div>
    </div>
  );
}
