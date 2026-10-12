// =============================================================
// Migrasi penuh dari website WordPress lama ke Supabase.
//
// Yang dilakukan:
//   1. Mengambil SEMUA artikel (isi lengkap, tag, tanggal) lewat WordPress REST API.
//   2. Mengunduh semua gambar (sampul + gambar di dalam artikel + gambar profil/ekskul/logo)
//      lalu mengunggahnya ke Supabase Storage (bucket "media", folder "wp/").
//   3. Mengganti URL gambar lama dengan URL Supabase, lalu menyimpan artikel ke tabel posts.
//   4. Mengganti URL gambar lama di konten beranda & kontak (site_settings).
//
// Cara menjalankan (di komputer Anda, bukan di Vercel):
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   node scripts/migrate-from-wordpress.mjs
//
// Opsi:
//   --keep-existing   jangan timpa artikel yang slug-nya sudah ada
//   --dry-run         tampilkan apa yang akan dilakukan tanpa menulis apa pun
//
// Setelah selesai, set env NEXT_PUBLIC_MEDIA_MIGRATED=1 di Vercel agar gambar
// halaman profil/ekstrakurikuler juga dimuat dari Supabase.
// =============================================================
import { createClient } from "@supabase/supabase-js";

const WP = (process.env.WP_URL ?? "https://smpasacendekia.sch.id").replace(/\/$/, "");
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY = process.argv.includes("--dry-run");
const KEEP = process.argv.includes("--keep-existing");

