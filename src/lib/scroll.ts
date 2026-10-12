"use client";
import type Lenis from "lenis";

/** Tinggi header lengket — dipakai sebagai offset saat menggulir ke suatu bagian. */
export const HEADER_OFFSET = 84;

declare global {
  interface Window {
    __lenis?: Lenis;
    __asaSplashDone?: boolean;
  }
}

let locks = 0;

/** Kunci/buka guliran halaman (menu seluler, popup). Aman dipanggil bertumpuk. */
export function lockScroll(lock: boolean) {
  locks = Math.max(0, locks + (lock ? 1 : -1));
  const locked = locks > 0;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) window.__lenis?.stop();
  else window.__lenis?.start();
}

/** Gulir halus ke elemen dengan id tertentu, memperhitungkan header. */
export function scrollToId(id: string, immediate = false): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  if (locks > 0) {
    // Menu/popup masih terbuka — tunggu ditutup dulu.
    setTimeout(() => scrollToId(id, immediate), 80);
    return true;
  }
  if (window.__lenis) {
    window.__lenis.resize(); // ukuran halaman baru mungkin belum terbaca
    window.__lenis.scrollTo(el, { immediate, duration: 1.2 }); // Lenis sudah memperhitungkan scroll-margin-top (lihat globals.css)
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  }
  return true;
}
