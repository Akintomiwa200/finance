import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  activeDropdown: string | null;
  toasts: { id: string; message: string; type: "success" | "error" | "info" | "warning" }[];

  setTheme: (theme: Theme) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setActiveDropdown: (id: string | null) => void;
  addToast: (message: string, type?: UIState["toasts"][number]["type"]) => void;
  removeToast: (id: string) => void;
}

let toastId = 0;

export const useUIStore = create<UIState>((set) => ({
  theme: "system",
  isMobileMenuOpen: false,
  activeModal: null,
  activeDropdown: null,
  toasts: [],

  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    }
  },

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  setActiveDropdown: (id) => set({ activeDropdown: id }),

  addToast: (message, type = "info") => {
    const id = `toast-${++toastId}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
