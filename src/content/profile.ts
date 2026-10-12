import { LEGACY_MEDIA_BASE as WP } from "@/lib/media";

export const history = {
  founded: "2011",
  foundation: "Perkumpulan Lembaga Pendidikan Asa Cendekia (PLPAC)",
  motto: "Menyeimbangkan Pendidikan Agama Islam dengan Pendidikan Umum",
  paragraphs: [
    "SMP Asa Cendekia Sedati adalah lembaga pendidikan Islam di Sedati, Sidoarjo, yang dinaungi oleh Perkumpulan Lembaga Pendidikan Asa Cendekia (PLPAC). Sekolah ini didirikan dan mulai beroperasi pada tahun 2011.",
    "Sejak awal, sekolah memegang semboyan “Menyeimbangkan Pendidikan Agama Islam dengan Pendidikan Umum”. Mutu pendidikan terus ditingkatkan melalui tenaga pendidik yang berkualitas dan berdedikasi, serta fasilitas seperti laboratorium, sarana teknologi informasi, dan program pengembangan diri siswa.",
    "Pembelajaran di SMP Asa Cendekia berbasis teknologi namun tetap berlandaskan iman dan akhlak mulia, dengan tujuan menyiapkan lulusan yang mampu bersaing masuk ke sekolah-sekolah negeri maupun swasta unggulan.",
    "Kini SMP Asa Cendekia Sedati telah terakreditasi A.",
  ],
};

export const vision = "Terwujudnya generasi yang Berimtaq, Beriptek, dan Berprestasi.";

export const missions = [
  "Menyelenggarakan kurikulum yang terintegrasi dengan pendidikan karakter: keimanan, pemahaman agama, sikap moderat, dan cinta tanah air.",
  "Menerapkan pembelajaran yang aktif dan kontekstual.",
  "Menghasilkan lulusan yang berprestasi akademik dan nonakademik, menguasai ilmu pengetahuan dan teknologi, berpikir kritis, mampu berkomunikasi global secara multibahasa, berakhlak mulia, serta menjadi warga yang produktif, kreatif, dan bertanggung jawab.",
  "Mengembangkan sarana dan prasarana yang menunjang mutu siswa.",
  "Meningkatkan profesionalisme guru.",
  "Membangun kemitraan dengan masyarakat dan pemangku kepentingan sekolah.",
  "Menyediakan layanan pendidikan secara daring.",
  "Menerapkan penilaian autentik.",
];

export const orgChart = {
  image: `${WP}/2024/09/Struktur-Baru-01-1.jpg`,
  imageFallback: `${WP}/2024/09/Struktur-Baru-01-1-1024x749.jpg`,
};

export const facilities = [
  {
    group: "Pendidikan dan manajemen",
    items: ["Ruang PLPAC", "Ruang pimpinan", "Ruang komite", "Ruang guru", "Ruang tata usaha", "Ruang kelas"],
  },
  {
    group: "Penunjang akademik",
    items: ["Perpustakaan", "Laboratorium IPA", "Laboratorium komputer", "Ruang konseling", "Ruang OSIS"],
  },
  { group: "Kesehatan dan olahraga", items: ["Ruang UKS", "Lapangan olahraga"] },
  { group: "Ibadah dan kesejahteraan", items: ["Tempat ibadah", "Kantin", "Koperasi"] },
  { group: "Sarana pendukung", items: ["Toilet", "Pos keamanan", "Gudang"] },
];

export type Extracurricular = {
  slug: string;
  name: string;
  group: "Ekstra Smart" | "Ekstra Action";
  summary: string;
  description: string[];
  images: string[];
  mandatory?: boolean;
};

