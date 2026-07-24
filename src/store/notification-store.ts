import { create } from "zustand";
import { realtime } from "@/src/services/realtime.service";
import type { AppNotification } from "@/src/types/notification";
import type { RealtimeMessage } from "@/src/types/common";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isPolling: boolean;
  initialized: boolean;
  scope: "dashboard" | "admin";

  initNotifications: (scope: "dashboard" | "admin") => void;
  setNotifications: (notifications: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  startPolling: (endpoint?: string) => void;
  stopPolling: () => void;
  getById: (id: string) => AppNotification | undefined;
}

function mapNotification(raw: Record<string, unknown>): AppNotification {
  return {
    id: raw.id as string,
    title: raw.title as string,
    message: raw.message as string,
    body: (raw.body as string) || undefined,
    category: (raw.category as AppNotification["category"]) || "messages",
    type: (raw.type as AppNotification["type"]) || "INFO",
    isRead: raw.isRead as boolean,
    createdAt: raw.createdAt as string,
    referenceId: (raw.referenceId as string) || undefined,
  };
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isPolling: false,
  initialized: false,
  scope: "dashboard",

  initNotifications: async (scope) => {
    const { initialized, scope: currentScope } = get();
    if (initialized && currentScope === scope) return;
    set({ scope, initialized: true });

    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      const notifications: AppNotification[] = (data.notifications || []).map(mapNotification);
      set({
        notifications,
        unreadCount: data.unreadCount ?? notifications.filter((n) => !n.isRead).length,
      });
    } catch {
      set({ notifications: [], unreadCount: 0 });
    }
  },

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),

  markAsRead: async (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    });
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    } catch {
      // optimistic update already applied
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
    try {
      await fetch("/api/notifications", { method: "PATCH" });
    } catch {
      // optimistic update already applied
    }
  },

  removeNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  getById: (id) => get().notifications.find((n) => n.id === id),

  startPolling: (endpoint) => {
    const { isPolling } = get();
    if (isPolling) return;
    set({ isPolling: true });

    const unsub = realtime.subscribe("notifications", "*", (msg: RealtimeMessage) => {
      if (msg.event === "notification" && msg.data) {
        const notif = msg.data as AppNotification;
        get().addNotification(notif);
      }
    });

    realtime.startPolling(endpoint, 10_000);

    return () => {
      unsub();
      set({ isPolling: false });
    };
  },

  stopPolling: () => {
    realtime.disconnect();
    set({ isPolling: false });
  },
}));
