import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/site/post-card";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = { title: "Prestasi" };
export const revalidate = 60;

export default async function AchievementsPage() {
  const { posts } = await getPosts({ tag: "prestasi", limit: 48 });
  return (
    <>
      <PageHeader
        title="Prestasi"
        intro="Capaian akademik dan nonakademik siswa SMP Asa Cendekia di berbagai kejuaraan."
        crumbs={[{ label: "Prestasi" }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-muted">Belum ada berita prestasi. Tambahkan tag “prestasi” pada artikel agar tampil di sini.</p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
