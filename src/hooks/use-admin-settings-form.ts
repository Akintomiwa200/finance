"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DefaultValues, FieldValues, UseFormReturn } from "react-hook-form";
import { api } from "@/src/lib/api";
import { useToast } from "@/src/components/ui/use-toast";

export function useAdminSettingsForm<T extends FieldValues>({
  endpoint,
  form,
  defaults,
  saveMessage = "Settings saved successfully.",
}: {
  endpoint: string;
  form: UseFormReturn<T>;
  defaults: DefaultValues<T>;
  saveMessage?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const toastRef = useRef(toast);
  const saveMessageRef = useRef(saveMessage);

  toastRef.current = toast;
  saveMessageRef.current = saveMessage;

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.get<T>(endpoint);
      if (result.success && result.data) {
        form.reset(result.data);
      } else {
        form.reset(defaults);
      }
    } catch {
      toastRef.current({ title: "Failed to load settings", variant: "destructive" });
      form.reset(defaults);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, form, defaults]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (data: T) => {
    setIsSaving(true);
    try {
      const result = await api.patch<T>(endpoint, data);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? "Failed to save");
      }
      form.reset(result.data);
      toastRef.current({ title: "Saved", description: saveMessageRef.current });
    } catch (error) {
      toastRef.current({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { isLoading, isSaving, save, reload: load };
}
