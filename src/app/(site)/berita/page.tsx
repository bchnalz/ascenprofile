import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/site/post-card";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = { title: "Berita" };
export const revalidate = 60;

const PER_PAGE = 9;

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ halaman?: string; tag?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.halaman) || 1);
  const tag = sp.tag || undefined;
  const { posts, total } = await getPosts({ limit: PER_PAGE, page, tag });
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const qs = (p: number) => `/berita?${new URLSearchParams({ ...(tag ? { tag } : {}), halaman: String(p) })}`;

  return (
    <>
      <PageHeader
        title={tag ? `Berita: ${tag}` : "Berita & kegiatan"}
        intro="Kabar terbaru tentang kegiatan, prestasi, dan kehidupan sekolah."
        crumbs={[{ label: "Berita" }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {tag && (
          <Link href="/berita" className="mb-10 inline-block text-sm font-semibold text-emerald hover:underline">
            Tampilkan semua berita
          </Link>
        )}
        {posts.length === 0 ? (
          <p className="text-muted">Belum ada berita yang diterbitkan.</p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Halaman berita" className="mt-16 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={qs(p)}
                aria-current={p === page ? "page" : undefined}
                className={`flex size-11 items-center justify-center rounded-full border font-semibold ${
                  p === page ? "border-emerald bg-emerald text-on-emerald" : "border-line hover:border-emerald"
                }`}
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </section>
    </>
  );
}
