import { getPromo } from "@/lib/data";
import { PromoEditor } from "@/components/admin/promo-editor";

export default async function PromoSettingsPage() {
  const promo = await getPromo();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight">Popup promo</h1>
      <p className="mt-1 text-muted">Iklan atau pengumuman bergambar yang muncul saat pengunjung membuka website.</p>
      <div className="mt-8">
        <PromoEditor initial={promo} />
      </div>
    </div>
  );
}
