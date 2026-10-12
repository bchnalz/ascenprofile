"use client";
import { useEffect, useState } from "react";

const MIN_MS = 1300;
const MAX_MS = 3200;

function finish() {
  window.__asaSplashDone = true;
  window.dispatchEvent(new Event("asa:splash-done"));
}

/** Layar pembuka — tampil sekali saat website pertama kali dibuka dalam satu sesi. */
export function Splash({ logo, name }: { logo: string; name: string }) {
  const [phase, setPhase] = useState<"show" | "out" | "gone">("show");

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("no-splash")) {
      setPhase("gone");
      finish();
      return;
    }
    const started = performance.now();
    let done = false;
    const close = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      setTimeout(() => {
        setPhase("out");
        try {
          sessionStorage.setItem("asa:splashed", "1");
        } catch {}
        setTimeout(() => {
          setPhase("gone");
          finish();
        }, 700);
      }, wait);
    };
    if (document.readyState === "complete") close();
    else window.addEventListener("load", close, { once: true });
    const cap = setTimeout(close, MAX_MS);
    return () => {
      clearTimeout(cap);
      window.removeEventListener("load", close);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      id="splash"
      role="status"
      aria-label={`Memuat ${name}`}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] ${
        phase === "out" ? "pointer-events-none -translate-y-4 opacity-0" : ""
      }`}
    >
      <div className="girih pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
      <div className="relative flex size-44 items-center justify-center">
        <svg viewBox="0 0 200 200" className="splash-ring absolute inset-0 size-full text-brass" aria-hidden>
          <g fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="44" y="44" width="112" height="112" className="splash-draw" />
            <rect x="44" y="44" width="112" height="112" transform="rotate(45 100 100)" className="splash-draw splash-draw-late" />
            <circle cx="100" cy="100" r="92" strokeOpacity="0.35" />
          </g>
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" className="splash-logo relative h-16 w-auto" />
      </div>
      <p className="splash-text mt-8 font-arabic text-2xl text-brass" lang="ar" dir="rtl">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      <p className="splash-text mt-2 text-lg font-extrabold tracking-tight text-ink">{name}</p>
      <div className="mt-6 h-[2px] w-40 overflow-hidden rounded-full bg-line">
        <div className="splash-bar h-full bg-emerald" />
      </div>
    </div>
  );
}

