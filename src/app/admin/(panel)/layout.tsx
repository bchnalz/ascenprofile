import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      <AdminNav email={user.email ?? ""} />
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
