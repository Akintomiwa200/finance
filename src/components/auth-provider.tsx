"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState, createContext, useContext } from "react";
import { useAuthStore } from "@/src/store/auth-store";

const AuthContext = createContext<{ isLoading: boolean }>({ isLoading: true });

export const useAuth = () => useContext(AuthContext);

function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { _hydrated, setUser, setToken, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (_hydrated && status !== "loading") {
      setIsLoading(false);
    }
  }, [_hydrated, status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        role: (session.user as any).role as string,
        departmentId: (session.user as any).departmentId as string,
        organizationId: (session.user as any).organizationId as string,
      });
      setToken("authenticated");
    } else if (status === "unauthenticated" && isAuthenticated) {
      setUser(null);
      setToken(null);
    }
  }, [status, session, isAuthenticated, setUser, setToken]);

  return (
    <AuthContext.Provider value={{ isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync>{children}</AuthSync>
    </SessionProvider>
  );
}
