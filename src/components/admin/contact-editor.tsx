"use client";
import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import type { ContactInfo } from "@/lib/types";
import { saveSetting, type ActionResult } from "@/app/admin/actions";
import { Field, ImageField, Notice, Section, TextArea } from "./fields";

export function ContactEditor({ initial }: { initial: ContactInfo }) {
  const [c, setC] = useState(initial);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const set = (patch: Partial<ContactInfo>) => {
    setResult(null);
    setC((x) => ({ ...x, ...patch }));
  };

  return (
    <div className="space-y-6">
      <Section title="Identitas sekolah">
        <Field label="Nama sekolah" value={c.schoolName} onChange={(v) => set({ schoolName: v })} />
        <Field label="Slogan" value={c.tagline} onChange={(v) => set({ tagline: v })} />
        <ImageField label="Logo" folder="brand" aspect="aspect-square" value={c.logo} onChange={(v) => set({ logo: v })} />
      </Section>
      <Section title="Kontak">
        <TextArea label="Alamat" rows={2} value={c.address} onChange={(v) => set({ address: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telepon" value={c.phone} onChange={(v) => set({ phone: v })} />
          <Field label="WhatsApp" value={c.whatsapp} onChange={(v) => set({ whatsapp: v })} hint="Format: +62…" />
          <Field label="Email" type="email" value={c.email} onChange={(v) => set({ email: v })} />
          <Field label="Tautan portal SPMB" value={c.spmbUrl} onChange={(v) => set({ spmbUrl: v })} />
        </div>
        <Field label="Tautan Google Maps" value={c.mapLink} onChange={(v) => set({ mapLink: v })} />
        <Field label="URL embed peta" value={c.mapEmbed} onChange={(v) => set({ mapEmbed: v })} hint="Google Maps → Bagikan → Sematkan peta → salin isi atribut src." />
      </Section>
      <Section title="Media sosial" description="Kosongkan yang tidak dipakai.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Instagram" value={c.instagram} onChange={(v) => set({ instagram: v })} />
          <Field label="YouTube" value={c.youtube} onChange={(v) => set({ youtube: v })} />
          <Field label="Facebook" value={c.facebook} onChange={(v) => set({ facebook: v })} />
          <Field label="TikTok" value={c.tiktok} onChange={(v) => set({ tiktok: v })} />
        </div>
      </Section>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={pending} className="btn-primary" onClick={() => start(async () => setResult(await saveSetting("contact", c)))}>
          <Save className="size-4" />
          {pending ? "Menyimpan…" : "Simpan perubahan"}
        </button>
        <Notice result={result} />
      </div>
    </div>
  );
}
