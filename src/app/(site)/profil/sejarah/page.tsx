import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { history } from "@/content/profile";

export const metadata: Metadata = { title: "Sejarah sekolah" };

export default function HistoryPage() {
  return (
    <>
      <PageHeader title="Sejarah sekolah" intro={history.motto} crumbs={[{ label: "Profil" }, { label: "Sejarah sekolah" }]} />
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_2fr]">
        <dl className="space-y-6 md:sticky md:top-28 md:self-start">
          <div className="border-t-2 border-brass pt-3">
            <dt className="text-sm text-muted">Berdiri</dt>
            <dd className="text-4xl font-extrabold tracking-tight text-emerald">{history.founded}</dd>
          </div>
          <div className="border-t border-line pt-3">
            <dt className="text-sm text-muted">Yayasan</dt>
            <dd className="font-semibold">{history.foundation}</dd>
          </div>
          <div className="border-t border-line pt-3">
            <dt className="text-sm text-muted">Akreditasi</dt>
            <dd className="font-semibold">A</dd>
          </div>
        </dl>
        <div className="prose-asa">
          {history.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </>
  );
}
