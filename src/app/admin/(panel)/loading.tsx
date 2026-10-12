/** Tampil seketika saat berpindah menu admin, selagi data dimuat. */
export default function AdminLoading() {
  return (
    <div className="max-w-5xl animate-pulse" aria-busy="true" aria-label="Memuat">
      <div className="h-8 w-56 rounded-lg bg-sunken" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-sunken" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-2xl bg-sunken" />
        <div className="h-28 rounded-2xl bg-sunken" />
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-sunken" />
        ))}
      </div>
    </div>
  );
}
