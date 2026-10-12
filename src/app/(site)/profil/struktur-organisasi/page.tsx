import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { orgChart } from "@/content/profile";

export const metadata: Metadata = { title: "Struktur organisasi" };

export default function OrgPage() {
  return (
    <>
      <PageHeader title="Struktur organisasi" intro="Susunan pimpinan dan pengelola SMP Asa Cendekia Sedati." crumbs={[{ label: "Profil" }, { label: "Struktur organisasi" }]} />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <a href={orgChart.image} className="block overflow-hidden rounded-[22px] border border-line bg-white p-3 sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={orgChart.imageFallback} alt="Bagan struktur organisasi SMP Asa Cendekia Sedati" className="w-full" />
        </a>
        <p className="mt-4 text-sm text-muted">Ketuk gambar untuk melihat ukuran penuh.</p>
      </section>
    </>
  );
}
