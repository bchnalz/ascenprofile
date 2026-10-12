"use client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { activePromos, PROMO_HEIGHT, PROMO_WIDTH, type PromoSettings } from "@/lib/promo";
import { lockScroll } from "@/lib/scroll";

// Hanya diperiksa sekali per pemuatan dokumen — tidak muncul lagi saat berpindah halaman di dalam situs.
let checkedThisLoad = false;

/** Tanda unik isi promo — promo baru akan tampil lagi walau yang lama sudah ditutup. */
function signature(ids: string[]) {
  return ids.join("|");
}

function shouldShow(settings: PromoSettings, sig: string) {
  try {
    if (settings.frequency === "always") return true;
    if (settings.frequency === "daily") {
      const today = new Date().toISOString().slice(0, 10);
      return localStorage.getItem("asa:promo-daily") !== `${sig}@${today}`;
    }
    return sessionStorage.getItem("asa:promo-session") !== sig;
  } catch {
    return true;
  }
}

function remember(settings: PromoSettings, sig: string) {
  try {
    if (settings.frequency === "daily") localStorage.setItem("asa:promo-daily", `${sig}@${new Date().toISOString().slice(0, 10)}`);
    else if (settings.frequency === "session") sessionStorage.setItem("asa:promo-session", sig);
  } catch {}
}

export function PromoPopup({ settings }: { settings: PromoSettings }) {
  const [items, setItems] = useState<PromoSettings["items"]>([]);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [index, setIndex] = useState(0);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);

  // Tentukan apakah promo perlu tampil, lalu tunggu splash selesai.
  useEffect(() => {
    if (checkedThisLoad) return;
    const list = activePromos(settings);
    if (list.length === 0) return;
    const sig = signature(list.map((p) => p.id + p.image));
    if (!shouldShow(settings, sig)) {
      checkedThisLoad = true;
      return;
    }
    setItems(list);

    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      timer = setTimeout(() => {
        checkedThisLoad = true;
        lastFocus.current = document.activeElement;
        setOpen(true);
        remember(settings, sig);
      }, Math.max(0, settings.delaySeconds) * 1000);
    };
    if (window.__asaSplashDone) show();
    else window.addEventListener("asa:splash-done", show, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("asa:splash-done", show);
    };
  }, [settings]);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      (lastFocus.current as HTMLElement | null)?.focus?.();
    }, 220);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, items.length]);

  if (!open || items.length === 0) return null;
  const item = items[index];
  const external = /^https?:\/\//.test(item.link);

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={item.id}
      src={item.image}
      alt={item.alt || "Promo SMP Asa Cendekia"}
      width={PROMO_WIDTH}
      height={PROMO_HEIGHT}
      className="promo-fade block h-auto max-h-[min(78svh,820px)] w-full rounded-[18px] bg-sunken object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
    />
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Promo"
      data-lenis-prevent
      className={`fixed inset-0 z-[90] flex items-center justify-center p-4 transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`}
    >
      <button type="button" aria-label="Tutup promo" tabIndex={-1} onClick={close} className="promo-fade absolute inset-0 cursor-default bg-[#04140f]/75 backdrop-blur-sm" />

      <div className="promo-in relative w-full max-w-[min(440px,calc((min(78svh,820px))*0.8))]">
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          aria-label="Tutup promo"
          className="absolute -right-2 -top-2 z-10 flex size-10 items-center justify-center rounded-full bg-white text-[#0b2b23] shadow-lg transition-transform hover:scale-105 sm:-right-4 sm:-top-4"
        >
          <X className="size-5" />
        </button>

        {item.link ? (
          <a href={item.link} target={external ? "_blank" : undefined} rel={external ? "noopener" : undefined} onClick={() => !external && close()}>
            {image}
          </a>
        ) : (
          image
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          {items.length > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
                aria-label="Promo sebelumnya"
                className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="text-sm tabular-nums text-white/80">
                {index + 1} / {items.length}
              </span>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % items.length)}
                aria-label="Promo berikutnya"
                className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          ) : (
            <span />
          )}
          {item.link && item.buttonLabel && (
            <a
              href={item.link}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener" : undefined}
              onClick={() => !external && close()}
              className="rounded-full bg-[#f0d488] px-5 py-2.5 text-sm font-semibold text-[#0b2b23] hover:bg-white"
            >
              {item.buttonLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
