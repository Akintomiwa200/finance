"use client";

import { useCallback } from "react";
import { useToast as useAppToast } from "@/src/components/ui/toast";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const { addToast } = useAppToast();

  const toast = useCallback(
    ({ title, description, variant }: ToastOptions) => {
      addToast({
        title: title ?? "",
        message: description,
        type: variant === "destructive" ? "error" : "success",
      });
    },
    [addToast],
  );

  return { toast, addToast };
}
