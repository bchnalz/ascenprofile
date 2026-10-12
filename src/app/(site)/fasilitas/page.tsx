import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { StarMark } from "@/components/site/icons";
import { facilities } from "@/content/profile";

export const metadata: Metadata = { title: "Fasilitas" };

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader
        title="Fasilitas"
        intro="Sarana dan prasarana yang menunjang kegiatan belajar, ibadah, dan pengembangan diri siswa."
        crumbs={[{ label: "Profil" }, { label: "Fasilitas" }]}
      />
      <section className="mx-auto grid max-w-6xl gap-x-12 gap-y-14 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {facilities.map((f) => (
          <div key={f.group}>
            <h2 className="border-b-2 border-brass pb-3 text-lg font-bold">{f.group}</h2>
            <ul className="mt-2">
              {f.items.map((item) => (
                <li key={item} className="flex items-center gap-3 border-b border-line py-3">
                  <StarMark className="size-3 shrink-0 text-emerald" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
