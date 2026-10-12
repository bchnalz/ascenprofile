import { getContact } from "@/lib/data";
import { ContactEditor } from "@/components/admin/contact-editor";

export default async function ContactSettingsPage() {
  const contact = await getContact();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight">Kontak & identitas</h1>
      <p className="mt-1 text-muted">Dipakai di header, footer, dan halaman Kontak.</p>
      <div className="mt-8">
        <ContactEditor initial={contact} />
      </div>
    </div>
  );
}
