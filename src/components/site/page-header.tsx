import Link from "next/link";
import { StarMark } from "./icons";

type Crumb = { label: string; href?: string };

export function PageHeader({ title, intro, crumbs = [] }: { title: string; intro?: string; crumbs?: Crumb[] }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="girih pointer-events-none absolute -right-10 top-0 h-full w-1/2 opacity-[0.12] [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        <nav aria-label="Jejak halaman" className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-emerald">
            Beranda
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <StarMark className="size-2.5 text-brass" />
              {c.href ? (
                <Link href={c.href} className="hover:text-emerald">
                  {c.label}
                </Link>
              ) : (
                <span className="text-ink">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-[-0.025em] text-balance sm:text-[3.4rem]">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
      </div>
    </section>
  );
}
