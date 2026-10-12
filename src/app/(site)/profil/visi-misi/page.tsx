import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { missions, vision } from "@/content/profile";

export const metadata: Metadata = { title: "Visi & misi" };

export default function VisionPage() {
  return (
    <>
      <PageHeader title="Visi & misi" crumbs={[{ label: "Profil" }, { label: "Visi & misi" }]} />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-emerald-strong px-6 py-14 text-[#eef4f0] sm:px-14 dark:bg-surface dark:text-ink">
          <div className="girih pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
          <h2 className="relative text-sm font-semibold opacity-75">Visi</h2>
          <p className="relative mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-[2.6rem]">{vision}</p>
        </div>

        <h2 className="mt-20 text-3xl font-extrabold tracking-tight">Misi</h2>
        <ol className="mt-8 grid gap-x-12 sm:grid-cols-2">
          {missions.map((m, i) => (
            <li key={i} className="flex gap-5 border-t border-line py-6">
              <span className="w-8 shrink-0 text-2xl font-extrabold text-brass tabular-nums">{i + 1}</span>
              <p className="leading-relaxed">{m}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
