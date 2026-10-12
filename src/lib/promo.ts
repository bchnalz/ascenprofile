/** Ukuran baku gambar promo: 1080 × 1350 piksel (rasio 4:5, potret). */
export const PROMO_WIDTH = 1080;
export const PROMO_HEIGHT = 1350;
export const PROMO_MAX_BYTES = 2 * 1024 * 1024;

export type PromoFrequency = "session" | "always" | "daily";

export type PromoItem = {
  id: string;
  active: boolean;
  image: string;
  alt: string;
  link: string;
  buttonLabel: string;
  startAt: string | null;
  endAt: string | null;
};

export type PromoSettings = {
  enabled: boolean;
  frequency: PromoFrequency;
  delaySeconds: number;
  items: PromoItem[];
};

export const frequencyLabels: Record<PromoFrequency, string> = {
  session: "Setiap kali website dibuka (sekali per kunjungan)",
  always: "Setiap kali website dibuka atau dimuat ulang",
  daily: "Sekali sehari per pengunjung",
};

/** Promo yang sedang berlaku pada waktu tertentu. */
export function activePromos(settings: PromoSettings, now = new Date()) {
  if (!settings.enabled) return [];
  return settings.items.filter(
    (p) => p.active && p.image && (!p.startAt || new Date(p.startAt) <= now) && (!p.endAt || new Date(p.endAt) >= now),
  );
}
