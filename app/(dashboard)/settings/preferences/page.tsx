"use client";

import { useEffect, useState } from "react";
import {
  Settings2,
  Globe,
  Shield,
  Database,
  Clock,
  ChevronDown,
  Save,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { useToast } from "@/src/components/ui/use-toast";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useSettingsSection } from "@/src/hooks/use-settings-section";
import { applySessionTimeoutFromSettings, normalizeSessionTimeout } from "@/src/lib/sync-session-timeout";
import { useSessionSettingsStore } from "@/src/store/session-settings-store";
import type { AccentColor, FontSize } from "@/src/types/platform-settings";

// --- Constants ---
const SECTIONS = [
  {
    id: "general",
    title: "General",
    description: "Session timeout and basic app preferences",
    icon: Settings2,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "regional",
    title: "Regional",
    description: "Timezone, date format, and locale settings",
    icon: Globe,
    color:
      "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    id: "security",
    title: "Security",
    description: "Password, session management, and access controls",
    icon: Shield,
    color:
      "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    id: "backup",
    title: "Backup & Restore",
    description: "Data backup, export, and restore options",
    icon: Database,
    color:
      "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
  },
];

const TIMEOUT_OPTIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
  { value: "0", label: "Never" },
];

const ACCENT_COLORS: {
  value: AccentColor;
  label: string;
  swatch: string;
}[] = [
  { value: "blue", label: "Blue", swatch: "bg-blue-600" },
  { value: "purple", label: "Purple", swatch: "bg-purple-600" },
  { value: "emerald", label: "Emerald", swatch: "bg-emerald-600" },
  { value: "amber", label: "Amber", swatch: "bg-amber-500" },
  { value: "rose", label: "Rose", swatch: "bg-rose-600" },
];

const FONT_SIZES: { value: FontSize; label: string; preview: string }[] = [
  { value: "small", label: "Small", preview: "text-sm" },
  { value: "medium", label: "Medium", preview: "text-base" },
  { value: "large", label: "Large", preview: "text-lg" },
];

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const LOCALES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
];

