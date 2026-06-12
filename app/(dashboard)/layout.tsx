"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/layout/sidebar";
import { Navbar } from "@/src/components/layout/navbar";
import { MobileSidebarProvider } from "@/src/context/mobile-sidebar-context";
import { ModuleAccessGuard } from "@/src/components/layout/module-access-guard";
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

  if (!_hydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <MobileSidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 min-h-screen w-full min-w-0 overflow-y-auto">
          <Navbar />
          <div className="p-4 md:p-6">
            <ModuleAccessGuard>{children}</ModuleAccessGuard>
          </div>
        </main>
      </div>
    </MobileSidebarProvider>
  );
}
