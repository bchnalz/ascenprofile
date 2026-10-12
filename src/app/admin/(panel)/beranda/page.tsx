import Link from "next/link";
import { getHome } from "@/lib/data";
import { HomeEditor } from "@/components/admin/home-editor";

export default async function HomeContentPage() {
  const home = await getHome();
  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Konten beranda</h1>
        <Link href="/" target="_blank" className="text-sm font-semibold text-emerald hover:underline">
          Buka beranda
        </Link>
      </div>
      <p className="mt-1 text-muted">Perubahan tampil di website segera setelah disimpan.</p>
      <div className="mt-8">
        <HomeEditor initial={home} />
      </div>
    </div>
  );
}
