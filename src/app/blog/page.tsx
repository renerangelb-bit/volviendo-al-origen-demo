import type { Metadata } from 'next';
import { POSTS } from '@/data/blog';
import { BlogIndex } from '@/components/blog/BlogIndex';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Guías de uso, rutinas, ingredientes y la historia de Volviendo al Origen.',
};

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="page pt-10 pb-20">
      <h1 className="text-4xl font-semibold tracking-[-0.02em] text-raiz md:text-5xl">Blog</h1>
      <p className="mt-3 max-w-xl text-lg text-corteza">Rutinas, ingredientes y las historias detrás de lo que hacemos.</p>
      <div className="mt-8">
        <BlogIndex posts={posts} />
      </div>
    </div>
  );
}
