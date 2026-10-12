"use client";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { scrollToId } from "@/lib/scroll";

/**
 * Guliran halus (inersia) untuk seluruh situs publik, plus penanganan tautan
 * bagian (#sambutan, /#berita, dst.) agar menggulir halus dari halaman mana pun.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // Tangkap klik pada tautan bagian.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href");
      if (!href || !href.includes("#")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;

      e.preventDefault();
      e.stopPropagation(); // cegah Next <Link> ikut menavigasi
      if (url.pathname === window.location.pathname) {
        if (scrollToId(id)) history.replaceState(null, "", `#${id}`);
      } else {
        sessionStorage.setItem("asa:pending-hash", id);
        window.dispatchEvent(new CustomEvent("asa:navigate", { detail: url.pathname }));
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Setelah pindah halaman: ke atas, atau ke bagian yang dituju.
  useEffect(() => {
    const pending = sessionStorage.getItem("asa:pending-hash");
    const hash = pending ?? decodeURIComponent(window.location.hash.slice(1));
    sessionStorage.removeItem("asa:pending-hash");
    window.__lenis?.resize();
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    if (hash) {
      // Tunggu konten halaman baru terpasang.
      const t = setTimeout(() => {
        if (scrollToId(hash)) history.replaceState(null, "", `#${hash}`);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  return null;
}
