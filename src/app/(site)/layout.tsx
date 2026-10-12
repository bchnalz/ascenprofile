import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { getContact } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const contact = await getContact();
  return (
    <>
      <a href="#konten" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-emerald focus:px-4 focus:py-2 focus:text-on-emerald">
        Lewati ke konten
      </a>
      <Header logo={contact.logo} schoolName={contact.schoolName} spmbUrl={contact.spmbUrl} />
      <main id="konten">{children}</main>
      <Footer contact={contact} />
    </>
  );
}
