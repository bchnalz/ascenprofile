import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { ContactInfo } from "@/lib/types";
import { WhatsAppIcon } from "./icons";

export function Footer({ contact }: { contact: ContactInfo }) {
  const wa = contact.whatsapp.replace(/[^\d]/g, "");
  const socials = [
    { label: "Instagram", href: contact.instagram },
    { label: "YouTube", href: contact.youtube },
    { label: "Facebook", href: contact.facebook },
    { label: "TikTok", href: contact.tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="relative mt-24 overflow-hidden bg-emerald-strong text-[#e9f1ec] dark:bg-sunken dark:text-ink">
      <div className="girih pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={contact.logo} alt="" className="h-12 w-auto" />
            <div>
              <p className="text-lg font-extrabold">{contact.schoolName}</p>
              <p className="text-sm opacity-75">{contact.tagline}</p>
            </div>
          </div>
          <p className="mt-6 font-arabic text-2xl leading-relaxed text-[#f0d488] dark:text-brass" lang="ar" dir="rtl">
            رَبِّ زِدْنِي عِلْمًا
          </p>
          <p className="mt-1 text-sm opacity-75">“Ya Tuhanku, tambahkanlah ilmu kepadaku.” — QS. Thaha: 114</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold opacity-75">Jelajahi</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {[
              ["Sejarah sekolah", "/profil/sejarah"],
              ["Visi & misi", "/profil/visi-misi"],
              ["Struktur organisasi", "/profil/struktur-organisasi"],
              ["Ekstrakurikuler", "/ekstrakurikuler"],
              ["Prestasi", "/prestasi"],
              ["Berita", "/berita"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:underline hover:underline-offset-4">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold opacity-75">Hubungi kami</h2>
          <ul className="mt-4 space-y-3.5 text-[15px]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 opacity-75" />
              <a href={contact.mapLink} className="hover:underline hover:underline-offset-4">
                {contact.address}
              </a>
            </li>
            {contact.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 opacity-75" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
              </li>
            )}
            {wa && (
              <li className="flex gap-3">
                <WhatsAppIcon className="mt-0.5 size-4 shrink-0 opacity-75" />
                <a href={`https://wa.me/${wa}`}>{contact.whatsapp}</a>
              </li>
            )}
            {contact.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 opacity-75" />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            )}
          </ul>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="inline-block rounded-full border border-white/25 px-3.5 py-1.5 text-sm hover:bg-white/10 dark:border-line">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="relative border-t border-white/15 dark:border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm opacity-75 sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {contact.schoolName}. Hak cipta dilindungi.</p>
          <a href={contact.spmbUrl} className="hover:underline">
            Portal SPMB
          </a>
        </div>
      </div>
    </footer>
  );
}