if (!SUPABASE_URL || !KEY) {
  console.error("Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY terlebih dahulu.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, KEY, { auth: { persistSession: false } });
const UPLOADS = `${WP}/wp-content/uploads/`;
const uploadsRe = new RegExp(`${UPLOADS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"'\\s)<>]+`, "g");

// Gambar statis yang dipakai halaman profil, ekskul, beranda, dan logo.
const STATIC_ASSETS = [
  "2024/08/SMP-1.png",
  "2024/08/SMP.png",
  "2024/08/smpasa.png",
  "2024/08/Logo-Asa50x60Transparan.png",
  "2024/08/kurkum-1.png",
  "2024/08/merdeka-belajar.png",
  "2024/08/kemenag.png",
  "2024/08/83790f2b43f00be.png",
  "2024/08/mosque.png",
  "2024/08/heroes.png",
  "2024/08/education.png",
  "2024/08/Tech.png",
  "2024/09/Struktur-Baru-01-1.jpg",
  "2024/09/Struktur-Baru-01-1-1024x749.jpg",
  "2025/08/nihongo-1x1-1.jpg",
  "2025/08/nihongo-1x1-2.jpg",
  "2025/08/Kostum-Jepang.jpg",
  "2025/08/english-club.jpg",
  "2024/08/fotogarfi.jpg",
  "2024/08/lomba-hari-pertama.jpg",
  "2024/08/Snapinsta.app_451562568_1229916821330231_1929101970734202885_n_1080.jpg",
];

/** Kunci storage yang aman (tanpa emoji/spasi). Harus sama dengan src/lib/media.ts. */
const storageKey = (relPath) =>
  "wp/" +
  decodeURIComponent(relPath)
    .normalize("NFKD")
    .replace(/[^\w./-]+/g, "-")
    .replace(/-+/g, "-");

const publicUrl = (key) => `${SUPABASE_URL}/storage/v1/object/public/media/${key}`;
const copied = new Map(); // URL lama → URL baru

async function copyAsset(oldUrl) {
  if (copied.has(oldUrl)) return copied.get(oldUrl);
  const rel = oldUrl.slice(UPLOADS.length).split(/[?#]/)[0];
  const key = storageKey(rel);
  const newUrl = publicUrl(key);
  if (DRY) {
    copied.set(oldUrl, newUrl);
    return newUrl;
  }
  try {
    const res = await fetch(encodeURI(decodeURI(oldUrl)));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = Buffer.from(await res.arrayBuffer());
    const { error } = await supabase.storage.from("media").upload(key, body, {
      contentType: res.headers.get("content-type") ?? undefined,
      cacheControl: "31536000",
      upsert: true,
    });
    if (error) throw error;
    copied.set(oldUrl, newUrl);
    process.stdout.write(".");
    return newUrl;
  } catch (e) {
    console.warn(`\n  ! Gagal menyalin ${oldUrl}: ${e.message}`);
    copied.set(oldUrl, oldUrl);
    return oldUrl;
  }
}

async function rewriteUrls(text) {
  const urls = [...new Set(text.match(uploadsRe) ?? [])];
  for (const u of urls) await copyAsset(u);
  return text.replace(uploadsRe, (u) => copied.get(u) ?? u);
}

function cleanWpHtml(html) {
  return html
    .replace(/\s(srcset|sizes|decoding|fetchpriority|data-[\w-]+)="[^"]*"/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\sclass="wp-[^"]*"/g, "")
    .trim();
}

const stripTags = (s) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\[&hellip;\]|&hellip;/g, "…")
    .replace(/\s+/g, " ")
    .trim();

async function fetchAllPosts() {
  const all = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${WP}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed`);
    if (!res.ok) {
      if (page > 1 && res.status === 400) break;
      throw new Error(`Gagal mengambil artikel (HTTP ${res.status})`);
    }
    const batch = await res.json();
    all.push(...batch);
    const totalPages = Number(res.headers.get("x-wp-totalpages") ?? 1);
    if (page >= totalPages) break;
  }
  return all;
}

async function main() {
  console.log(`Sumber: ${WP}${DRY ? "  (dry run)" : ""}`);

  // 1. Aset statis
  console.log(`\n[1/3] Menyalin ${STATIC_ASSETS.length} gambar profil & logo`);
  for (const rel of STATIC_ASSETS) await copyAsset(UPLOADS + rel);

  // 2. Artikel
  const posts = await fetchAllPosts();
  console.log(`\n\n[2/3] Memigrasikan ${posts.length} artikel`);
  let existing = new Set();
  if (KEEP) {
    const { data } = await supabase.from("posts").select("slug");
    existing = new Set((data ?? []).map((r) => r.slug));
  }

  for (const p of posts) {
    const slug = decodeURIComponent(p.slug);
    if (KEEP && existing.has(slug)) {
      console.log(`  - lewati (sudah ada): ${slug}`);
      continue;
    }
    const featured = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
    const tags = (p._embedded?.["wp:term"] ?? []).flat().filter((t) => t.taxonomy === "post_tag" || t.taxonomy === "category").map((t) => stripTags(t.name));
    const content = await rewriteUrls(cleanWpHtml(p.content?.rendered ?? ""));
    const cover = featured ? await copyAsset(featured) : null;

    const row = {
      slug,
      title: stripTags(p.title?.rendered ?? slug),
      excerpt: stripTags(p.excerpt?.rendered ?? "").slice(0, 300) || null,
      content,
      cover_url: cover,
      tags: [...new Set(tags.filter((t) => t && t.toLowerCase() !== "uncategorized"))],
      status: p.status === "publish" ? "published" : "draft",
      published_at: new Date(p.date_gmt ? `${p.date_gmt}Z` : p.date).toISOString(),
    };

    if (DRY) {
      console.log(`\n  ~ ${row.title}`);
      continue;
    }
    const { error } = await supabase.from("posts").upsert(row, { onConflict: "slug" });
    if (error) console.warn(`\n  ! ${slug}: ${error.message}`);
    else console.log(`\n  ✓ ${row.title}`);
  }

  // 3. Konten beranda & kontak
  console.log("\n[3/3] Memperbarui URL gambar di konten beranda & kontak");
  const { data: settings } = await supabase.from("site_settings").select("key, value");
  for (const s of settings ?? []) {
    const before = JSON.stringify(s.value);
    const after = await rewriteUrls(before);
    if (after !== before && !DRY) {
      const { error } = await supabase.from("site_settings").update({ value: JSON.parse(after) }).eq("key", s.key);
      console.log(error ? `  ! ${s.key}: ${error.message}` : `  ✓ ${s.key}`);
    }
  }

  const failed = [...copied.entries()].filter(([a, b]) => a === b).length;
  console.log(`\nSelesai. ${copied.size - failed} gambar disalin${failed ? `, ${failed} gagal` : ""}.`);
  console.log("Langkah terakhir: set NEXT_PUBLIC_MEDIA_MIGRATED=1 di Vercel lalu redeploy.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
