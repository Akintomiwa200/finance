"use client";

import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";

/** Realtime polling for company support pages (same transport as admin). */
export function useSupportRealtime(onEvent?: () => void) {
  return useAdminRealtime(onEvent);
}
