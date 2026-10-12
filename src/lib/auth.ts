import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

/**
 * Pastikan pengguna login dan terdaftar di tabel admins.
 * Dibungkus `cache()` agar layout dan halaman dalam satu permintaan berbagi satu
 * pemeriksaan — bukan memanggil Supabase berulang kali.
 */
export const requireAdmin = cache(async () => {
  if (!isSupabaseConfigured) redirect("/admin/login?error=config");
  const supabase = await createSessionClient();

  // getClaims memverifikasi token secara lokal bila proyek memakai JWT signing keys,
  // sehingga tidak perlu bolak-balik ke server Auth.
  const [{ data: claimsData }, { data: isAdmin }] = await Promise.all([supabase.auth.getClaims(), supabase.rpc("is_admin")]);
  const claims = claimsData?.claims;
  if (!claims?.sub) redirect("/admin/login");
  if (!isAdmin) redirect("/admin/login?error=forbidden");

  return { supabase, user: { id: claims.sub as string, email: (claims.email as string | undefined) ?? "" } };
});
