"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/layout/sidebar";
import { Navbar } from "@/src/components/layout/navbar";
import { MobileSidebarProvider } from "@/src/context/mobile-sidebar-context";
import { ModuleAccessGuard } from "@/src/components/layout/module-access-guard";
import { DashboardShellSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useAuthStore } from "@/src/store/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, _hydrated, user } = useAuthStore();

  useEffect(() => {
    if (_hydrated) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role === "SUPER_ADMIN") {
        router.push("/admin/dashboard");
      }
    }
  }, [_hydrated, isAuthenticated, user, router]);

  if (!_hydrated) return <DashboardShellSkeleton />;
  if (!isAuthenticated) return <DashboardShellSkeleton />;

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-4 md:p-6">
              <ModuleAccessGuard>{children}</ModuleAccessGuard>
            </div>
          </main>
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
