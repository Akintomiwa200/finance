import { SuperAdminSidebar } from "@/src/components/layout/super-admin-sidebar";
import { SuperAdminNavbar } from "@/src/components/layout/super-admin-navbar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SuperAdminSidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        <SuperAdminNavbar />
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
