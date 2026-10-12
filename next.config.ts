import type { NextConfig } from "next";
import seedPosts from "./src/content/posts.json";

// Alamat lama WordPress → alamat baru, agar tautan & hasil Google tetap berfungsi.
const legacy: [string, string][] = [
  ["/sejarah-sekolah", "/profil/sejarah"],
  ["/visi-misi", "/profil/visi-misi"],
  ["/struktur-organisasi", "/profil/struktur-organisasi"],
  ["/tenaga-pengajar", "/profil/sejarah"],
  ["/blog-4-columns", "/berita"],
  ["/kingster/blog-full-right-sidebar-with-frame", "/berita"],
  ["/ppdb", "https://spmb.smpasacendekia.sch.id"],
  ["/nihongo-club-jepang-club", "/ekstrakurikuler/nihongo-club"],
  ["/ec-english-club", "/ekstrakurikuler/english-club"],
  ["/ekstrakurikuler/ekstra-smart", "/ekstrakurikuler"],
  ["/ekstrakurikuler/ekstra-action", "/ekstrakurikuler"],
  ...["pramuka", "fotografi", "pencak-silat", "banjari", "basket", "voli", "futsal", "tari-nusantara", "gambar-lukis", "jurnalistik", "paduan-suara", "palang-merah-remaja"].map(
    (s) => [`/${s}`, `/ekstrakurikuler/${s}`] as [string, string],
  ),
  ...seedPosts.map((p) => [`/${p.slug}`, `/berita/${p.slug}`] as [string, string]),
];

const nextConfig: NextConfig = {
  async redirects() {
    return legacy.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
