"use client";

import { useToast as useAppToast } from "@/src/components/ui/toast";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const { addToast } = useAppToast();

  const toast = ({ title, description, variant }: ToastOptions) => {
    addToast({
      title: title ?? "",
      message: description,
      type: variant === "destructive" ? "error" : "success",
    });
  };

  return { toast, addToast };
}
