import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

/** Pastikan pengguna login dan terdaftar di tabel admins. */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/login?error=config");
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=forbidden");

  return { supabase, user };
}
