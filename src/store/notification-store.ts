import { create } from "zustand";
import { realtime } from "@/src/services/realtime.service";
import type { RealtimeMessage } from "@/src/types/common";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  createdAt: string;
  referenceId?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isPolling: boolean;

  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  startPolling: (endpoint?: string) => void;
  stopPolling: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isPolling: false,

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

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  startPolling: (endpoint) => {
    const { isPolling } = get();
    if (isPolling) return;
    set({ isPolling: true });

    const unsub = realtime.subscribe("notifications", "*", (msg: RealtimeMessage) => {
      if (msg.event === "notification" && msg.data) {
        const notif = msg.data as Notification;
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
