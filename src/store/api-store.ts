import { create } from "zustand";
import type { RequestStatus } from "@/src/types/common";

interface PendingRequest {
  id: string;
  method: string;
  path: string;
  startedAt: number;
}

interface APIState {
  pendingRequests: PendingRequest[];
  statuses: Record<string, RequestStatus>;
  isOnline: boolean;
  lastError: { path: string; message: string; timestamp: number } | null;

  addRequest: (id: string, method: string, path: string) => void;
  removeRequest: (id: string) => void;
  setStatus: (key: string, status: RequestStatus) => void;
  setOnline: (online: boolean) => void;
  setLastError: (path: string, message: string) => void;
  clearErrors: () => void;
  hasPendingRequests: () => boolean;
}

let requestCounter = 0;

export const useAPIStore = create<APIState>((set, get) => ({
  pendingRequests: [],
  statuses: {},
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  lastError: null,

  addRequest: (id, method, path) =>
    set((state) => ({
      pendingRequests: [...state.pendingRequests, { id, method, path, startedAt: Date.now() }],
      statuses: { ...state.statuses, [path]: "loading" },
    })),

  removeRequest: (id) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== id),
    })),

  setStatus: (key, status) =>
    set((state) => ({
      statuses: { ...state.statuses, [key]: status },
    })),

  setOnline: (online) => set({ isOnline: online }),

  setLastError: (path, message) =>
    set({ lastError: { path, message, timestamp: Date.now() } }),

  clearErrors: () => set({ lastError: null }),

  hasPendingRequests: () => get().pendingRequests.length > 0,
}));

/* ───────── Track fetch requests automatically ───────── */

export function trackRequest(method: string, path: string): string {
  const id = `req-${++requestCounter}`;
  useAPIStore.getState().addRequest(id, method, path);
  return id;
}

export function finishRequest(id: string) {
  useAPIStore.getState().removeRequest(id);
}
