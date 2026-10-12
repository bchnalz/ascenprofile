import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { StarMark } from "@/components/site/icons";
import { extracurriculars } from "@/content/profile";

export const metadata: Metadata = { title: "Ekstrakurikuler" };

const groups = [
  { name: "Ekstra Smart", intro: "Penguatan bahasa dan wawasan akademik." },
  { name: "Ekstra Action", intro: "Olahraga, seni, kepemimpinan, dan kreativitas." },
] as const;

export default function ExtracurricularPage() {
  return (
    <>
      <PageHeader
        title="Ekstrakurikuler"
        intro="Ruang bagi setiap siswa untuk menemukan dan mengasah bakatnya di luar kelas."
        crumbs={[{ label: "Ekstrakurikuler" }]}
      />
      {groups.map((g) => (
        <section key={g.name} className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
            <h2 className="text-2xl font-extrabold tracking-tight">{g.name}</h2>
            <p className="text-muted">{g.intro}</p>
          </div>
          <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {extracurriculars
              .filter((e) => e.group === g.name)
              .map((e) => (
                <li key={e.slug} className="group relative">
                  <div className="arch-sm aspect-[4/3] bg-emerald-soft">
                    {e.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.images[0]} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="relative flex size-full items-center justify-center">
                        <div className="girih absolute inset-0 opacity-30" aria-hidden />
                        <StarMark className="relative size-10 text-emerald/70" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 flex items-center gap-2 text-lg font-bold group-hover:text-emerald">
                    <Link href={`/ekstrakurikuler/${e.slug}`} className="after:absolute after:inset-0">
                      {e.name}
                    </Link>
                    {e.mandatory && <span className="rounded-full bg-brass-soft px-2 py-0.5 text-xs font-semibold text-brass">Wajib</span>}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{e.summary}</p>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}
