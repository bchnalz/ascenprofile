"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink, Save, Send, Trash2 } from "lucide-react";
import { deletePost, savePost, type ActionResult, type PostInput } from "@/app/admin/actions";
import { slugify } from "@/lib/format";
import { Field, ImageField, Notice, TextArea } from "./fields";
import dynamic from "next/dynamic";

// Editor teks kaya cukup besar — dimuat terpisah agar halaman artikel terbuka lebih cepat.
const RichText = dynamic(() => import("./rich-text").then((m) => m.RichText), {
  ssr: false,
  loading: () => <div className="h-[420px] animate-pulse rounded-xl border border-line bg-sunken" />,
});

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostForm({ initial }: { initial?: PostInput & { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<PostInput>(
    initial ?? { title: "", slug: "", excerpt: "", content: "", cover_url: "", tags: [], status: "draft", published_at: null },
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [tagText, setTagText] = useState((initial?.tags ?? []).join(", "));
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  const set = (patch: Partial<PostInput>) => {
    setResult(null);
    setPost((p) => ({ ...p, ...patch }));
  };

  function submit(status: "draft" | "published") {
    start(async () => {
      const r = await savePost({ ...post, status, tags: tagText.split(",") });
      setResult(r);
      if (r.ok) {
        setPost((p) => ({ ...p, status, id: r.id }));
        if (!initial && r.id) router.replace(`/admin/artikel/${r.id}`);
        else router.refresh();
      }
    });
  }

  function remove() {
    if (!initial || !confirm(`Hapus artikel “${post.title}”? Tindakan ini tidak bisa dibatalkan.`)) return;
    start(async () => {
      const r = await deletePost(initial.id);
      if (r.ok) router.replace("/admin/artikel");
      else setResult(r);
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-5">
        <div>
          <label htmlFor="title" className="sr-only">
            Judul
          </label>
          <input
            id="title"
            value={post.title}
            onChange={(e) => set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })}
            placeholder="Judul artikel"
            className="w-full border-0 bg-transparent text-3xl font-extrabold tracking-tight outline-none placeholder:text-muted/50"
          />
        </div>
        <RichText value={post.content} onChange={(content) => set({ content })} />
      </div>

      <aside className="space-y-5">
        <div className="panel space-y-3">
          <p className="text-sm">
            Status:{" "}
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.status === "published" ? "bg-emerald-soft text-emerald" : "bg-brass-soft text-brass"}`}>
              {post.status === "published" ? "Terbit" : "Draf"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary flex-1" disabled={pending} onClick={() => submit("published")}>
              <Send className="size-4" />
              {post.status === "published" ? "Perbarui" : "Terbitkan"}
            </button>
            <button type="button" className="btn-ghost flex-1" disabled={pending} onClick={() => submit("draft")}>
              <Save className="size-4" />
              {post.status === "published" ? "Jadikan draf" : "Simpan draf"}
            </button>
          </div>
          <Notice result={result} />
          {initial && post.status === "published" && (
            <a href={`/berita/${post.slug}`} target="_blank" className="flex items-center gap-1.5 text-sm font-semibold text-emerald hover:underline">
              <ExternalLink className="size-4" />
              Lihat di website
            </a>
          )}
        </div>

        <div className="panel space-y-4">
          <ImageField label="Gambar sampul" folder="articles" aspect="aspect-[3/2]" value={post.cover_url} onChange={(v) => set({ cover_url: v })} />
          <TextArea label="Ringkasan" rows={3} value={post.excerpt} onChange={(v) => set({ excerpt: v })} hint="Tampil di daftar berita dan pratinjau media sosial." />
          <Field
            label="Tag"
            value={tagText}
            onChange={(v) => {
              setResult(null);
              setTagText(v);
            }}
            hint="Pisahkan dengan koma. Tag “prestasi” membuat artikel tampil di halaman Prestasi."
          />
          <Field
            label="Slug (alamat)"
            value={post.slug}
            onChange={(v) => {
              setSlugTouched(true);
              set({ slug: v });
            }}
            hint={`/berita/${post.slug || "…"}`}
          />
          <Field
            label="Tanggal terbit"
            type="datetime-local"
            value={toLocalInput(post.published_at)}
            onChange={(v) => set({ published_at: v ? new Date(v).toISOString() : null })}
            hint="Kosongkan untuk memakai waktu saat diterbitkan."
          />
        </div>

        {initial && (
          <button type="button" className="btn-danger w-full" disabled={pending} onClick={remove}>
            <Trash2 className="size-4" />
            Hapus artikel
          </button>
        )}
      </aside>
    </div>
  );
}
