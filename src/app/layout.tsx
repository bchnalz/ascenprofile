import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smpasacendekia.sch.id";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SMP Asa Cendekia Sedati — Sekolah unggulan terakreditasi A",
    template: "%s · SMP Asa Cendekia Sedati",
  },
  description:
    "SMP Asa Cendekia Sedati, Sidoarjo: sekolah Islam terakreditasi A yang menyeimbangkan pendidikan agama dan pendidikan umum. Berimtaq, beriptek, dan berprestasi.",
  openGraph: { type: "website", locale: "id_ID", siteName: "SMP Asa Cendekia Sedati" },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1613" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..600&display=swap"
        />
      </head>
      <body className="min-h-dvh">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
