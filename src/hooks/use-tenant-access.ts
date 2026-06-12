"use client";

import type { ModuleId } from "@/src/lib/permissions";
import { useAuthStore } from "@/src/store/auth-store";
import { useFetch } from "@/src/hooks/use-fetch";

interface TenantAccessResponse {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  planId: string;
  planName: string | null;
  enabledModuleIds: ModuleId[];
}

export function useTenantAccess() {
  const organizationId = useAuthStore((s) => s.user?.organizationId);

  const { data, isLoading, refetch } = useFetch<TenantAccessResponse>(
    organizationId ? "/api/organization/current" : null,
  );

  return {
    planModuleIds: data?.enabledModuleIds ?? [],
    planId: data?.planId ?? null,
    planName: data?.planName ?? null,
    isLoading,
    refetch,
  };
}
