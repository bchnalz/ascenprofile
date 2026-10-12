import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostSlugs, getPost, getPosts } from "@/lib/data";
import { cleanHtml, formatDate, readingTime } from "@/lib/format";
import { StarMark } from "@/components/site/icons";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(decodeURIComponent(slug));
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined, images: post.cover_url ? [post.cover_url] : [], type: "article" },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(decodeURIComponent(slug));
  if (!post) notFound();
  const { posts: latest } = await getPosts({ limit: 4 });
  const related = latest.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      <header className="mx-auto max-w-4xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
        <nav aria-label="Jejak halaman" className="flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-emerald">
            Beranda
          </Link>
          <StarMark className="size-2.5 text-brass" />
          <Link href="/berita" className="hover:text-emerald">
            Berita
          </Link>
        </nav>
        <h1 className="mt-6 text-3xl font-extrabold leading-[1.12] tracking-[-0.025em] text-balance sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-muted">
          <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>, {readingTime(post.content)} menit baca
        </p>
      </header>

      {post.cover_url && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_url} alt="" className="max-h-[620px] w-full rounded-[22px] bg-sunken object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="prose-asa mx-auto" dangerouslySetInnerHTML={{ __html: cleanHtml(post.content) }} />
        {post.tags.length > 0 && (
          <ul className="mx-auto mt-12 flex max-w-[68ch] flex-wrap gap-2 border-t border-line pt-6">
            {post.tags.map((t) => (
              <li key={t}>
                <Link href={`/berita?tag=${encodeURIComponent(t)}`} className="inline-block rounded-full bg-emerald-soft px-3.5 py-1.5 text-sm hover:text-emerald">
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {related.length > 0 && (
        <aside className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Berita lainnya</h2>
            <ul className="mt-8 grid gap-8 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.id} className="group relative">
                  {p.cover_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover_url} alt="" loading="lazy" className="aspect-[3/2] w-full rounded-2xl object-cover" />
                  )}
                  <time className="mt-4 block text-sm text-muted">{formatDate(p.published_at)}</time>
                  <h3 className="mt-1 font-bold leading-snug group-hover:text-emerald">
                    <Link href={`/berita/${p.slug}`} className="after:absolute after:inset-0">
                      {p.title}
                    </Link>
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </article>
  );
}
