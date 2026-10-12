"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FileText, Home, LayoutDashboard, LogOut, Megaphone, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/beranda", label: "Konten beranda", icon: Home },
  { href: "/admin/artikel", label: "Artikel", icon: FileText },
  { href: "/admin/promo", label: "Popup promo", icon: Megaphone },
  { href: "/admin/kontak", label: "Kontak & identitas", icon: Phone },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-4 lg:px-5 lg:py-6">
        <div>
          <p className="font-extrabold tracking-tight">Asa Cendekia</p>
          <p className="text-xs text-muted">Panel admin</p>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <form action={signOut}>
            <button type="submit" className="btn-ghost" aria-label="Keluar">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active(href) ? "bg-emerald-soft text-emerald" : "hover:bg-sunken"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
        <a href="/" target="_blank" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-sunken">
          <ExternalLink className="size-4" />
          Lihat website
        </a>
      </nav>
      <div className="hidden border-t border-line p-4 lg:block">
        <p className="truncate text-xs text-muted" title={email}>
          {email}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <ThemeToggle />
          <form action={signOut} className="flex-1">
            <button type="submit" className="btn-ghost w-full">
              <LogOut className="size-4" />
              Keluar
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
