-- =============================================================
-- SMP Asa Cendekia — skema database Supabase
-- Jalankan sekali di Supabase Dashboard → SQL Editor.
-- Setelah itu jalankan supabase/seed.sql untuk mengisi konten awal.
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- Admin ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admin can read own row" on public.admins;
create policy "admin can read own row" on public.admins
  for select using (user_id = auth.uid());

-- ---------- Pengaturan situs (konten beranda, kontak) ----------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings are public" on public.site_settings;
create policy "settings are public" on public.site_settings
  for select using (true);

drop policy if exists "admins manage settings" on public.site_settings;
create policy "admins manage settings" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Artikel / berita ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx on public.posts (status, published_at desc);
create index if not exists posts_tags_idx on public.posts using gin (tags);

alter table public.posts enable row level security;

drop policy if exists "published posts are public" on public.posts;
create policy "published posts are public" on public.posts
  for select using (status = 'published' or public.is_admin());

drop policy if exists "admins manage posts" on public.posts;
create policy "admins manage posts" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.site_settings;
create trigger settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ---------- Storage: bucket gambar ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media is public" on storage.objects;
create policy "media is public" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ---------- Menjadikan akun sebagai admin ----------
-- 1. Buat user di Authentication → Users → Add user (email + password).
-- 2. Jalankan (ganti email):
--    insert into public.admins (user_id)
--    select id from auth.users where email = 'admin@sekolah.sch.id'
--    on conflict do nothing;
