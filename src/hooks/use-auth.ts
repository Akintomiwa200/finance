"use client";

import { useSession } from "next-auth/react";
import { useAuthStore } from "@/src/store/auth-store";
import { useEffect } from "react";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const { user: storedUser, setUser, logout: storeLogout } = useAuthStore();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: session.user.role ?? "",
        departmentId: session.user.departmentId ?? "",
        organizationId: session.user.organizationId ?? "",
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status, setUser]);

  return {
    user: storedUser ?? session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isUnauthenticated: status === "unauthenticated",
    role: session?.user?.role ?? storedUser?.role ?? null,
    organizationId: session?.user?.organizationId ?? storedUser?.organizationId ?? null,
    departmentId: session?.user?.departmentId ?? storedUser?.departmentId ?? null,
    updateSession: update,
    logout: storeLogout,
  };
}
