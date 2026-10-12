import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Masuk admin", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">Panel admin</h1>
        <p className="mt-1 text-muted">SMP Asa Cendekia Sedati</p>
        {isSupabaseConfigured ? (
          <Suspense>
            <LoginForm />
          </Suspense>
        ) : (
          <p className="mt-8 rounded-2xl border border-brass/40 bg-brass-soft p-4 text-sm leading-relaxed">
            Supabase belum dikonfigurasi. Isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di environment variables Vercel,
            lalu deploy ulang.
          </p>
        )}
      </div>
    </main>
  );
}
