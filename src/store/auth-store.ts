import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId: string;
  organizationId: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isSidebarOpen: boolean;
  _hydrated: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setHydrated: () => void;
}

let _set: (partial: AuthState | Partial<AuthState>) => void;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      _set = set;
      return {
        user: null,
        isAuthenticated: false,
        token: null,
        isSidebarOpen: true,
        _hydrated: false,

        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setToken: (token) => set({ token }),
        logout: () => set({ user: null, isAuthenticated: false, token: null }),
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setSidebarOpen: (open) => set({ isSidebarOpen: open }),
        setHydrated: () => set({ _hydrated: true }),
      };
    },
    {
      name: "faas-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => () => {
        _set?.({ _hydrated: true });
      },
    }
  )
);
