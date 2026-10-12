import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { PostForm } from "@/components/admin/post-form";

export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!post) notFound();

  return (
    <div className="max-w-6xl">
      <Link href="/admin/artikel" className="text-sm text-muted hover:text-emerald">
        Kembali ke daftar artikel
      </Link>
      <div className="mt-4">
        <PostForm
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content,
            cover_url: post.cover_url ?? "",
            tags: post.tags ?? [],
            status: post.status,
            published_at: post.published_at,
          }}
        />
      </div>
    </div>
  );
}
