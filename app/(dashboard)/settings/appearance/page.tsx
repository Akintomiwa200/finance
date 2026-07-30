"use client";

import { Moon, Sun, Monitor, Palette, Type, TextQuote, Check, AlignLeft, Save, RotateCcw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useAppearanceSettings } from "@/src/hooks/use-appearance-settings";
import type { ThemeMode } from "@/src/context/theme-context";
import type { AccentColor, FontSize, FontFamily } from "@/src/types/platform-settings";

const ACCENT_OPTIONS: { value: AccentColor; label: string; swatch: string }[] = [
  { value: "blue", label: "Blue", swatch: "bg-blue-600" },
  { value: "purple", label: "Purple", swatch: "bg-purple-600" },
  { value: "emerald", label: "Emerald", swatch: "bg-emerald-600" },
  { value: "amber", label: "Amber", swatch: "bg-amber-500" },
  { value: "rose", label: "Rose", swatch: "bg-rose-600" },
];

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const FONT_SIZE_OPTIONS: { value: FontSize; label: string; preview: string }[] = [
  { value: "small", label: "Small", preview: "text-sm" },
  { value: "medium", label: "Medium", preview: "text-base" },
  { value: "large", label: "Large", preview: "text-lg" },
];

const FONT_FAMILY_OPTIONS: { value: FontFamily; label: string; style: string }[] = [
  { value: "sans", label: "Default Sans", style: "font-sans" },
  { value: "nunito", label: "Nunito Sans", style: "font-nunito" },
  { value: "dm-sans", label: "DM Sans", style: "font-dm-sans" },
  { value: "bricolage", label: "Bricolage Grotesque", style: "font-bricolage" },
];

export default function SettingsAppearancePage() {
  const {
    appearance,
    isLoading,
    isSaving,
    hasChanges,
    setTheme,
    setAccentColor,
    setFontSize,
    setFontFamily,
    setCompactNav,
    save,
    reset,
  } = useAppearanceSettings();

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
          <p className="text-muted-foreground">
            Customize the look and feel. Changes are saved to your account and sync across devices.
          </p>
        </div>
        {hasChanges && (
          <p className="text-sm text-amber-600 dark:text-amber-400">Unsaved changes</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Theme Mode
          </CardTitle>
          <CardDescription>Choose between light, dark, or system theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  appearance.theme === value
                    ? "border-brand-600 bg-brand-50 text-brand-700 shadow-sm dark:bg-accent-100 dark:text-accent-700"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Accent Color
          </CardTitle>
          <CardDescription>Choose a brand accent color for the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {ACCENT_OPTIONS.map((accent) => (
              <button
                key={accent.value}
                type="button"
                onClick={() => setAccentColor(accent.value)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                  appearance.accentColor === accent.value
                    ? "border-foreground ring-2 ring-brand-500/30"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <span className={`h-4 w-4 rounded-full ${accent.swatch}`} />
                {accent.label}
                {appearance.accentColor === accent.value && (
                  <Check className="h-3.5 w-3.5" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Font Size
          </CardTitle>
          <CardDescription>Adjust the base font size across the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFontSize(opt.value)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 font-medium transition-all ${
                  appearance.fontSize === opt.value
                    ? "border-brand-600 bg-brand-50 text-brand-700 shadow-sm dark:bg-accent-100 dark:text-accent-700"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${opt.preview}`}
              >
                <AlignLeft className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TextQuote className="h-4 w-4" />
            Font Family
          </CardTitle>
          <CardDescription>Choose the primary font for the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FONT_FAMILY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFontFamily(opt.value)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all ${
                  appearance.fontFamily === opt.value
                    ? "border-brand-600 bg-brand-50 text-brand-700 shadow-sm dark:bg-accent-100 dark:text-accent-700"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${opt.style}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
          <CardDescription>Adjust the sidebar density</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="compact-nav">Compact sidebar navigation</Label>
              <p className="text-sm text-muted-foreground">Tighter spacing for a denser layout</p>
            </div>
            <Switch
              id="compact-nav"
              checked={appearance.compactNav}
              onCheckedChange={setCompactNav}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={reset} disabled={!hasChanges || isSaving}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={save} disabled={!hasChanges || isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
