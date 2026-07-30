"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useUserAppearanceStore } from "@/src/store/user-appearance-store";
import { useTheme, type ThemeMode } from "@/src/context/theme-context";
import { useToast } from "@/src/components/ui/use-toast";
import type { AccentColor, FontFamily, FontSize } from "@/src/types/platform-settings";

export function useAppearanceSettings() {
  const { toast } = useToast();
  const { setMode } = useTheme();

  const appearance = useUserAppearanceStore((s) => s.appearance);
  const savedAppearance = useUserAppearanceStore((s) => s.savedAppearance);
  const isLoading = useUserAppearanceStore((s) => s.isLoading);
  const isSaving = useUserAppearanceStore((s) => s.isSaving);
  const error = useUserAppearanceStore((s) => s.error);
  const hydrated = useUserAppearanceStore((s) => s.hydrated);
  const previewAppearance = useUserAppearanceStore((s) => s.previewAppearance);
  const saveAppearance = useUserAppearanceStore((s) => s.saveAppearance);
  const resetDraft = useUserAppearanceStore((s) => s.resetDraft);
  const fetchAppearance = useUserAppearanceStore((s) => s.fetchAppearance);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!hydrated || initializedRef.current) return;
    initializedRef.current = true;
    fetchAppearance(true);
  }, [hydrated, fetchAppearance]);

  const hasChanges = useMemo(
    () =>
      appearance.theme !== savedAppearance.theme ||
      appearance.accentColor !== savedAppearance.accentColor ||
      appearance.fontSize !== savedAppearance.fontSize ||
      appearance.fontFamily !== savedAppearance.fontFamily ||
      appearance.compactNav !== savedAppearance.compactNav,
    [appearance, savedAppearance],
  );

  const setTheme = useCallback(
    (theme: ThemeMode) => {
      previewAppearance({ theme });
      setMode(theme);
    },
    [previewAppearance, setMode],
  );

  const setAccentColor = useCallback(
    (accentColor: AccentColor) => previewAppearance({ accentColor }),
    [previewAppearance],
  );

  const setFontSize = useCallback(
    (fontSize: FontSize) => previewAppearance({ fontSize }),
    [previewAppearance],
  );

  const setFontFamily = useCallback(
    (fontFamily: FontFamily) => previewAppearance({ fontFamily }),
    [previewAppearance],
  );

  const setCompactNav = useCallback(
    (compactNav: boolean) => previewAppearance({ compactNav }),
    [previewAppearance],
  );

  const save = useCallback(async () => {
    const success = await saveAppearance();
    if (success) {
      toast({
        title: "Preferences saved",
        description: "Your appearance settings are synced and will persist across devices.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save appearance settings. Please try again.",
        variant: "destructive",
      });
    }
    return success;
  }, [saveAppearance, toast]);

  const reset = useCallback(() => {
    resetDraft();
    setMode(savedAppearance.theme);
    toast({
      title: "Changes discarded",
      description: "Appearance settings reverted to your last saved preferences.",
    });
  }, [resetDraft, savedAppearance.theme, setMode, toast]);

  return {
    appearance,
    isLoading: isLoading && !initializedRef.current,
    isSaving,
    error,
    hasChanges,
    setTheme,
    setAccentColor,
    setFontSize,
    setFontFamily,
    setCompactNav,
    save,
    reset,
  };
}
