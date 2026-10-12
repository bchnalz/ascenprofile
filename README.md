# Website SMP Asa Cendekia Sedati

Website profil sekolah (Next.js 15 + Supabase) dengan mode gelap/terang dan panel admin untuk mengedit beranda serta mengelola artikel.

## Fitur

- **Halaman publik**: beranda, sejarah, visi & misi, struktur organisasi, fasilitas, 14 ekstrakurikuler, prestasi, berita (dengan tag & halaman), kontak + peta.
- **Mode gelap/terang** otomatis mengikuti perangkat, bisa diganti lewat tombol di header.
- **Panel admin** (`/admin`):
  - *Konten beranda* — hero, nilai sekolah, sambutan, selayang pandang, keunggulan, video, testimoni, logo mitra, ajakan SPMB.
  - *Artikel* — tulis/sunting dengan editor teks kaya, unggah gambar, sampul, tag, draf/terbit, jadwal tanggal, hapus.
  - *Kontak & identitas* — logo, alamat, telepon, WhatsApp, peta, media sosial.
- Tautan lama WordPress (mis. `/sejarah-sekolah/`, `/pramuka/`, slug artikel lama) dialihkan otomatis ke alamat baru.
- Website tetap tampil walau Supabase belum disetel (memakai konten bawaan di `src/content`).

## Setup

### 1. Supabase
1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan isi `supabase/schema.sql`, lalu `supabase/seed.sql`.
3. **Authentication → Users → Add user**: buat akun admin (email + password, centang *Auto confirm*).
4. Jadikan akun itu admin (SQL Editor):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'email-admin@contoh.com';
   ```

### 2. Vercel
1. Import repo ini di Vercel (framework terdeteksi otomatis: Next.js).
2. Tambahkan Environment Variables dari `.env.example`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
3. Deploy. Masuk ke `https://domain-anda/admin`.

### 3. Migrasi penuh dari website lama (disarankan)
Seed berisi ringkasan 11 artikel lama. Untuk menyalin **isi artikel lengkap dan semua gambar** ke Supabase (agar tidak bergantung pada server WordPress lama), jalankan sekali di komputer Anda:

```bash
npm install
SUPABASE_URL=https://xxxx.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ... \
npm run migrate:wp
```

Lalu set `NEXT_PUBLIC_MEDIA_MIGRATED=1` di Vercel dan redeploy. Lakukan ini **sebelum** domain dipindahkan dari WordPress ke Vercel.

Service role key ada di Supabase → Project Settings → API. Jangan pernah memasangnya di Vercel atau membagikannya.

## Pengembangan lokal

```bash
cp .env.example .env.local   # isi kredensial Supabase
npm install
npm run dev
```

## Struktur

```
src/app/(site)/          halaman publik
src/app/admin/           login + panel admin, server actions
src/components/          komponen situs & admin
src/content/             konten bawaan (beranda, kontak, profil, ekskul, artikel awal)
supabase/                schema.sql, seed.sql
scripts/                 generate-seed.mjs, migrate-from-wordpress.mjs
```

Konten halaman profil & ekstrakurikuler ada di `src/content/profile.ts`.
