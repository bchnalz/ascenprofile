import { SUPABASE_URL } from "./supabase/env";

const LEGACY_UPLOADS = "https://smpasacendekia.sch.id/wp-content/uploads";

/**
 * Basis URL gambar bawaan halaman profil/ekskul.
 * Setelah scripts/migrate-from-wordpress.mjs dijalankan dan NEXT_PUBLIC_MEDIA_MIGRATED=1,
 * gambar dimuat dari Supabase Storage (folder media/wp) — tidak lagi bergantung pada server lama.
 */
export const LEGACY_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_MIGRATED === "1" && SUPABASE_URL ? `${SUPABASE_URL}/storage/v1/object/public/media/wp` : LEGACY_UPLOADS;
