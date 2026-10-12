"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";

const errors: Record<string, string> = {
  forbidden: "Akun ini belum terdaftar sebagai admin. Tambahkan user ID-nya ke tabel admins di Supabase.",
  config: "Supabase belum dikonfigurasi di environment variables.",
};

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(errors[params.get("error") ?? ""] ?? "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await getBrowserClient().auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Email atau kata sandi salah." : error.message);
      setBusy(false);
      return;
    }
    const next = params.get("next");
    router.replace(next && next.startsWith("/admin") && next !== "/admin/login" ? next : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1.5" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Kata sandi</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mt-1.5"
        />
      </label>
      {error && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
