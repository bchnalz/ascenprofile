"use client";
import { useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";

export function Field({
  label,
  value,
  onChange,
  hint,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  type?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="input mt-1.5" />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextArea({ label, value, onChange, rows = 4, hint }: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="input mt-1.5 resize-y leading-relaxed" />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

/** Unggah gambar ke Supabase Storage (bucket "media") dan kembalikan URL publiknya. */
export async function uploadImage(file: File, folder = "uploads") {
  const supabase = getBrowserClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export function ImageField({ label, value, onChange, folder = "uploads", aspect = "aspect-[4/3]" }: { label: string; value: string; onChange: (v: string) => void; folder?: string; aspect?: string }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file?: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5 MB.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, folder));
    } catch (e) {
      setError(`Unggah gagal: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className={`relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-sunken sm:w-40 ${aspect}`}
          aria-label="Pilih gambar untuk diunggah"
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <ImagePlus className="size-6 text-muted" />
          )}
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
              <Loader2 className="size-6 animate-spin" />
            </span>
          )}
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… atau unggah gambar" className="input" />
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" onClick={() => input.current?.click()} disabled={busy}>
              <ImagePlus className="size-4" />
              Unggah
            </button>
            {value && (
              <button type="button" className="btn-ghost" onClick={() => onChange("")}>
                Kosongkan
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-600 dark:text-red-300">{error}</p>}
        </div>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}

export function Repeater<T>({
  label,
  items,
  onChange,
  create,
  render,
  itemLabel,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  itemLabel: (item: T, index: number) => string;
}) {
  const move = (i: number, d: number) => {
    const next = [...items];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    onChange(next);
  };
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <ol className="mt-2 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="rounded-xl border border-line bg-paper p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold">{itemLabel(item, i)}</span>
              <span className="flex shrink-0 gap-1">
                <button type="button" className="rounded-lg p-1.5 hover:bg-sunken disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Pindah ke atas">
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-1.5 hover:bg-sunken disabled:opacity-30"
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Pindah ke bawah"
                >
                  <ArrowDown className="size-4" />
                </button>
                <button type="button" className="rounded-lg p-1.5 text-red-600 hover:bg-red-500/10 dark:text-red-300" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Hapus">
                  <Trash2 className="size-4" />
                </button>
              </span>
            </div>
            <div className="space-y-3">{render(item, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))))}</div>
          </li>
        ))}
      </ol>
      <button type="button" className="btn-ghost mt-3" onClick={() => onChange([...items, create()])}>
        <Plus className="size-4" />
        Tambah
      </button>
    </div>
  );
}

export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function Notice({ result }: { result: { ok: boolean; message: string } | null }) {
  if (!result) return null;
  return (
    <p
      role="status"
      className={`rounded-xl px-3.5 py-2.5 text-sm ${result.ok ? "bg-emerald-soft text-emerald" : "bg-red-500/10 text-red-700 dark:text-red-300"}`}
    >
      {result.message}
    </p>
  );
}

export function VideoField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("video/")) return setError("Pilih file video (MP4 atau WebM).");
    if (file.size > 50 * 1024 * 1024) return setError("Ukuran video maksimal 50 MB. Kompres dulu, misalnya dengan HandBrake.");
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, "video"));
    } catch (e) {
      setError(`Unggah gagal: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {value && (
        <video src={value} muted controls playsInline className="mt-1.5 aspect-video w-full max-w-md rounded-xl bg-black" />
      )}
      <div className="mt-2 space-y-2">
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://….mp4 atau unggah file" className="input" />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {busy ? "Mengunggah…" : "Unggah video"}
          </button>
          {value && (
            <button type="button" className="btn-ghost" onClick={() => onChange("")}>
              Hapus video
            </button>
          )}
        </div>
        {hint && <p className="text-xs text-muted">{hint}</p>}
        {error && <p className="text-xs text-red-600 dark:text-red-300">{error}</p>}
      </div>
      <input ref={input} type="file" accept="video/mp4,video/webm" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}
