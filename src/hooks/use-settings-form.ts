"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSettingsSection } from "@/src/hooks/use-settings-section";

export function useSettingsForm<T extends Record<string, unknown>>(
  section: string,
  mapFromApi: (data: Record<string, unknown> | null) => T,
  emptyState: T,
) {
  const { data, isLoading, isSaving, error, saveSection, settingsVersion, org } =
    useSettingsSection(section);

  const [form, setForm] = useState<T>(emptyState);
  const snapshotRef = useRef<T>(emptyState);
  const initializedRef = useRef(false);
  const dirtyRef = useRef(false);

  const hydrate = useCallback(
    (source?: Record<string, unknown> | null) => {
      const mapped = mapFromApi(source ?? data);
      setForm(mapped);
      snapshotRef.current = mapped;
    },
    [data, mapFromApi],
  );

  useEffect(() => {
    if (isLoading || !data) return;

    if (!initializedRef.current) {
      hydrate(data);
      initializedRef.current = true;
      dirtyRef.current = false;
      return;
    }

    if (!dirtyRef.current) {
      hydrate(data);
    }
  }, [isLoading, data, settingsVersion, hydrate]);

  const updateForm = useCallback((patch: Partial<T> | ((prev: T) => T)) => {
    dirtyRef.current = true;
    setForm((prev) =>
      typeof patch === "function" ? patch(prev) : { ...prev, ...patch },
    );
  }, []);

  const hasChanges =
    initializedRef.current &&
    JSON.stringify(form) !== JSON.stringify(snapshotRef.current);

  const save = useCallback(
    async (payload?: Partial<T>, extra?: Record<string, unknown>) => {
      const body = { ...form, ...payload };
      const success = await saveSection(body as Record<string, unknown>, extra);
      if (success) {
        snapshotRef.current = body as T;
        dirtyRef.current = false;
      }
      return success;
    },
    [form, saveSection],
  );

  const reset = useCallback(() => {
    setForm(snapshotRef.current);
    dirtyRef.current = false;
  }, []);

  return {
    form,
    setForm: updateForm,
    data,
    org,
    isLoading: isLoading && !initializedRef.current,
    isSaving,
    error,
    hasChanges,
    save,
    reset,
    markDirty: () => {
      dirtyRef.current = true;
    },
  };
}
