import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";

const PER_PAGE = 20;

export default async function ArticlesAdmin({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; halaman?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.halaman) || 1);
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("posts")
    .select("id, title, slug, status, published_at, updated_at, cover_url, tags", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  if (sp.q) query = query.ilike("title", `%${sp.q}%`);
  if (sp.status === "draft" || sp.status === "published") query = query.eq("status", sp.status);
  const { data: posts, count, error } = await query;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PER_PAGE));

  const filterHref = (status?: string) => `/admin/artikel?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), ...(status ? { status } : {}) })}`;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Artikel</h1>
        <Link href="/admin/artikel/baru" className="btn-primary">
          <Plus className="size-4" />
          Tulis artikel
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={sp.q} placeholder="Cari judul…" className="input pl-10" />
          {sp.status && <input type="hidden" name="status" value={sp.status} />}
        </form>
        <div className="flex gap-1 rounded-full border border-line p-1 text-sm">
          {[
            [undefined, "Semua"],
            ["published", "Terbit"],
            ["draft", "Draf"],
          ].map(([v, label]) => (
            <Link key={label} href={filterHref(v)} className={`rounded-full px-3.5 py-1.5 font-medium ${sp.status === v ? "bg-emerald text-on-emerald" : "hover:bg-sunken"}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">Gagal memuat artikel: {error.message}</p>}

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {(posts ?? []).length === 0 && !error && (
          <li className="p-8 text-center text-muted">
            {sp.q ? "Tidak ada artikel yang cocok dengan pencarian." : "Belum ada artikel. Klik “Tulis artikel” untuk memulai."}
          </li>
        )}
        {(posts ?? []).map((p) => (
          <li key={p.id}>
            <Link href={`/admin/artikel/${p.id}`} className="flex items-center gap-4 p-3 hover:bg-sunken sm:p-4">
              <span className="size-14 shrink-0 overflow-hidden rounded-lg bg-sunken">
                {p.cover_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover_url} alt="" className="size-full object-cover" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 font-semibold leading-snug">{p.title}</span>
                <span className="mt-1 block text-sm text-muted">
                  {p.status === "published" ? `Terbit ${formatDate(p.published_at)}` : `Draf, diubah ${formatDate(p.updated_at)}`}
                </span>
              </span>
              <span
                className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold sm:inline ${
                  p.status === "published" ? "bg-emerald-soft text-emerald" : "bg-brass-soft text-brass"
                }`}
              >
                {p.status === "published" ? "Terbit" : "Draf"}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Halaman">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/admin/artikel?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), ...(sp.status ? { status: sp.status } : {}), halaman: String(n) })}`}
              className={`flex size-9 items-center justify-center rounded-full border text-sm font-semibold ${n === page ? "border-emerald bg-emerald text-on-emerald" : "border-line"}`}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
