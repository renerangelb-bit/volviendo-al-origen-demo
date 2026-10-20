'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BLOG_CATEGORIES, type BlogPost } from '@/data/blog';
import { formatDay } from '@/lib/format';
import { cn } from '@/lib/cn';

function PostCard({ post, large = false }: { post: BlogPost; large?: boolean }) {
  return (
    <article className={cn('group relative flex flex-col', large && 'md:grid md:grid-cols-[1.3fr_1fr] md:items-center md:gap-10')}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-lino">
        <Image src={post.cover} alt="" fill sizes={large ? '(min-width: 768px) 56vw, 100vw' : '(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw'} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className={cn('pt-4', large && 'md:pt-0')}>
        <p className="text-xs text-humo">
          <span className="font-semibold text-barro">{post.category}</span> · {formatDay(post.date)} · {post.minutes} min de lectura
        </p>
        <h2 className={cn('mt-2 font-semibold text-raiz', large ? 'text-2xl leading-tight md:text-3xl' : 'text-lg leading-snug')}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 hover:underline hover:underline-offset-4">
            {post.title}
          </Link>
        </h2>
        <p className={cn('mt-2 text-sm leading-relaxed text-corteza', large && 'md:text-base')}>{post.excerpt}</p>
      </div>
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [cat, setCat] = useState<string>('Todas');
  const list = cat === 'Todas' ? posts : posts.filter((p) => p.category === cat);
  const [first, ...rest] = list;
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        {['Todas', ...BLOG_CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cn('rounded-full border px-4 py-2 text-sm transition-colors', cat === c ? 'border-raiz bg-raiz text-hueso' : 'border-linea bg-white text-raiz hover:border-raiz')}
          >
            {c}
          </button>
        ))}
      </div>
      {first && (
        <div className="mt-10">
          <PostCard post={first} large />
        </div>
      )}
      {rest.length > 0 && (
        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