export const extracurriculars: Extracurricular[] = [
  {
    slug: "nihongo-club",
    name: "Nihongo Club",
    group: "Ekstra Smart",
    summary: "Belajar bahasa dan budaya Jepang dengan cara santai dan interaktif.",
    description: [
      "Nihongo Club adalah ekstrakurikuler untuk mempelajari bahasa dan budaya Jepang. Siswa mengenal huruf hiragana dan katakana, kosakata dasar, serta berlatih percakapan untuk situasi sehari-hari.",
      "Selain bahasa, klub ini memperkenalkan budaya Jepang tradisional dan modern, festival khas, hingga kesenian seperti origami — memperluas wawasan, mengasah kreativitas, dan membangun persahabatan.",
    ],
    images: [`${WP}/2025/08/nihongo-1x1-1.jpg`, `${WP}/2025/08/nihongo-1x1-2.jpg`, `${WP}/2025/08/Kostum-Jepang.jpg`],
  },
  {
    slug: "english-club",
    name: "English Club",
    group: "Ekstra Smart",
    summary: "Meningkatkan kemampuan dan kepercayaan diri berbahasa Inggris.",
    description: [
      "English Club membantu siswa meningkatkan kemampuan bahasa Inggris dan percaya diri menggunakannya sebagai bahasa internasional.",
      "Metodenya interaktif: diskusi kelompok, permainan edukatif, bermain peran, hingga memanfaatkan film dan musik. Klub ini melengkapi pembelajaran di kelas dengan memperkuat kemampuan berbicara, menyimak, dan berpikir kritis.",
    ],
    images: [`${WP}/2025/08/english-club.jpg`],
  },
  {
    slug: "pramuka",
    name: "Pramuka",
    group: "Ekstra Action",
    mandatory: true,
    summary: "Ekstrakurikuler wajib yang menjadi pilar pembentukan karakter.",
    description: [
      "Pramuka merupakan ekstrakurikuler wajib dan pilar utama pembentukan karakter siswa. Berlandaskan Dasa Darma dan Tri Satya, kegiatan ini menumbuhkan disiplin, tanggung jawab, kejujuran, dan kepedulian.",
      "Siswa belajar bekerja sama dalam regu, memecahkan masalah, dan berinisiatif. Kegiatannya mencakup keterampilan teknik kepramukaan dan bakti masyarakat, menumbuhkan kemandirian serta cinta tanah air dan lingkungan.",
    ],
    images: [],
  },
  {
    slug: "fotografi",
    name: "Fotografi",
    group: "Ekstra Action",
    summary: "Belajar teknik memotret dan menjadi fotografer resmi acara sekolah.",
    description: [
      "Klub fotografi terbuka bagi siswa yang tertarik memotret, baik dengan DSLR, mirrorless, maupun kamera ponsel. Anggota mempelajari dasar peralatan, teknik pengambilan gambar, dan komposisi visual.",
      "Anggota juga bertugas sebagai fotografer resmi acara sekolah, dan karyanya ditampilkan di mading, website, serta media sosial sekolah.",
    ],
    images: [`${WP}/2024/08/fotogarfi.jpg`],
  },
  {
    slug: "pencak-silat",
    name: "Pencak Silat",
    group: "Ekstra Action",
    summary: "Seni bela diri sekaligus pelestarian warisan budaya bangsa.",
    description: [
      "Pencak silat adalah ekstrakurikuler unggulan yang dipandang sebagai seni bela diri sekaligus upaya melestarikan warisan budaya takbenda Indonesia.",
      "Latihan membangun disiplin, pengendalian diri, keberanian, kerendahan hati, dan ketenangan, serta rasa hormat kepada guru dan sesama — menyeimbangkan fisik dan spiritual.",
    ],
    images: [`${WP}/2024/08/Snapinsta.app_451562568_1229916821330231_1929101970734202885_n_1080.jpg`],
  },
  {
    slug: "banjari",
    name: "Banjari",
    group: "Ekstra Action",
    summary: "Seni hadrah dan shalawat untuk menguatkan karakter religius.",
    description: [
      "Klub Banjari mengajarkan hadrah — permainan rebana yang mengiringi shalawat — sebagai ungkapan cinta dan syiar Islam.",
      "Siswa melatih vokal, pukulan, kreativitas, dan kekompakan, sekaligus memperkuat karakter religius dan persaudaraan. Anggota berkesempatan tampil di acara sekolah dan perlombaan.",
    ],
    images: [],
  },
  {
    slug: "basket",
    name: "Basket",
    group: "Ekstra Action",
    summary: "Membangun kebugaran, mental tangguh, dan kerja sama tim.",
    description: [
      "Ekstrakurikuler basket membangun kebugaran fisik, ketangguhan mental, dan kerja sama tim dalam olahraga yang mengandalkan kecepatan, kelincahan, dan strategi.",
      "Program latihan terstruktur meningkatkan stamina, kekuatan, serta teknik dasar hingga lanjutan, dengan tujuan membentuk tim sekolah yang siap tampil di pertandingan persahabatan maupun turnamen resmi.",
    ],
    images: [],
  },
  {
    slug: "voli",
    name: "Voli",
    group: "Ekstra Action",
    summary: "Melatih lompatan, smash, passing, dan blocking.",
    description: [
      "Ekstrakurikuler voli cocok bagi siswa yang kompetitif dan ingin membangun kekuatan fisik serta mental.",
      "Latihan meliputi daya lompat, smash, passing, dan blocking untuk menghasilkan pemain yang terampil sekaligus cerdas membaca permainan.",
    ],
    images: [],
  },
  {
    slug: "futsal",
    name: "Futsal",
    group: "Ekstra Action",
    summary: "Kontrol bola, taktik, dan kekompakan tim dalam permainan cepat.",
    description: [
      "Futsal melatih kontrol bola, passing, shooting, pemahaman taktik, kebugaran, disiplin, dan kekompakan tim.",
      "Tujuannya membentuk tim futsal sekolah yang disegani dan siap bertanding di berbagai kompetisi.",
    ],
    images: [],
  },
  {
    slug: "tari-nusantara",
    name: "Tari Nusantara",
    group: "Ekstra Action",
    summary: "Mengenal tari tradisional dari Sumatra hingga Indonesia timur.",
    description: [
      "Tari Nusantara mengajak siswa menjelajahi tarian tradisional dari berbagai daerah, dari Sumatra, Jawa, hingga Indonesia timur.",
      "Siswa juga mempelajari makna dan filosofi setiap tarian, olah tubuh, ekspresi, dan penjiwaan — ikut melestarikan warisan budaya bangsa.",
    ],
    images: [],
  },
  {
    slug: "gambar-lukis",
    name: "Gambar & Lukis",
    group: "Ekstra Action",
    summary: "Menuangkan imajinasi lewat pensil, cat air, dan media lain.",
    description: [
      "Klub Gambar & Lukis terbuka bagi siswa dari semua tingkat kemampuan untuk mengekspresikan imajinasi melalui pensil, cat air, dan media lainnya.",
      "Anggota mempelajari teknik dasar seperti sketsa, proporsi, dan komposisi warna. Karya mereka dipajang di sekolah, galeri mini, atau diikutkan dalam lomba.",
    ],
    images: [],
  },
  {
    slug: "jurnalistik",
    name: "Jurnalistik",
    group: "Ekstra Action",
    summary: "Menjadi reporter sekolah: meliput, mewawancarai, dan menulis.",
    description: [
      "Jurnalistik mengenalkan dasar-dasar peliputan: 5W+1H, wawancara, serta menulis berita, feature, dan opini.",
      "Anggota menjadi reporter sekolah yang karyanya tampil di mading, blog, media sosial, dan podcast — melatih berpikir kritis, percaya diri, dan berkomunikasi.",
    ],
    images: [],
  },
  {
    slug: "paduan-suara",
    name: "Paduan Suara",
    group: "Ekstra Action",
    summary: "Berlatih bernyanyi bersama dan tampil di acara sekolah.",
    description: ["Paduan suara memberi ruang bagi siswa untuk melatih vokal, harmoni, dan kekompakan, serta tampil dalam acara-acara sekolah."],
    images: [],
  },
  {
    slug: "palang-merah-remaja",
    name: "Palang Merah Remaja",
    group: "Ekstra Action",
    summary: "Belajar pertolongan pertama dan menumbuhkan jiwa kemanusiaan.",
    description: ["Palang Merah Remaja (PMR) membekali siswa dengan keterampilan pertolongan pertama, kesehatan, dan kepedulian sosial."],
    images: [],
  },
];

export const navigation = [
  {
    label: "Beranda",
    href: "/",
    children: [
      { label: "Video profil", href: "/#video-profil" },
      { label: "Sambutan", href: "/#sambutan" },
      { label: "Selayang pandang", href: "/#profil" },
      { label: "Keunggulan", href: "/#keunggulan" },
      { label: "Berita terbaru", href: "/#berita" },
      { label: "Kata alumni", href: "/#testimoni" },
    ],
  },
  {
    label: "Profil",
    href: "/profil/sejarah",
    children: [
      { label: "Sejarah sekolah", href: "/profil/sejarah" },
      { label: "Visi & misi", href: "/profil/visi-misi" },
      { label: "Struktur organisasi", href: "/profil/struktur-organisasi" },
      { label: "Fasilitas", href: "/fasilitas" },
    ],
  },
  { label: "Ekstrakurikuler", href: "/ekstrakurikuler" },
  { label: "Prestasi", href: "/prestasi" },
  { label: "Berita", href: "/berita" },
  { label: "Kontak", href: "/kontak" },
];
