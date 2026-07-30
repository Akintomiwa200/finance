"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { SuperAdminSidebar } from "@/src/components/layout/super-admin-sidebar";
import { SuperAdminNavbar } from "@/src/components/layout/super-admin-navbar";
import { MobileSidebarProvider } from "@/src/context/mobile-sidebar-context";
import { AdminShellSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { UserAppearanceSync } from "@/src/components/settings/user-appearance-sync";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, _hydrated, user } = useAuthStore();
  const redirectRef = useRef(false);

  useEffect(() => {
    if (!_hydrated) return;

    if (!isAuthenticated) {
      if (!redirectRef.current) {
        redirectRef.current = true;
        router.push("/login");
      }
      return;
    }

    if (user?.role !== "SUPER_ADMIN") {
      if (!redirectRef.current) {
        redirectRef.current = true;
        router.push("/dashboard");
      }
    }
  }, [_hydrated, isAuthenticated, user?.role, router]);

  if (!_hydrated) return <AdminShellSkeleton />;
  if (!isAuthenticated || user?.role !== "SUPER_ADMIN") return <AdminShellSkeleton />;

  return (
    <MobileSidebarProvider>
      <UserAppearanceSync />
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
