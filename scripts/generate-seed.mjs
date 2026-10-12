// Membuat supabase/seed.sql dari src/content/*.json.
// Jalankan: node scripts/generate-seed.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(join(root, "src/content", f), "utf8"));
const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (a) => `array[${a.map(q).join(", ")}]::text[]`;

const home = read("home.json");
const contact = read("contact.json");
const posts = read("posts.json");

let sql = `-- Konten awal SMP Asa Cendekia (dibuat otomatis oleh scripts/generate-seed.mjs).
-- Aman dijalankan ulang: konten yang sudah ada TIDAK ditimpa.

insert into public.site_settings (key, value) values
  ('home', ${q(JSON.stringify(home))}::jsonb),
  ('contact', ${q(JSON.stringify(contact))}::jsonb)
on conflict (key) do nothing;

insert into public.posts (slug, title, excerpt, content, cover_url, tags, status, published_at) values
`;

sql += posts
  .map((p) => `  (${q(p.slug)}, ${q(p.title)}, ${q(p.excerpt)}, ${q(p.content)}, ${q(p.cover_url)}, ${arr(p.tags)}, 'published', ${q(p.published_at)})`)
  .join(",\n");
sql += "\non conflict (slug) do nothing;\n";

writeFileSync(join(root, "supabase/seed.sql"), sql);
console.log(`supabase/seed.sql ditulis (${posts.length} artikel).`);
