"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/layout/sidebar";
import { Navbar } from "@/src/components/layout/navbar";
import { useAuthStore } from "@/src/store/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, _hydrated } = useAuthStore();

  useEffect(() => {
    if (_hydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [_hydrated, isAuthenticated, router]);

  if (!_hydrated) return null;
  if (!isAuthenticated) return null;

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