// --- Preference Section Component ---
function PreferenceSection({
  id,
  title,
  description,
  icon: Icon,
  color,
  children,
}: (typeof SECTIONS)[number] & { children: React.ReactNode }) {
  return (
    <Card id={id}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// --- Main Page Component ---
export default function SettingsPreferencesPage() {
  const { toast } = useToast();

  const general = useSettingsSection("general");
  const regional = useSettingsSection("regional");
  const session = useSettingsSection("session");
  const backup = useSettingsSection("backup");
  const setSessionTimeout = useSessionSettingsStore((s) => s.setInactivityTimeout);

  const [localTimeout, setLocalTimeout] = useState("60");
  const [localAccentColor, setLocalAccentColor] = useState<AccentColor>("blue");
  const [localFontSize, setLocalFontSize] = useState<FontSize>("medium");
  const [timezone, setTimezone] = useState("America/New_York");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [locale, setLocale] = useState("en-US");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");

  useEffect(() => {
    if (session.data) {
      setLocalTimeout(String(session.data.inactivityTimeoutMinutes ?? 30));
    } else if (general.data) {
      setLocalTimeout(String(general.data.inactivityTimeoutMinutes ?? 30));
    }
    if (general.data) {
      setLocalAccentColor((general.data.accentColor as AccentColor) ?? "blue");
      setLocalFontSize((general.data.fontSize as FontSize) ?? "medium");
    }
  }, [general.data, session.data, general.settingsVersion, session.settingsVersion]);

  useEffect(() => {
    if (regional.data) {
      setTimezone((regional.data.timezone as string) ?? "America/New_York");
      setDateFormat((regional.data.dateFormat as string) ?? "MM/DD/YYYY");
      setLocale((regional.data.locale as string) ?? "en-US");
    }
  }, [regional.data, regional.settingsVersion]);

  useEffect(() => {
    if (backup.data) {
      setAutoBackupEnabled(Boolean(backup.data.autoBackupEnabled ?? true));
      setBackupFrequency(String(backup.data.backupFrequency ?? "daily"));
    }
  }, [backup.data, backup.settingsVersion]);

  const handleSaveAll = async () => {
    const timeoutMinutes = normalizeSessionTimeout(Number(localTimeout));
    const [gOk, rOk, sOk, bOk] = await Promise.all([
      general.saveSection({
        accentColor: localAccentColor,
        fontSize: localFontSize,
      }),
      regional.saveSection({
        timezone,
        dateFormat,
        locale,
      }),
      session.saveSection({
        inactivityTimeoutMinutes: timeoutMinutes,
      }),
      backup.saveSection({
        autoBackupEnabled,
        backupFrequency,
      }),
    ]);

    if (sOk) {
      setSessionTimeout(timeoutMinutes);
      applySessionTimeoutFromSettings({ inactivityTimeoutMinutes: timeoutMinutes });
    }

    if (gOk && rOk && sOk && bOk) {
      toast({
        title: "Preferences saved",
        description: "All preferences have been updated and synced.",
      });
    }
  };

  const handleReset = () => {
    if (session.data) {
      setLocalTimeout(String(session.data.inactivityTimeoutMinutes ?? 30));
    }
    if (general.data) {
      setLocalAccentColor((general.data.accentColor as AccentColor) ?? "blue");
      setLocalFontSize((general.data.fontSize as FontSize) ?? "medium");
    }
    if (regional.data) {
      setTimezone((regional.data.timezone as string) ?? "America/New_York");
      setDateFormat((regional.data.dateFormat as string) ?? "MM/DD/YYYY");
      setLocale((regional.data.locale as string) ?? "en-US");
    }
    if (backup.data) {
      setAutoBackupEnabled(Boolean(backup.data.autoBackupEnabled ?? true));
      setBackupFrequency(String(backup.data.backupFrequency ?? "daily"));
    }
  };

  if (general.isLoading || regional.isLoading || session.isLoading || backup.isLoading) {
    return <SettingsPageSkeleton />;
  }

  if (general.error || regional.error || session.error || backup.error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-destructive">
          {general.error || regional.error || session.error || backup.error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* --- Page Header --- */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            System Preferences
          </h1>
          <p className="text-muted-foreground">
            Configure all system-wide preferences and settings in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSaveAll}>
            <Save className="h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* --- Navigation Cards --- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            className="rounded-lg border bg-card p-4 cursor-pointer hover:shadow-md hover:border-foreground/20 transition-all"
            onClick={() => {
              document.getElementById(section.id)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${section.color}`}
              >
                <section.icon className="h-5 w-5" />
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="mt-3 font-medium">{section.title}</h3>
            <p className="text-sm text-muted-foreground">
              {section.description}
            </p>
          </div>
        ))}
      </div>

      {/* --- General Settings --- */}
      <PreferenceSection
        id="general"
        title="General"
        description="Session timeout and basic app preferences"
        icon={Settings2}
        color="text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Session Timeout</Label>
            <Select
              value={localTimeout}
              onValueChange={(v) => setLocalTimeout(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeout" />
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </SelectTrigger>
              <SelectContent>
                {TIMEOUT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Inactive users are automatically signed out after this period
            </p>
          </div>
          <div className="space-y-2">
            <Label>Default View</Label>
            <Select defaultValue="dashboard">
              <SelectTrigger>
                <SelectValue placeholder="Select view" />
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PreferenceSection>

      {/* --- Regional Settings --- */}
      <PreferenceSection
        id="regional"
        title="Regional"
        description="Timezone, date format, and locale settings"
        icon={Globe}
        color="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMATS.map((fmt) => (
                  <SelectItem key={fmt.value} value={fmt.value}>
                    {fmt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Locale</Label>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger>
                <SelectValue placeholder="Select locale" />
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </SelectTrigger>
              <SelectContent>
                {LOCALES.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PreferenceSection>

      {/* --- Backup & Restore --- */}
      <PreferenceSection
        id="backup"
        title="Backup & Restore"
        description="Data backup, export, and restore options"
        icon={Database}
        color="text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline">
              <Database className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline">
              <RotateCcw className="h-4 w-4" />
              Restore Backup
            </Button>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Automatic Backups</p>
                <p className="text-sm text-muted-foreground">
                  {backup.data?.lastBackupAt
                    ? `Last backup: ${new Date(String(backup.data.lastBackupAt)).toLocaleString()}`
                    : "Automatic backups will run based on your schedule"}
                </p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <Label htmlFor="autoBackup">
                    Enable automatic backups
                  </Label>
                  <Switch
                    id="autoBackup"
                    checked={autoBackupEnabled}
                    onCheckedChange={setAutoBackupEnabled}
                  />
                </div>
                <div className="mt-3 space-y-2">
                  <Label>Backup frequency</Label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PreferenceSection>
    </div>
  );
}
