/** Dipasang ulang setiap pindah halaman — memicu animasi masuk. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
