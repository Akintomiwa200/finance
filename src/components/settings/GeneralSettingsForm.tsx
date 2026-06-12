"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, Sun, Moon, Monitor, Palette } from "lucide-react";
import { AdminSettingsFormSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { Button } from "@/src/components/ui/button";
import { SettingsSection } from "@/src/components/admin/settings-shared";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { Separator } from "@/src/components/ui/separator";
import { useToast } from "@/src/components/ui/toast";
import { useTheme, type ThemeMode } from "@/src/context/theme-context";
import { usePlatformSettingsStore } from "@/src/store/platform-settings-store";
import { api } from "@/src/lib/api";
import type { PlatformGeneralSettings, AccentColor } from "@/src/types/platform-settings";
import { cn } from "@/src/lib/utils";

const generalSettingsSchema = z.object({
  platformName: z.string().min(2, "Platform name must be at least 2 characters").max(50),
  supportEmail: z.string().email("Please enter a valid email address"),
  defaultCurrency: z.string().min(1, "Currency is required"),
  theme: z.enum(["light", "dark", "system"]),
  accentColor: z.enum(["blue", "purple", "emerald", "amber", "rose"]),
  timezone: z.string().min(1, "Timezone is required"),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]),
  compactNav: z.boolean(),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;

const CURRENCIES = [
  { value: "NGN", label: "NGN — Nigerian Naira (₦)" },
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "EUR", label: "EUR — Euro (€)" },
  { value: "GBP", label: "GBP — British Pound (£)" },
  { value: "GHS", label: "GHS — Ghanaian Cedi (₵)" },
  { value: "KES", label: "KES — Kenyan Shilling (KSh)" },
  { value: "ZAR", label: "ZAR — South African Rand (R)" },
];

const TIMEZONES = [
  { value: "Africa/Lagos", label: "West Africa (Lagos)" },
  { value: "Africa/Accra", label: "Ghana (Accra)" },
  { value: "Africa/Nairobi", label: "East Africa (Nairobi)" },
  { value: "Africa/Johannesburg", label: "South Africa (Johannesburg)" },
  { value: "Europe/London", label: "UK (London)" },
  { value: "America/New_York", label: "US Eastern" },
  { value: "UTC", label: "UTC" },
];

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

export function GeneralSettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();
  const { mode } = useTheme();
  const setPlatformSettings = usePlatformSettingsStore((s) => s.setSettings);
  const storeSettings = usePlatformSettingsStore();

  const form = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      platformName: storeSettings.platformName,
      supportEmail: storeSettings.supportEmail,
      defaultCurrency: storeSettings.defaultCurrency,
      theme: storeSettings.theme ?? mode,
      accentColor: storeSettings.accentColor,
      timezone: storeSettings.timezone,
      dateFormat: storeSettings.dateFormat,
      compactNav: storeSettings.compactNav,
    },
  });

  const { reset, watch, setValue, handleSubmit } = form;
  const watchedTheme = watch("theme");
  const watchedAccent = watch("accentColor");
  const watchedCompact = watch("compactNav");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await api.get<PlatformGeneralSettings>("/api/admin/settings/general");
        if (result.success && result.data) {
          reset(result.data);
          setPlatformSettings(result.data);
        } else {
          reset({
            platformName: storeSettings.platformName,
            supportEmail: storeSettings.supportEmail,
            defaultCurrency: storeSettings.defaultCurrency,
            theme: storeSettings.theme,
            accentColor: storeSettings.accentColor,
            timezone: storeSettings.timezone,
            dateFormat: storeSettings.dateFormat,
            compactNav: storeSettings.compactNav,
          });
        }
      } catch {
        addToast({ title: "Failed to load settings", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading) return;
    setPlatformSettings({
      theme: watchedTheme,
      accentColor: watchedAccent,
      compactNav: watchedCompact,
    });
    // Only sync live appearance fields while the form is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTheme, watchedAccent, watchedCompact, isLoading]);

  const onSubmit = async (data: GeneralSettingsValues) => {
    setIsSaving(true);
    try {
      const result = await api.patch<PlatformGeneralSettings>(
        "/api/admin/settings/general",
        data,
      );
      if (!result.success || !result.data) {
        throw new Error(result.error ?? "Failed to save settings");
      }
      setPlatformSettings(result.data);
      addToast({
        title: "Settings saved",
        message: "Platform configuration has been updated.",
        type: "success",
      });
    } catch (error) {
      addToast({
        title: "Failed to save settings",
        message: error instanceof Error ? error.message : "Please try again later",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminSettingsFormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <SettingsSection
        title="Platform Identity"
        description="Configure how your platform is identified across the system"
      >
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="platformName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., FaaS Platform" {...field} />
                </FormControl>
                <FormDescription>Shown in sidebars, emails, and notifications</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="support@yourdomain.com" {...field} />
                </FormControl>
                <FormDescription>Contact address for platform-related issues</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultCurrency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Currency</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Appearance & Personalization"
        description="Theme and accent changes apply instantly across the admin console"
      >
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          field.onChange(value);
                          setValue("theme", value, { shouldDirty: true });
                        }}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                          field.value === value
                            ? "border-brand-600 bg-brand-50 text-brand-700 shadow-sm dark:bg-accent-100 dark:text-accent-700"
                            : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  Tailwind dark mode updates in real time — no reload needed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="accentColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Accent Color
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_OPTIONS.map((accent) => (
                      <button
                        key={accent.value}
                        type="button"
                        onClick={() => {
                          field.onChange(accent.value);
                          setValue("accentColor", accent.value, { shouldDirty: true });
                        }}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                          field.value === accent.value
                            ? "border-foreground ring-2 ring-brand-500/30"
                            : "border-border hover:border-muted-foreground",
                        )}
                      >
                        <span className={cn("h-4 w-4 rounded-full", accent.swatch)} />
                        {accent.label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="compactNav"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-4">
                <div>
                  <FormLabel>Compact sidebar navigation</FormLabel>
                  <FormDescription>Tighter spacing for dense admin workflows</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Regional Preferences"
        description="Timezone and date display for reports and logs"
      >
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Format</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </SettingsSection>

      <div className="flex justify-end">
        <Button type="submit" loading={isSaving} className="min-w-[140px]">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
      </form>
    </Form>
  );
}
