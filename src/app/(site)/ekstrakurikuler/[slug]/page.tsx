import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/page-header";
import { extracurriculars } from "@/content/profile";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return extracurriculars.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = extracurriculars.find((e) => e.slug === slug);
  return item ? { title: item.name, description: item.summary } : {};
}

export default async function ExtracurricularDetail({ params }: Params) {
  const { slug } = await params;
  const item = extracurriculars.find((e) => e.slug === slug);
  if (!item) notFound();
  const others = extracurriculars.filter((e) => e.slug !== slug && e.group === item.group).slice(0, 6);

  return (
    <>
      <PageHeader title={item.name} intro={item.summary} crumbs={[{ label: "Ekstrakurikuler", href: "/ekstrakurikuler" }, { label: item.name }]} />
      <section className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="prose-asa">
            {item.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {item.images.length > 0 && (
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {item.images.map((src, i) => (
                <a key={src} href={src} className={`block overflow-hidden rounded-2xl bg-sunken ${i === 0 && item.images.length % 2 === 1 ? "sm:col-span-2" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Kegiatan ${item.name}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>
        <aside>
          <p className="rounded-2xl bg-emerald-soft p-5 text-[15px] leading-relaxed">
            Termasuk kelompok <strong>{item.group}</strong>
            {item.mandatory ? " dan wajib diikuti seluruh siswa." : ". Siswa dapat memilih sesuai minat."}
          </p>
          <h2 className="mt-10 font-bold">Ekstrakurikuler lain</h2>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/ekstrakurikuler/${o.slug}`} className="block py-3 hover:text-emerald">
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
}
