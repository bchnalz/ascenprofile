"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navigation } from "@/content/profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { lockScroll } from "@/lib/scroll";

type Props = { logo: string; schoolName: string; spmbUrl: string };

export function Header({ logo, schoolName, spmbUrl }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/")));

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-paper/90 backdrop-blur-md" : "border-b border-transparent bg-paper"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${schoolName} — beranda`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" className="h-10 w-auto" />
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight">SMP Asa Cendekia</span>
            <span className="block text-xs text-muted">Sedati · Sidoarjo</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:text-emerald ${
                    item.href === "/" ? (pathname === "/" ? "text-emerald" : "") : item.children.some((c) => pathname === c.href) ? "text-emerald" : ""
                  }`}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown className="size-4 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="w-56 rounded-2xl border border-line bg-surface p-2 shadow-[0_18px_40px_-20px_rgba(8,40,30,0.35)]">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={`block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-emerald-soft ${pathname === c.href ? "font-semibold text-emerald" : ""}`}
                          onClick={(e) => (e.currentTarget as HTMLElement).blur()}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:text-emerald ${isActive(item.href) ? "text-emerald" : ""}`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <ThemeToggle />
          <a
            href={spmbUrl}
            className="hidden rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-on-emerald transition-colors hover:bg-emerald-strong sm:inline-flex"
          >
            Daftar SPMB
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-paper px-4 pb-10 pt-4 lg:hidden"
          aria-label="Navigasi seluler"
          data-lenis-prevent
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <Link href={item.href} className="block px-3 pb-1 pt-4 text-sm text-muted">
                      {item.label}
                    </Link>
                    <ul>
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block rounded-xl px-3 py-3 text-lg font-semibold hover:bg-emerald-soft">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href} className="block rounded-xl px-3 py-3 text-lg font-semibold hover:bg-emerald-soft">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <a href={spmbUrl} className="mt-6 flex justify-center rounded-full bg-emerald px-5 py-3.5 font-semibold text-on-emerald">
            Daftar SPMB
          </a>
        </nav>
      )}
    </header>
  );
}
