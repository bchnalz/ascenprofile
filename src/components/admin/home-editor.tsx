"use client";
import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import type { HomeContent } from "@/lib/types";
import { saveSetting, type ActionResult } from "@/app/admin/actions";
import { featureIconNames } from "@/components/site/icons";
import { Field, ImageField, Notice, Repeater, Section, TextArea, VideoField } from "./fields";

const toParas = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const fromParas = (p: string[]) => p.join("\n\n");

export function HomeEditor({ initial }: { initial: HomeContent }) {
  const [home, setHome] = useState(initial);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const [dirty, setDirty] = useState(false);

  function set<K extends keyof HomeContent>(key: K, patch: Partial<HomeContent[K]> | HomeContent[K]) {
    setDirty(true);
    setHome((h) => ({ ...h, [key]: Array.isArray(patch) ? patch : { ...(h[key] as object), ...(patch as object) } }));
  }

  function save() {
    start(async () => {
      const r = await saveSetting("home", home);
      setResult(r);
      if (r.ok) setDirty(false);
    });
  }

  return (
    <div className="space-y-6">
      <Section title="Hero" description="Bagian paling atas beranda, tampil di atas video profil.">
        <Field label="Kalimat pembuka kecil" value={home.hero.kicker} onChange={(v) => set("hero", { kicker: v })} />
        <Field label="Judul utama" value={home.hero.title} onChange={(v) => set("hero", { title: v })} />
        <TextArea label="Deskripsi" rows={3} value={home.hero.subtitle} onChange={(v) => set("hero", { subtitle: v })} />
        <ImageField label="Foto hero (gambar sementara sebelum video diputar)" folder="home" aspect="aspect-video" value={home.hero.image} onChange={(v) => set("hero", { image: v })} />
        <Field label="Teks alternatif foto" value={home.hero.imageAlt} onChange={(v) => set("hero", { imageAlt: v })} hint="Deskripsi singkat foto untuk pembaca layar." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tombol utama — teks" value={home.hero.primaryLabel} onChange={(v) => set("hero", { primaryLabel: v })} />
          <Field label="Tombol utama — tautan" value={home.hero.primaryHref} onChange={(v) => set("hero", { primaryHref: v })} />
          <Field label="Tombol kedua — teks" value={home.hero.secondaryLabel} onChange={(v) => set("hero", { secondaryLabel: v })} />
          <Field label="Tombol kedua — tautan" value={home.hero.secondaryHref} onChange={(v) => set("hero", { secondaryHref: v })} />
        </div>
      </Section>

      <Section title="Nilai sekolah" description="Empat poin di bawah hero.">
        <Repeater
          label="Daftar nilai"
          items={home.values}
          onChange={(v) => set("values", v)}
          create={() => ({ title: "", text: "" })}
          itemLabel={(v, i) => v.title || `Nilai ${i + 1}`}
          render={(v, u) => (
            <>
              <Field label="Judul" value={v.title} onChange={(x) => u({ title: x })} />
              <Field label="Keterangan" value={v.text} onChange={(x) => u({ text: x })} />
            </>
          )}
        />
      </Section>

      <Section title="Sambutan kepala sekolah">
        <Field label="Judul" value={home.welcome.heading} onChange={(v) => set("welcome", { heading: v })} />
        <Field label="Salam pembuka" value={home.welcome.opening} onChange={(v) => set("welcome", { opening: v })} />
        <TextArea
          label="Isi sambutan"
          rows={8}
          value={fromParas(home.welcome.paragraphs)}
          onChange={(v) => set("welcome", { paragraphs: toParas(v) })}
          hint="Pisahkan paragraf dengan satu baris kosong."
        />
        <Field label="Salam penutup" value={home.welcome.closing} onChange={(v) => set("welcome", { closing: v })} />
        <Field label="Nama / jabatan penanda tangan" value={home.welcome.signature} onChange={(v) => set("welcome", { signature: v })} />
        <ImageField label="Foto kepala sekolah (opsional)" folder="home" aspect="aspect-[4/5]" value={home.welcome.photo} onChange={(v) => set("welcome", { photo: v })} />
      </Section>

      <Section title="Selayang pandang">
        <Field label="Judul" value={home.about.heading} onChange={(v) => set("about", { heading: v })} />
        <TextArea label="Isi" rows={8} value={fromParas(home.about.paragraphs)} onChange={(v) => set("about", { paragraphs: toParas(v) })} hint="Pisahkan paragraf dengan satu baris kosong." />
        <ImageField label="Foto" folder="home" aspect="aspect-[5/6]" value={home.about.image} onChange={(v) => set("about", { image: v })} />
        <Field label="Teks alternatif foto" value={home.about.imageAlt} onChange={(v) => set("about", { imageAlt: v })} />
        <Repeater
          label="Angka singkat"
          items={home.about.stats}
          onChange={(v) => set("about", { stats: v })}
          create={() => ({ value: "", label: "" })}
          itemLabel={(s, i) => s.label || `Angka ${i + 1}`}
          render={(s, u) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nilai" value={s.value} onChange={(x) => u({ value: x })} />
              <Field label="Label" value={s.label} onChange={(x) => u({ label: x })} />
            </div>
          )}
        />
      </Section>

      <Section title="Keunggulan">
        <Repeater
          label="Daftar keunggulan"
          items={home.strengths}
          onChange={(v) => set("strengths", v)}
          create={() => ({ icon: "star", title: "", text: "" })}
          itemLabel={(s, i) => s.title || `Keunggulan ${i + 1}`}
          render={(s, u) => (
            <>
              <div>
                <label className="text-sm font-medium">Ikon</label>
                <select className="input mt-1.5" value={s.icon} onChange={(e) => u({ icon: e.target.value })}>
                  {featureIconNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Judul" value={s.title} onChange={(x) => u({ title: x })} />
              <TextArea label="Keterangan" rows={2} value={s.text} onChange={(x) => u({ text: x })} />
            </>
          )}
        />
      </Section>

      <Section title="Video profil" description="Diputar otomatis tanpa suara sebagai latar hero saat website dibuka. Pengunjung bisa menyalakan suara.">
        <Field label="Judul video" value={home.video.title} onChange={(v) => set("video", { title: v })} />
        <Field
          label="Tautan YouTube"
          value={home.video.youtubeId}
          onChange={(v) => {
            const m = v.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
            set("video", { youtubeId: m ? m[1] : v.trim() });
          }}
          hint="Tempel tautan YouTube; ID videonya diambil otomatis."
        />
        <VideoField
          label="Atau unggah file video (MP4, disarankan)"
          value={home.video.mp4Url}
          onChange={(v) => set("video", { mp4Url: v })}
          hint="Jika diisi, MP4 dipakai menggantikan YouTube — tampil lebih bersih tanpa logo YouTube. Ukuran ideal: 1920×1080, durasi 30–60 detik, maksimal 50 MB."
        />
        <p className="text-xs text-muted">Foto hero di atas dipakai sebagai gambar sementara sebelum video mulai diputar.</p>
      </Section>

      <Section title="Testimoni alumni">
        <Repeater
          label="Daftar testimoni"
          items={home.testimonials}
          onChange={(v) => set("testimonials", v)}
          create={() => ({ quote: "", name: "", role: "" })}
          itemLabel={(t, i) => t.name || `Testimoni ${i + 1}`}
          render={(t, u) => (
            <>
              <TextArea label="Kutipan" rows={3} value={t.quote} onChange={(x) => u({ quote: x })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nama" value={t.name} onChange={(x) => u({ name: x })} />
                <Field label="Keterangan" value={t.role} onChange={(x) => u({ role: x })} />
              </div>
            </>
          )}
        />
      </Section>

      <Section title="Kurikulum & mitra" description="Deretan logo di bagian bawah beranda.">
        <Repeater
          label="Daftar logo"
          items={home.partners}
          onChange={(v) => set("partners", v)}
          create={() => ({ name: "", image: "" })}
          itemLabel={(p, i) => p.name || `Logo ${i + 1}`}
          render={(p, u) => (
            <>
              <Field label="Nama" value={p.name} onChange={(x) => u({ name: x })} />
              <ImageField label="Logo" folder="partners" aspect="aspect-square" value={p.image} onChange={(x) => u({ image: x })} />
            </>
          )}
        />
      </Section>

      <Section title="Ajakan mendaftar">
        <Field label="Judul" value={home.cta.heading} onChange={(v) => set("cta", { heading: v })} />
        <TextArea label="Keterangan" rows={2} value={home.cta.text} onChange={(v) => set("cta", { text: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Teks tombol" value={home.cta.label} onChange={(v) => set("cta", { label: v })} />
          <Field label="Tautan tombol" value={home.cta.href} onChange={(v) => set("cta", { href: v })} />
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-paper/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <button type="button" onClick={save} disabled={pending} className="btn-primary">
          <Save className="size-4" />
          {pending ? "Menyimpan…" : "Simpan perubahan"}
        </button>
        {dirty && !pending && <span className="text-sm text-muted">Ada perubahan yang belum disimpan.</span>}
        <div className="w-full sm:w-auto">
          <Notice result={dirty ? null : result} />
        </div>
      </div>
    </div>
  );
}
