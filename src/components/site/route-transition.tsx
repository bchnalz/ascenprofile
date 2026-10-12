"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LEAVE_MS = 220;

/**
 * Transisi antar halaman: konten memudar keluar, bilah progres kuningan berjalan
 * di atas, lalu halaman baru memudar masuk (lihat template.tsx).
 */
export function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [state, setState] = useState<"idle" | "leaving" | "loading">("idle");
  const target = useRef<string | null>(null);

  useEffect(() => {
    const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const go = (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      target.current = url.pathname + url.search;
      if (reduce()) {
        router.push(target.current);
        return;
      }
      setState("leaving");
      document.documentElement.dataset.leaving = "true";
      setTimeout(() => {
        setState("loading");
        router.push(target.current!);
      }, LEAVE_MS);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || url.hash || url.pathname.startsWith("/admin")) return;
      e.preventDefault();
      e.stopPropagation(); // Next <Link> tidak ikut menavigasi; kita yang menavigasi setelah animasi keluar
      go(href);
    };

    const onNavigate = (e: Event) => go((e as CustomEvent<string>).detail);

    document.addEventListener("click", onClick, true);
    window.addEventListener("asa:navigate", onNavigate);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("asa:navigate", onNavigate);
    };
  }, [router]);

  // Halaman baru sudah terpasang.
  useEffect(() => {
    delete document.documentElement.dataset.leaving;
    setState("idle");
  }, [pathname, search]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-brass transition-[transform,opacity] ease-out ${
        state === "idle" ? "scale-x-100 opacity-0 duration-500" : state === "leaving" ? "scale-x-[0.35] opacity-100 duration-200" : "scale-x-[0.85] opacity-100 duration-[3000ms]"
      }`}
    />
  );
}
