import { Sidebar } from "@/src/components/layout/sidebar";
import { Navbar } from "@/src/components/layout/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        <Navbar />
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
