"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/store/auth-store";
import { useHelpCenterStore } from "@/src/store/help-center-store";

export function HelpCenterSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isSuperAdmin = useAuthStore((s) => s.user?.role === "SUPER_ADMIN");
  const _hydrated = useAuthStore((s) => s._hydrated);
  const setUnreadCount = useHelpCenterStore((s) => s.setUnreadCount);

  useEffect(() => {
    if (!_hydrated || !isAuthenticated || isSuperAdmin) return;

    let cancelled = false;

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/help-center?view=unread");
        if (!res.ok || cancelled) return;
        const data = await res.json();
        setUnreadCount(data.unreadCount ?? 0);
      } catch {
        // silent
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [_hydrated, isAuthenticated, isSuperAdmin, setUnreadCount]);

  return null;
}
