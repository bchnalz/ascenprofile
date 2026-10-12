import { Suspense } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Splash } from "@/components/site/splash";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { RouteTransition } from "@/components/site/route-transition";
import { PromoPopup } from "@/components/site/promo-popup";
import { BackToTop } from "@/components/site/back-to-top";
import { getContact, getPromo } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [contact, promo] = await Promise.all([getContact(), getPromo()]);
  return (
    <>
      <Splash logo={contact.logo} name={contact.schoolName} />
      <SmoothScroll />
      <Suspense>
        <RouteTransition />
      </Suspense>
      <a href="#konten" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-emerald focus:px-4 focus:py-2 focus:text-on-emerald">
        Lewati ke konten
      </a>
      <Header logo={contact.logo} schoolName={contact.schoolName} spmbUrl={contact.spmbUrl} />
      <main id="konten">{children}</main>
      <Footer contact={contact} />
      <BackToTop />
      <PromoPopup settings={promo} />
    </>
  );
}
