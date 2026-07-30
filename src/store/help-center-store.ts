"use client";

import { create } from "zustand";

interface HelpCenterState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useHelpCenterStore = create<HelpCenterState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
