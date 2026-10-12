import "server-only";
import seedPosts from "@/content/posts.json";
import promoDefaults from "@/content/promo.json";
import type { PromoSettings } from "./promo";
import { createPublicClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import { contactDefaults, homeDefaults, type ContactInfo, type HomeContent, type Post, type PostSummary } from "./types";

/** Gabungkan nilai tersimpan dengan default agar field baru tidak pernah kosong. */
function merge<T>(defaults: T, stored: unknown): T {
  if (stored === null || stored === undefined) return defaults;
  if (Array.isArray(defaults)) return (Array.isArray(stored) ? stored : defaults) as T;
  if (typeof defaults === "object" && defaults !== null) {
    if (typeof stored !== "object" || Array.isArray(stored)) return defaults;
    const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
    for (const key of Object.keys(out)) {
      out[key] = merge(out[key], (stored as Record<string, unknown>)[key]);
    }
    return out as T;
  }
  return (typeof stored === typeof defaults ? stored : defaults) as T;
}

async function getSetting<T>(key: string, defaults: T): Promise<T> {
  if (!isSupabaseConfigured) return defaults;
  try {
    const { data, error } = await createPublicClient().from("site_settings").select("value").eq("key", key).maybeSingle();
    if (error || !data) return defaults;
    return merge(defaults, data.value);
  } catch {
    return defaults;
  }
}

export const getHome = () => getSetting<HomeContent>("home", homeDefaults);
export const getContact = () => getSetting<ContactInfo>("contact", contactDefaults);
export const getPromo = () => getSetting<PromoSettings>("promo", promoDefaults as PromoSettings);

// ---------- Artikel ----------

const fallbackPosts: Post[] = seedPosts.map((p, i) => ({
  ...p,
  id: `seed-${i}`,
  status: "published" as const,
  created_at: p.published_at,
  updated_at: p.published_at,
}));

const SUMMARY_FIELDS = "id, slug, title, excerpt, cover_url, tags, published_at";

export async function getPosts(opts: { limit?: number; tag?: string; page?: number } = {}): Promise<{ posts: PostSummary[]; total: number }> {
  const limit = opts.limit ?? 12;
  const page = Math.max(1, opts.page ?? 1);
  const from = (page - 1) * limit;

  if (!isSupabaseConfigured) {
    const list = opts.tag ? fallbackPosts.filter((p) => p.tags.includes(opts.tag!)) : fallbackPosts;
    return { posts: list.slice(from, from + limit), total: list.length };
  }

  try {
    let q = createPublicClient()
      .from("posts")
      .select(SUMMARY_FIELDS, { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(from, from + limit - 1);
    if (opts.tag) q = q.contains("tags", [opts.tag]);
    const { data, count, error } = await q;
    if (error) throw error;
    return { posts: (data ?? []) as PostSummary[], total: count ?? 0 };
  } catch {
    return { posts: [], total: 0 };
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) return fallbackPosts.find((p) => p.slug === slug) ?? null;
  try {
    const { data } = await createPublicClient().from("posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
    return (data as Post) ?? null;
  } catch {
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) return fallbackPosts.map((p) => p.slug);
  try {
    const { data } = await createPublicClient().from("posts").select("slug").eq("status", "published");
    return (data ?? []).map((r: { slug: string }) => r.slug);
  } catch {
    return [];
  }
}
