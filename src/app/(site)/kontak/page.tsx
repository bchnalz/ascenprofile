import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { WhatsAppIcon } from "@/components/site/icons";
import { getContact } from "@/lib/data";

export const metadata: Metadata = { title: "Kontak" };
export const revalidate = 60;

export default async function ContactPage() {
  const c = await getContact();
  const wa = c.whatsapp.replace(/[^\d]/g, "");
  const items = [
    { icon: MapPin, label: "Alamat", value: c.address, href: c.mapLink },
    c.phone && { icon: Phone, label: "Telepon", value: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}` },
    wa && { icon: WhatsAppIcon, label: "WhatsApp", value: c.whatsapp, href: `https://wa.me/${wa}` },
    c.email && { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href: string }[];

  return (
    <>
      <PageHeader title="Hubungi kami" intro="Kami senang menerima kunjungan dan pertanyaan Anda." crumbs={[{ label: "Kontak" }]} />
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <a href={href} className="group flex gap-5 py-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="mt-0.5 block text-lg font-semibold leading-snug group-hover:text-emerald">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        {c.mapEmbed && (
          <div className="arch-sm min-h-[420px] overflow-hidden border border-line bg-sunken">
            <iframe
              src={c.mapEmbed}
              title={`Peta lokasi ${c.schoolName}`}
              className="size-full min-h-[420px] dark:[filter:invert(0.9)_hue-rotate(180deg)]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </section>
    </>
  );
}
