"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { SuperAdminSidebar } from "@/src/components/layout/super-admin-sidebar";
import { SuperAdminNavbar } from "@/src/components/layout/super-admin-navbar";
import { MobileSidebarProvider } from "@/src/context/mobile-sidebar-context";
import { AdminShellSkeleton } from "@/src/components/layout/dashboard-skeletons";

export default function SuperAdminLayout({
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
      } else if (user?.role !== "SUPER_ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [_hydrated, isAuthenticated, user, router]);

  if (!_hydrated) return <AdminShellSkeleton />;
  if (!isAuthenticated || user?.role !== "SUPER_ADMIN") return <AdminShellSkeleton />;

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <SuperAdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <SuperAdminNavbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
