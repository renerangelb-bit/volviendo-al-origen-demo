import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POSTS, getPost } from '@/data/blog';
import { getProduct } from '@/data/products';
import type { Product } from '@/data/catalog-types';
import { formatDay } from '@/lib/format';
import { ProductCard } from '@/components/product/ProductCard';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Artículo no encontrado' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: 'article', title: post.title, description: post.excerpt, publishedTime: post.date, images: [{ url: post.cover, width: 1600, height: 900, alt: post.title }] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="pb-20">
      <header className="page max-w-3xl pt-10 text-center">
        <nav aria-label="Ruta de navegación" className="text-xs text-humo">
          <Link href="/blog" className="hover:text-raiz hover:underline">
            Blog
          </Link>{' '}
          / <span>{post.category}</span>
        </nav>
        <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.02em] text-raiz md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-humo">
          {formatDay(post.date)} · {post.minutes} min de lectura · Volviendo al Origen
        </p>
      </header>
      <div className="page mt-8 max-w-5xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-lino">
          <Image src={post.cover} alt="" fill preload sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="page prose-vao mt-10 max-w-2xl text-[1.0625rem] text-tinta">
        {post.body.map((b, i) => {
          switch (b.type) {
            case 'p':
              return <p key={i}>{b.text}</p>;
            case 'h2':
              return <h2 key={i}>{b.text}</h2>;
            case 'ul':
              return (
                <ul key={i}>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              );
            case 'ol':
              return (
                <ol key={i}>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ol>
              );
            case 'quote':
              return (
                <blockquote key={i} className="my-8 border-l-2 border-barro pl-5 text-xl leading-relaxed font-medium text-raiz">
                  {b.text}
                </blockquote>
              );
            case 'products': {
              const items = b.slugs.map(getProduct).filter(Boolean) as Product[];
              return (
                <aside key={i} className="not-prose my-10 rounded-xl bg-lino p-5" aria-label={b.title}>
                  <p className="mb-4 text-sm font-semibold text-raiz">{b.title}</p>
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {items.map((p) => (
                      <li key={p.slug} className="flex">
                        <ProductCard product={p} className="w-full" sizes="(min-width: 640px) 13rem, 45vw" />
                      </li>
                    ))}
                  </ul>
                </aside>
              );
            }
          }
        })}
      </div>

      <section className="page mt-16 border-t border-linea pt-12" aria-labelledby="mas">
        <h2 id="mas" className="section-title">
          Sigue leyendo
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {more.map((p) => (
            <li key={p.slug} className="group relative">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-lino">
                <Image src={p.cover} alt="" fill sizes="(min-width: 640px) 31vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-3 text-xs font-semibold text-barro">{p.category}</p>
              <Link href={`/blog/${p.slug}`} className="mt-1 block font-semibold text-raiz after:absolute after:inset-0 group-hover:underline">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
