"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { cleanHtml, slugify } from "@/lib/format";
import type { ContactInfo, HomeContent } from "@/lib/types";
import { createSessionClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true; message: string; id?: string } | { ok: false; message: string };

function refreshPublic() {
  revalidatePath("/", "layout");
}

export async function saveSetting(key: "home" | "contact", value: HomeContent | ContactInfo): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("site_settings").upsert({ key, value });
  if (error) return { ok: false, message: `Gagal menyimpan: ${error.message}` };
  refreshPublic();
  return { ok: true, message: "Perubahan disimpan dan sudah tampil di website." };
}

export type PostInput = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
};

export async function savePost(input: PostInput): Promise<ActionResult> {
  const { supabase, user } = await requireAdmin();
  const title = input.title.trim();
  if (!title) return { ok: false, message: "Judul wajib diisi." };
  const slug = slugify(input.slug || title);
  if (!slug) return { ok: false, message: "Slug tidak valid. Gunakan huruf dan angka." };

  const row = {
    title,
    slug,
    excerpt: input.excerpt.trim() || null,
    content: cleanHtml(input.content),
    cover_url: input.cover_url.trim() || null,
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    status: input.status,
    published_at: input.status === "published" ? input.published_at || new Date().toISOString() : input.published_at,
  };

  const query = input.id
    ? supabase.from("posts").update(row).eq("id", input.id).select("id").single()
    : supabase.from("posts").insert({ ...row, author_id: user.id }).select("id").single();

  const { data, error } = await query;
  if (error) {
    if (error.code === "23505") return { ok: false, message: "Slug sudah dipakai artikel lain. Ubah slug lalu simpan lagi." };
    return { ok: false, message: `Gagal menyimpan: ${error.message}` };
  }
  refreshPublic();
  return {
    ok: true,
    id: data.id,
    message: row.status === "published" ? "Artikel diterbitkan." : "Draf disimpan.",
  };
}

export async function deletePost(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, message: `Gagal menghapus: ${error.message}` };
  refreshPublic();
  return { ok: true, message: "Artikel dihapus." };
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
