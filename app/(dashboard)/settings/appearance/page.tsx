"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor, Palette, Type, TextQuote, Check, AlignLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { useToast } from "@/src/components/ui/use-toast";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useTheme, type ThemeMode } from "@/src/context/theme-context";
import { usePlatformSettingsStore } from "@/src/store/platform-settings-store";
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
  const [loading, setLoading] = useState(true);
  const { mode, setMode } = useTheme();
  const accentColor = usePlatformSettingsStore((s) => s.accentColor);
  const compactNav = usePlatformSettingsStore((s) => s.compactNav);
  const fontSize = usePlatformSettingsStore((s) => s.fontSize);
  const fontFamily = usePlatformSettingsStore((s) => s.fontFamily);
  const setSettings = usePlatformSettingsStore((s) => s.setSettings);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SettingsPageSkeleton />;

  function handleThemeChange(value: ThemeMode) {
    setMode(value);
  }

  function handleAccentChange(value: AccentColor) {
    setSettings({ accentColor: value });
  }

  function handleCompactNavChange(checked: boolean) {
    setSettings({ compactNav: checked });
  }

  function handleFontSizeChange(value: FontSize) {
    setSettings({ fontSize: value });
  }

  function handleFontFamilyChange(value: FontFamily) {
    setSettings({ fontFamily: value });
  }

  function handleSave() {
    toast({
      title: "Preferences saved",
      description: "Your appearance settings have been updated.",
    });
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
        <p className="text-muted-foreground">Customize the look and feel of the application</p>
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
                onClick={() => handleThemeChange(value)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  mode === value
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
                onClick={() => handleAccentChange(accent.value)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                  accentColor === accent.value
                    ? "border-foreground ring-2 ring-brand-500/30"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <span className={`h-4 w-4 rounded-full ${accent.swatch}`} />
                {accent.label}
                {accentColor === accent.value && (
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
                onClick={() => handleFontSizeChange(opt.value)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 font-medium transition-all ${
                  fontSize === opt.value
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
                onClick={() => handleFontFamilyChange(opt.value)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all ${
                  fontFamily === opt.value
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
              checked={compactNav}
              onCheckedChange={handleCompactNavChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  );
}
