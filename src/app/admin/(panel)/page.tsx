import Link from "next/link";
import { FileText, Home, Megaphone, Phone, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const [{ count: published }, { count: drafts }, { data: recent }] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("id, title, status, updated_at").order("updated_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Ringkasan</h1>
        <Link href="/admin/artikel/baru" className="btn-primary">
          <Plus className="size-4" />
          Tulis artikel
        </Link>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="panel">
          <dt className="text-sm text-muted">Artikel terbit</dt>
          <dd className="mt-1 text-3xl font-extrabold">{published ?? 0}</dd>
        </div>
        <div className="panel">
          <dt className="text-sm text-muted">Draf</dt>
          <dd className="mt-1 text-3xl font-extrabold">{drafts ?? 0}</dd>
        </div>
      </dl>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { href: "/admin/beranda", icon: Home, title: "Konten beranda", text: "Hero, sambutan, keunggulan, video, testimoni, dan logo mitra." },
          { href: "/admin/artikel", icon: FileText, title: "Artikel", text: "Tulis, sunting, terbitkan, atau hapus berita." },
          { href: "/admin/promo", icon: Megaphone, title: "Popup promo", text: "Unggah iklan/pengumuman 1080×1350 px yang muncul saat website dibuka." },
          { href: "/admin/kontak", icon: Phone, title: "Kontak & identitas", text: "Logo, alamat, nomor telepon, peta, dan media sosial." },
        ].map(({ href, icon: Icon, title, text }) => (
          <Link key={href} href={href} className="panel transition-colors hover:border-emerald">
            <Icon className="size-5 text-emerald" />
            <p className="mt-3 font-bold">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 font-bold">Terakhir diubah</h2>
      <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
        {(recent ?? []).length === 0 && <li className="p-4 text-sm text-muted">Belum ada artikel. Mulai dengan menulis artikel pertama.</li>}
        {(recent ?? []).map((p) => (
          <li key={p.id}>
            <Link href={`/admin/artikel/${p.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-sunken">
              <span className="truncate font-medium">{p.title}</span>
              <span className="shrink-0 text-sm text-muted">
                {p.status === "draft" ? "Draf · " : ""}
                {formatDate(p.updated_at)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
