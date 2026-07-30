"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSettingsSection } from "@/src/hooks/use-settings-section";

export function useSectionState<T extends Record<string, unknown>>(
  section: string,
  mapFromApi: (data: Record<string, unknown> | null) => T,
  defaults: T,
) {
  const {
    data,
    org,
    isLoading,
    isSaving,
    error,
    settingsVersion,
    saveSection,
    refresh,
  } = useSettingsSection(section);

  const [form, setFormState] = useState<T>(defaults);
  const dirtyRef = useRef(false);
  const initializedRef = useRef(false);

  const savedForm = useMemo(
    () => mapFromApi(data),
    [data, mapFromApi],
  );

  useEffect(() => {
    if (isLoading || !data) return;

    if (!initializedRef.current || !dirtyRef.current) {
      setFormState(mapFromApi(data));
      initializedRef.current = true;
    }
  }, [isLoading, data, settingsVersion, mapFromApi]);

  const setForm = useCallback((patch: Partial<T> | ((prev: T) => T)) => {
    dirtyRef.current = true;
    setFormState((prev) =>
      typeof patch === "function" ? patch(prev) : { ...prev, ...patch },
    );
  }, []);

  const hasChanges = useMemo(
    () => initializedRef.current && JSON.stringify(form) !== JSON.stringify(savedForm),
    [form, savedForm],
  );

  const save = useCallback(
    async (patch?: Partial<T>, extra?: Record<string, unknown>) => {
      const payload = { ...form, ...patch } as Record<string, unknown>;
      const success = await saveSection(payload, extra);
      if (success) {
        dirtyRef.current = false;
      }
      return success;
    },
    [form, saveSection],
  );

  const reset = useCallback(() => {
    setFormState(savedForm);
    dirtyRef.current = false;
  }, [savedForm]);

  const savePartial = useCallback(
    async (patch: Partial<T>, extra?: Record<string, unknown>) => {
      const payload = { ...savedForm, ...patch } as Record<string, unknown>;
      const success = await saveSection(payload, extra);
      if (success) {
        dirtyRef.current = false;
        setFormState((prev) => ({ ...prev, ...patch }));
      }
      return success;
    },
    [savedForm, saveSection],
  );

  return {
    form,
    setForm,
    setFormState,
    savedForm,
    data,
    org,
    isLoading: isLoading && !initializedRef.current,
    isSaving,
    error,
    hasChanges,
    settingsVersion,
    save,
    savePartial,
    reset,
    refresh,
    markDirty: () => {
      dirtyRef.current = true;
    },
  };
}
