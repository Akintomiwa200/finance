"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { getEffectiveModules } from "@/src/lib/permissions";
import { pathnameToModuleId } from "@/src/lib/module-route-access";
import { useTenantAccess } from "@/src/hooks/use-tenant-access";

export function ModuleAccessGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { planModuleIds, isLoading } = useTenantAccess();

  useEffect(() => {
    if (isLoading || !pathname) return;
    if (pathname.startsWith("/access-denied")) return;

    const moduleId = pathnameToModuleId(pathname);
    if (!moduleId) return;

    const allowed = getEffectiveModules(user?.role ?? "EMPLOYEE", planModuleIds);
    if (!allowed.includes(moduleId)) {
      router.replace(`/access-denied?module=${encodeURIComponent(moduleId)}`);
    }
  }, [pathname, planModuleIds, isLoading, user?.role, router]);

  return <>{children}</>;
}
