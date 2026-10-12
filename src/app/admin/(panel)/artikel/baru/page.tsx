import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";

export default function NewArticle() {
  return (
    <div className="max-w-6xl">
      <Link href="/admin/artikel" className="text-sm text-muted hover:text-emerald">
        Kembali ke daftar artikel
      </Link>
      <div className="mt-4">
        <PostForm />
      </div>
    </div>
  );
}
