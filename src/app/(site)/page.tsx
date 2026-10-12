import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getHome, getPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PostCard } from "@/components/site/post-card";
import { HeroVideo } from "@/components/site/hero-video";
import { featureIcons, StarMark } from "@/components/site/icons";

export const revalidate = 60;

function SmartLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const external = /^https?:\/\//.test(href);
  return external ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default async function HomePage() {
  const [home, { posts }] = await Promise.all([getHome(), getPosts({ limit: 4 })]);
  const [lead, ...rest] = posts;

  return (
    <>
      {/* ---------- Hero: video profil diputar otomatis ---------- */}
      <section id="video-profil" aria-label="Video profil sekolah" className="relative isolate flex min-h-[min(calc(100svh-72px),860px)] items-end overflow-hidden text-white">
        <HeroVideo youtubeId={home.video.youtubeId} mp4Url={home.video.mp4Url} poster={home.hero.image} title={home.video.title} />
        <div className="girih pointer-events-none absolute inset-0 opacity-[0.06] [mask-image:linear-gradient(to_top,black,transparent_70%)]" aria-hidden />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-28 pt-24 sm:px-6 sm:pb-24">
          <div className="hero-rise max-w-3xl">
            <p className="flex items-center gap-2 text-[15px] font-medium text-[#f0d488]">
              <StarMark className="size-4" />
              {home.hero.kicker}
            </p>
            <h1 className="mt-5 text-[2.8rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-[4.9rem]">
              {home.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{home.hero.subtitle}</p>
          </div>
          <div className="hero-rise-late mt-9 flex flex-wrap gap-3">
            <SmartLink
              href={home.hero.primaryHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#f0d488] px-6 py-3.5 font-semibold text-[#0b2b23] transition-colors hover:bg-white"
            >
              {home.hero.primaryLabel}
              <ArrowUpRight className="size-4" />
            </SmartLink>
            <SmartLink
              href={home.hero.secondaryHref}
              className="inline-flex items-center rounded-full border border-white/40 px-6 py-3.5 font-semibold backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {home.hero.secondaryLabel}
            </SmartLink>
          </div>
        </div>
      </section>

      {/* ---------- Nilai sekolah ---------- */}
      <section aria-label="Nilai sekolah" className="border-y border-line bg-surface">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-4 sm:grid-cols-2 sm:divide-y-0 sm:px-6 lg:grid-cols-4 lg:divide-x">
          {home.values.map((v) => (
            <li key={v.title} className="py-7 sm:px-6 sm:first:pl-0 lg:py-10">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <StarMark className="size-3.5 text-brass" />
                {v.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Sambutan ---------- */}
      <section id="sambutan" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="font-arabic text-4xl leading-loose text-brass sm:text-5xl" lang="ar" dir="rtl">
              السَّلَامُ عَلَيْكُمْ
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{home.welcome.heading}</h2>
            {home.welcome.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={home.welcome.photo} alt={home.welcome.signature} className="arch-sm mt-8 aspect-[4/5] w-56 object-cover" />
            )}
          </div>
          <div className="max-w-[62ch] text-[1.075rem] leading-[1.85]">
            <p className="font-semibold">{home.welcome.opening}</p>
            {home.welcome.paragraphs.map((p, i) => (
              <p key={i} className="mt-5 text-muted">
                {p}
              </p>
            ))}
            <p className="mt-5 font-semibold">{home.welcome.closing}</p>
            <p className="mt-8 border-t border-line pt-5 text-sm text-muted">{home.welcome.signature}</p>
          </div>
        </div>
      </section>

      {/* ---------- Selayang pandang ---------- */}
      <section id="profil" className="bg-emerald-soft/60 dark:bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 md:grid-cols-2 md:gap-16">
          <div className="arch-sm aspect-[5/6] max-w-md bg-sunken">
            {home.about.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={home.about.image} alt={home.about.imageAlt} loading="lazy" className="size-full object-cover" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{home.about.heading}</h2>
            {home.about.paragraphs.map((p, i) => (
              <p key={i} className="mt-5 max-w-[60ch] leading-[1.8] text-muted">
                {p}
              </p>
            ))}
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
              {home.about.stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="text-3xl font-extrabold tracking-tight text-emerald">{s.value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/profil/sejarah" className="mt-10 inline-flex items-center gap-1.5 font-semibold text-emerald hover:underline hover:underline-offset-4">
              Baca sejarah sekolah
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Keunggulan ---------- */}
      <section id="keunggulan" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Mengapa memilih SMP Asa Cendekia</h2>
        <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {home.strengths.map((s) => {
            const Icon = featureIcons[s.icon] ?? StarMark;
            return (
              <li key={s.title} className="flex gap-5 border-t border-line pt-7">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-soft text-emerald">
                  <Icon className="size-[22px]" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------- Berita ---------- */}
      {lead && (
        <section id="berita" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Berita terbaru</h2>
              <Link href="/berita" className="inline-flex items-center gap-1.5 font-semibold text-emerald hover:underline hover:underline-offset-4">
                Semua berita
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr]">
              <PostCard post={lead} large />
              <ul className="divide-y divide-line border-y border-line">
                {rest.map((p) => (
                  <li key={p.id} className="group relative flex gap-5 py-5">
                    {p.cover_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_url} alt="" loading="lazy" className="size-24 shrink-0 rounded-xl object-cover" />
                    )}
                    <div>
                      <time className="text-sm text-muted">{formatDate(p.published_at)}</time>
                      <h3 className="mt-1 font-bold leading-snug group-hover:text-emerald">
                        <Link href={`/berita/${p.slug}`} className="after:absolute after:inset-0">
                          {p.title}
                        </Link>
                      </h3>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Testimoni ---------- */}
      {home.testimonials.length > 0 && (
        <section id="testimoni" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Kata alumni</h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3">
            {home.testimonials.map((t, i) => (
              <li key={i}>
                <figure>
                  <span className="font-arabic text-6xl leading-none text-brass" aria-hidden>
                    “
                  </span>
                  <blockquote className="-mt-4 text-lg leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-bold">{t.name}</span>
                    {t.role && <span className="block text-muted">{t.role}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- Mitra ---------- */}
      {home.partners.length > 0 && (
        <section aria-label="Kurikulum dan mitra" className="border-y border-line bg-surface">
          <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-14 gap-y-8 px-4 py-12 sm:px-6">
            {home.partners.map((p) => (
              <li key={p.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} title={p.name} loading="lazy" className="h-14 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 dark:invert-[0.1]" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- Ajakan ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-brass-soft px-6 py-14 text-center sm:px-12">
          <div className="girih pointer-events-none absolute inset-0 opacity-25" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{home.cta.heading}</h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">{home.cta.text}</p>
            <SmartLink
              href={home.cta.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald px-7 py-3.5 font-semibold text-on-emerald transition-colors hover:bg-emerald-strong"
            >
              {home.cta.label}
              <ArrowUpRight className="size-4" />
            </SmartLink>
          </div>
        </div>
      </section>
    </>
  );
}
