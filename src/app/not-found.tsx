import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center px-6">
      <p className="font-arabic text-5xl text-brass">٤٠٤</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-muted">Alamat yang Anda buka mungkin sudah dipindahkan atau dihapus.</p>
      <Link href="/" className="mt-8 rounded-full bg-emerald px-6 py-3 font-semibold text-on-emerald">
        Kembali ke beranda
      </Link>
    </main>
  );
}
