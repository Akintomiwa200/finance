"use client";

import { useAuthStore } from "@/src/store/auth-store";
import { useFetch } from "@/src/hooks/use-fetch";

export interface OrganizationBranding {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

export function useOrganization() {
  const organizationId = useAuthStore((s) => s.user?.organizationId);

  return useFetch<OrganizationBranding>(
    organizationId ? "/api/organization/current" : null,
    undefined,
    { enabled: !!organizationId },
  );
}
