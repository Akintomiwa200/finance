"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/layout/sidebar";
import { Navbar } from "@/src/components/layout/navbar";
import { MobileSidebarProvider } from "@/src/context/mobile-sidebar-context";
import { ModuleAccessGuard } from "@/src/components/layout/module-access-guard";
import { DashboardShellSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { SessionTimeoutProvider } from "@/src/components/session-timeout-provider";
import { useAuthStore } from "@/src/store/auth-store";
import { useLedgerStore } from "@/src/store/ledger-store";
import { usePayableStore } from "@/src/store/payable-store";
import { useReceivableStore } from "@/src/store/receivable-store";
import { useExpenseStore } from "@/src/store/expense-store";
import { useEmployeeStore } from "@/src/store/employee-store";
import { usePayrollStore } from "@/src/store/payroll-store";
import { useApprovalStore } from "@/src/store/approval-store";
import { useBudgetStore } from "@/src/store/budget-store";
import { useTransactionStore } from "@/src/store/transaction-store";
import { useTaxStore } from "@/src/store/tax-store";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";

function DashboardPollingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useLedgerStore.getState().startPolling();
    usePayableStore.getState().startPolling();
    useReceivableStore.getState().startPolling();
    useExpenseStore.getState().startPolling();
    useEmployeeStore.getState().startPolling();
    usePayrollStore.getState().startPolling();
    useApprovalStore.getState().startPolling();
    useBudgetStore.getState().startPolling();
    useTransactionStore.getState().startPolling();
    useTaxStore.getState().startPolling();
    useTenantSettingsStore.getState().startPolling();

    return () => {
      useLedgerStore.getState().stopPolling();
      usePayableStore.getState().stopPolling();
      useReceivableStore.getState().stopPolling();
      useExpenseStore.getState().stopPolling();
      useEmployeeStore.getState().stopPolling();
      usePayrollStore.getState().stopPolling();
      useApprovalStore.getState().stopPolling();
      useBudgetStore.getState().stopPolling();
      useTransactionStore.getState().stopPolling();
      useTaxStore.getState().stopPolling();
      useTenantSettingsStore.getState().stopPolling();
    };
  }, []);

  return <>{children}</>;
}

export default function DashboardLayout({
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

    if (user?.role === "SUPER_ADMIN") {
      if (!redirectRef.current) {
        redirectRef.current = true;
        router.push("/admin/dashboard");
      }
    }
  }, [_hydrated, isAuthenticated, user?.role, router]);

  if (!_hydrated) return <DashboardShellSkeleton />;
  if (!isAuthenticated) return <DashboardShellSkeleton />;

  return (
    <MobileSidebarProvider>
      <SessionTimeoutProvider>
        <DashboardPollingProvider>
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
        </DashboardPollingProvider>
      </SessionTimeoutProvider>
    </MobileSidebarProvider>
  );
}
