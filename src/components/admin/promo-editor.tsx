"use client";
import { useRef, useState, useTransition } from "react";
import { Eye, ImagePlus, Loader2, Save } from "lucide-react";
import { saveSetting, type ActionResult } from "@/app/admin/actions";
import { activePromos, frequencyLabels, PROMO_HEIGHT, PROMO_MAX_BYTES, PROMO_WIDTH, type PromoFrequency, type PromoItem, type PromoSettings } from "@/lib/promo";
import { Field, Notice, Repeater, Section, uploadImage } from "./fields";

function readSize(file: File) {
  return new Promise<{ w: number; h: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => reject(new Error("File bukan gambar yang valid."));
    img.src = url;
  });
}

function toLocal(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function PromoImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onFile(file?: File) {
    if (!file) return;
    setMsg(null);
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) return setMsg({ ok: false, text: "Format harus PNG, JPG, atau WebP." });
    if (file.size > PROMO_MAX_BYTES) return setMsg({ ok: false, text: `Ukuran file ${(file.size / 1048576).toFixed(1)} MB. Maksimal 2 MB.` });
    try {
      const { w, h } = await readSize(file);
      const ratioOk = Math.abs(w / h - PROMO_WIDTH / PROMO_HEIGHT) < 0.02;
      if (!ratioOk) {
        return setMsg({ ok: false, text: `Gambar berukuran ${w}×${h} px. Gunakan ukuran ${PROMO_WIDTH}×${PROMO_HEIGHT} px (rasio 4:5) agar tidak terpotong.` });
      }
      if (w < 720) return setMsg({ ok: false, text: `Resolusi ${w}×${h} px terlalu kecil dan akan tampak buram. Gunakan ${PROMO_WIDTH}×${PROMO_HEIGHT} px.` });
      setBusy(true);
      onChange(await uploadImage(file, "promo"));
      setMsg({
        ok: true,
        text: w === PROMO_WIDTH && h === PROMO_HEIGHT ? "Gambar sesuai ukuran baku." : `Diunggah (${w}×${h} px, rasio sudah 4:5).`,
      });
    } catch (e) {
      setMsg({ ok: false, text: `Unggah gagal: ${(e as Error).message}` });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="relative flex aspect-[4/5] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-sunken sm:w-44"
        aria-label="Pilih gambar promo"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 px-3 text-center text-xs text-muted">
            <ImagePlus className="size-6" />
            {PROMO_WIDTH}×{PROMO_HEIGHT} px
          </span>
        )}
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
            <Loader2 className="size-6 animate-spin" />
          </span>
        )}
      </button>
      <div className="space-y-2 text-sm">
        <p className="font-medium">Gambar promo</p>
        <ul className="space-y-1 text-muted">
          <li>
            Ukuran baku: <strong className="text-ink">{PROMO_WIDTH} × {PROMO_HEIGHT} px</strong> (potret 4:5)
          </li>
          <li>Format PNG, JPG, atau WebP, maksimal 2 MB</li>
          <li>Letakkan teks penting di tengah, jauhi 60 px dari tepi</li>
        </ul>
        <button type="button" className="btn-ghost" disabled={busy} onClick={() => input.current?.click()}>
          <ImagePlus className="size-4" />
          {value ? "Ganti gambar" : "Unggah gambar"}
        </button>
        {msg && <p className={msg.ok ? "text-emerald" : "text-red-600 dark:text-red-300"}>{msg.text}</p>}
      </div>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}

export function PromoEditor({ initial }: { initial: PromoSettings }) {
  const [promo, setPromo] = useState(initial);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const [preview, setPreview] = useState<PromoItem | null>(null);

  const set = (patch: Partial<PromoSettings>) => {
    setResult(null);
    setPromo((p) => ({ ...p, ...patch }));
  };
  const live = activePromos(promo);

  return (
    <div className="space-y-6">
      <Section title="Pengaturan tampilan">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 size-4 accent-[var(--emerald)]" checked={promo.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
          <span>
            <span className="font-medium">Tampilkan popup promo</span>
            <span className="block text-sm text-muted">Muncul setelah layar pembuka selesai. Pengunjung bisa menutupnya kapan saja.</span>
          </span>
        </label>
        <div>
          <label htmlFor="freq" className="text-sm font-medium">
            Seberapa sering tampil
          </label>
          <select id="freq" className="input mt-1.5" value={promo.frequency} onChange={(e) => set({ frequency: e.target.value as PromoFrequency })}>
            {Object.entries(frequencyLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Jeda sebelum muncul (detik)"
          type="number"
          value={String(promo.delaySeconds)}
          onChange={(v) => set({ delaySeconds: Math.min(30, Math.max(0, Number(v) || 0)) })}
        />
        <p className="rounded-xl bg-sunken px-3.5 py-2.5 text-sm">
          {live.length === 0
            ? "Saat ini tidak ada promo yang tampil."
            : `${live.length} promo sedang tampil${live.length > 1 ? " — pengunjung bisa menggeser antarpromo" : ""}.`}
        </p>
      </Section>

      <Section title="Daftar promo" description="Urutan di sini menentukan urutan tampil.">
        <Repeater
          label="Promo"
          items={promo.items}
          onChange={(items) => set({ items })}
          create={() => ({ id: crypto.randomUUID(), active: true, image: "", alt: "", link: "", buttonLabel: "", startAt: null, endAt: null })}
          itemLabel={(p, i) => `${p.alt || `Promo ${i + 1}`}${p.active ? "" : " (nonaktif)"}`}
          render={(p, u) => (
            <>
              <PromoImageField value={p.image} onChange={(image) => u({ image })} />
              <Field label="Deskripsi gambar" value={p.alt} onChange={(alt) => u({ alt })} hint="Contoh: Pendaftaran SPMB 2027 dibuka. Dibacakan pembaca layar." />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Tautan saat diklik (opsional)" value={p.link} onChange={(link) => u({ link })} placeholder="https://spmb.smpasacendekia.sch.id" />
                <Field label="Teks tombol (opsional)" value={p.buttonLabel} onChange={(buttonLabel) => u({ buttonLabel })} placeholder="Daftar sekarang" />
                <Field label="Mulai tampil" type="datetime-local" value={toLocal(p.startAt)} onChange={(v) => u({ startAt: v ? new Date(v).toISOString() : null })} />
                <Field label="Berhenti tampil" type="datetime-local" value={toLocal(p.endAt)} onChange={(v) => u({ endAt: v ? new Date(v).toISOString() : null })} />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="size-4 accent-[var(--emerald)]" checked={p.active} onChange={(e) => u({ active: e.target.checked })} />
                  Aktif
                </label>
                {p.image && (
                  <button type="button" className="btn-ghost" onClick={() => setPreview(p)}>
                    <Eye className="size-4" />
                    Pratinjau
                  </button>
                )}
              </div>
            </>
          )}
        />
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-paper/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <button type="button" disabled={pending} className="btn-primary" onClick={() => start(async () => setResult(await saveSetting("promo", promo)))}>
          <Save className="size-4" />
          {pending ? "Menyimpan…" : "Simpan promo"}
        </button>
        <Notice result={result} />
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setPreview(null)} role="dialog" aria-label="Pratinjau promo">
          <div className="w-full max-w-[400px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.image} alt={preview.alt} className="w-full rounded-[18px]" />
            <p className="mt-3 text-center text-sm text-white/80">Klik di mana saja untuk menutup pratinjau.</p>
          </div>
        </div>
      )}
    </div>
  );
}
