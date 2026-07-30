"use client";

import { useEffect, useRef, useState } from "react";
import {
  Settings2,
  Clock,
  Monitor,
  Moon,
  Sun,
  ChevronDown,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Globe,
  Bell,
  Eye,
  EyeOff,
  RefreshCw,
  Palette,
  Type,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { Slider } from "@/src/components/ui/slider";
import { Badge } from "@/src/components/ui/badge";
import { useToast } from "@/src/components/ui/use-toast";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useSettingsSection } from "@/src/hooks/use-settings-section";
import { usePlatformSettingsStore } from "@/src/store/platform-settings-store";
import {
  useSessionSettingsStore,
  type SessionTimeout,
} from "@/src/store/session-settings-store";
import type { AccentColor, FontSize, FontFamily } from "@/src/types/platform-settings";
import type { ThemeMode } from "@/src/context/theme-context";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
];

const ACCENT_COLORS: { value: AccentColor; label: string; swatch: string; ring: string }[] = [
  { value: "blue", label: "Blue", swatch: "bg-blue-600", ring: "ring-blue-600" },
  { value: "purple", label: "Purple", swatch: "bg-purple-600", ring: "ring-purple-600" },
  { value: "emerald", label: "Emerald", swatch: "bg-emerald-600", ring: "ring-emerald-600" },
  { value: "amber", label: "Amber", swatch: "bg-amber-500", ring: "ring-amber-500" },
  { value: "rose", label: "Rose", swatch: "bg-rose-600", ring: "ring-rose-600" },
];

const FONT_SIZES: { value: FontSize; label: string; preview: string; size: number }[] = [
  { value: "small", label: "Small", preview: "text-sm", size: 14 },
  { value: "medium", label: "Medium", preview: "text-base", size: 16 },
  { value: "large", label: "Large", preview: "text-lg", size: 18 },
];

const FONT_FAMILIES: { value: FontFamily; label: string; sample: string }[] = [
  { value: "sans", label: "Default Sans", sample: "font-sans" },
  { value: "nunito", label: "Nunito", sample: "font-['Nunito',sans-serif]" },
  { value: "bricolage", label: "Bricolage", sample: "font-['Bricolage',sans-serif]" },
  { value: "dm-sans", label: "DM Sans", sample: "font-['DM_Sans',sans-serif]" },
];

const TIMEOUT_OPTIONS = [
  { value: "5", label: "5 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "240", label: "4 hours" },
  { value: "0", label: "Never" },
];

const DEFAULT_VIEWS = [
  { value: "dashboard", label: "Dashboard" },
  { value: "projects", label: "Projects" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports" },
  { value: "calendar", label: "Calendar" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SettingSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingSection({ title, description, icon, children }: SettingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: AccentColor;
  onChange: (v: AccentColor) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {ACCENT_COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          className={`relative h-10 w-10 rounded-full ${c.swatch} transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${
            value === c.value
              ? `ring-2 ring-offset-2 ring-offset-background ${c.ring}`
              : "ring-0"
          }`}
          aria-label={`Select ${c.label} accent color`}
        >
          {value === c.value && (
            <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-sm">
              <Check className="h-5 w-5" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pick<T>(data: Record<string, unknown> | null, key: string, fallback: T): T {
  if (!data || data[key] === undefined || data[key] === null) return fallback;
  return data[key] as T;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function GeneralSettingsPage() {
  const { toast } = useToast();

  const {
    data: generalData,
    isLoading: generalLoading,
    error: generalError,
    saveSection: saveGeneral,
  } = useSettingsSection("general");

  const {
    data: sessionData,
    isLoading: sessionLoading,
    error: sessionError,
    saveSection: saveSession,
  } = useSettingsSection("session");

  const isLoading = generalLoading || sessionLoading;
  const error = generalError || sessionError;

  const platformSetSettings = usePlatformSettingsStore((s) => s.setSettings);
  const sessionSetInactivityTimeout = useSessionSettingsStore(
    (s) => s.setInactivityTimeout,
  );

  // --- Local form state (defaults match the stated defaults) ---
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [accentColor, setAccentColor] = useState<AccentColor>("rose");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
  const [compactNav, setCompactNav] = useState(false);
  const [defaultView, setDefaultView] = useState("dashboard");
  const [autoSave, setAutoSave] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inactivityTimeout, setInactivityTimeout] = useState("30");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initializedRef = useRef(false);

  // --- Hydrate from API data once loading completes ---
  useEffect(() => {
    if (isLoading) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    // General section
    if (generalData) {
      setTheme(pick(generalData, "theme", "system"));
      setAccentColor(pick(generalData, "accentColor", "rose"));
      setFontSize(pick(generalData, "fontSize", "medium"));
      setFontFamily(pick(generalData, "fontFamily", "sans"));
      setCompactNav(pick(generalData, "compactNav", false));
      setDefaultView(pick(generalData, "defaultView", "dashboard"));
      setAutoSave(pick(generalData, "autoSave", true));
      setAnimationsEnabled(pick(generalData, "animationsEnabled", true));
      setReducedMotion(pick(generalData, "reducedMotion", false));
      setNotificationsEnabled(pick(generalData, "notificationsEnabled", true));
      setDesktopNotifications(pick(generalData, "desktopNotifications", false));
      setSoundEnabled(pick(generalData, "soundEnabled", true));
      setDebugMode(pick(generalData, "debugMode", false));
    }

    // Session section
    if (sessionData) {
      setInactivityTimeout(
        String(pick(sessionData, "inactivityTimeoutMinutes", 30)),
      );
    }
  }, [isLoading, generalData, sessionData]);

  // --- Snapshot of API-saved data for change detection ---
  const savedRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    if (!initializedRef.current) return;
    savedRef.current = {
      theme: pick(generalData, "theme", "system"),
      accentColor: pick(generalData, "accentColor", "rose"),
      fontSize: pick(generalData, "fontSize", "medium"),
      fontFamily: pick(generalData, "fontFamily", "sans"),
      compactNav: pick(generalData, "compactNav", false),
      defaultView: pick(generalData, "defaultView", "dashboard"),
      autoSave: pick(generalData, "autoSave", true),
      animationsEnabled: pick(generalData, "animationsEnabled", true),
      reducedMotion: pick(generalData, "reducedMotion", false),
      notificationsEnabled: pick(generalData, "notificationsEnabled", true),
      desktopNotifications: pick(generalData, "desktopNotifications", false),
      soundEnabled: pick(generalData, "soundEnabled", true),
      debugMode: pick(generalData, "debugMode", false),
      inactivityTimeoutMinutes: String(
        pick(sessionData, "inactivityTimeoutMinutes", 30),
      ),
    };
  }, [generalData, sessionData]);

  const hasChanges =
    initializedRef.current &&
    (theme !== savedRef.current.theme ||
      accentColor !== savedRef.current.accentColor ||
      fontSize !== savedRef.current.fontSize ||
      fontFamily !== savedRef.current.fontFamily ||
      compactNav !== savedRef.current.compactNav ||
      defaultView !== savedRef.current.defaultView ||
      autoSave !== savedRef.current.autoSave ||
      animationsEnabled !== savedRef.current.animationsEnabled ||
      reducedMotion !== savedRef.current.reducedMotion ||
      notificationsEnabled !== savedRef.current.notificationsEnabled ||
      desktopNotifications !== savedRef.current.desktopNotifications ||
      soundEnabled !== savedRef.current.soundEnabled ||
      debugMode !== savedRef.current.debugMode ||
      inactivityTimeout !== savedRef.current.inactivityTimeoutMinutes);

  // --- Save ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const [generalOk, sessionOk] = await Promise.all([
        saveGeneral({
          theme,
          accentColor,
          fontSize,
          fontFamily,
          compactNav,
          defaultView,
          autoSave,
          animationsEnabled,
          reducedMotion,
          notificationsEnabled,
          desktopNotifications,
          soundEnabled,
          debugMode,
        }),
        saveSession({
          inactivityTimeoutMinutes: Number(inactivityTimeout),
        }),
      ]);

      if (generalOk) {
        platformSetSettings({ theme, accentColor, fontSize, fontFamily, compactNav });
      }
      if (sessionOk) {
        sessionSetInactivityTimeout(Number(inactivityTimeout) as SessionTimeout);
      }

      if (generalOk && sessionOk) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated.",
        });
      }
    } catch {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Reset ---
  const handleReset = () => {
    setTheme(pick(generalData, "theme", "system"));
    setAccentColor(pick(generalData, "accentColor", "rose"));
    setFontSize(pick(generalData, "fontSize", "medium"));
    setFontFamily(pick(generalData, "fontFamily", "sans"));
    setCompactNav(pick(generalData, "compactNav", false));
    setDefaultView(pick(generalData, "defaultView", "dashboard"));
    setAutoSave(pick(generalData, "autoSave", true));
    setAnimationsEnabled(pick(generalData, "animationsEnabled", true));
    setReducedMotion(pick(generalData, "reducedMotion", false));
    setNotificationsEnabled(pick(generalData, "notificationsEnabled", true));
    setDesktopNotifications(pick(generalData, "desktopNotifications", false));
    setSoundEnabled(pick(generalData, "soundEnabled", true));
    setDebugMode(pick(generalData, "debugMode", false));
    setInactivityTimeout(
      String(pick(sessionData, "inactivityTimeoutMinutes", 30)),
    );
    setShowAdvanced(false);
    toast({
      title: "Settings reverted",
      description: "All changes have been reverted to saved values.",
    });
  };

  // --- Loading / Error ---
  if (isLoading && !initializedRef.current) return <SettingsPageSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load settings</h2>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          There was a problem fetching your settings. Please try refreshing the
          page.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const timeoutLabel = TIMEOUT_OPTIONS.find((o) => o.value === inactivityTimeout)?.label ?? inactivityTimeout;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings2 className="h-8 w-8 text-primary" />
            General Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your application appearance, behavior, and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Unsaved-changes banner */}
      {hasChanges && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-600/20 bg-yellow-50 dark:bg-yellow-950/30 p-4 text-sm text-yellow-800 dark:text-yellow-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          You have unsaved changes. Don&apos;t forget to save your preferences.
        </div>
      )}

      {/* ── Appearance ─────────────────────────────────────────────── */}
      <SettingSection
        title="Appearance"
        description="Customize the look and feel of the application"
        icon={<Palette className="h-5 w-5" />}
      >
        <div className="space-y-6">
          {/* Theme mode */}
          <div className="space-y-3">
            <Label>Theme Mode</Label>
            <div className="flex gap-2">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-all ${
                    theme === opt.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Accent color */}
          <div className="space-y-3">
            <Label>Accent Color</Label>
            <ColorPicker value={accentColor} onChange={setAccentColor} />
          </div>

          <Separator />

          {/* Font size */}
          <div className="space-y-3">
            <Label>Font Size</Label>
            <div className="flex gap-2">
              {FONT_SIZES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFontSize(opt.value)}
                  className={`flex flex-1 items-center justify-center rounded-lg border px-4 py-2.5 transition-all ${
                    fontSize === opt.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Type className="h-4 w-4 mr-2" />
                  <span className={opt.preview}>{opt.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Current size: {FONT_SIZES.find((f) => f.value === fontSize)?.size}px
            </p>
          </div>

          <Separator />

          {/* Font family */}
          <div className="space-y-3">
            <Label>Font Family</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FONT_FAMILIES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFontFamily(f.value)}
                  className={`rounded-lg border px-4 py-2.5 text-sm transition-all ${
                    fontFamily === f.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <span className={f.sample}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingSection>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <SettingSection
        title="Navigation"
        description="Configure navigation bar behavior"
        icon={<Eye className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="compactNav">Compact navigation</Label>
              <p className="text-xs text-muted-foreground">
                Use a narrower sidebar to maximize content area
              </p>
            </div>
            <Switch
              id="compactNav"
              checked={compactNav}
              onCheckedChange={setCompactNav}
            />
          </div>
        </div>
      </SettingSection>

      {/* ── Language & Regional ────────────────────────────────────── */}
      <SettingSection
        title="Language & Regional"
        description="Set your preferred language and regional settings"
        icon={<Globe className="h-5 w-5" />}
      >
        <div className="space-y-2">
          <Label>Default Landing Page</Label>
          <Select value={defaultView} onValueChange={setDefaultView}>
            <SelectTrigger>
              <SelectValue placeholder="Select view" />
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_VIEWS.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SettingSection>

      {/* ── Session & Security ─────────────────────────────────────── */}
      <SettingSection
        title="Session & Security"
        description="Manage session duration and auto-save behavior"
        icon={<Clock className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Session Timeout</Label>
            <Select value={inactivityTimeout} onValueChange={setInactivityTimeout}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeout duration" />
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </SelectTrigger>
              <SelectContent>
                {TIMEOUT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {inactivityTimeout === "0"
                ? "Session will never expire automatically"
                : `Session will expire after ${timeoutLabel.toLowerCase()}`}
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="autoSave">Auto-save changes</Label>
              <p className="text-xs text-muted-foreground">
                Automatically persist settings as you make changes
              </p>
            </div>
            <Switch id="autoSave" checked={autoSave} onCheckedChange={setAutoSave} />
          </div>
        </div>
      </SettingSection>

      {/* ── Notifications ──────────────────────────────────────────── */}
      <SettingSection
        title="Notifications"
        description="Control how and when you receive notifications"
        icon={<Bell className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive in-app notifications for important events
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="desktopNotifications">Desktop notifications</Label>
              <p className="text-xs text-muted-foreground">
                Show system notifications outside the browser
              </p>
            </div>
            <Switch
              id="desktopNotifications"
              checked={desktopNotifications}
              onCheckedChange={setDesktopNotifications}
              disabled={!notificationsEnabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="sound">Notification sounds</Label>
              <p className="text-xs text-muted-foreground">
                Play a sound when receiving notifications
              </p>
            </div>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              disabled={!notificationsEnabled}
            />
          </div>
        </div>
      </SettingSection>

      {/* ── Accessibility ──────────────────────────────────────────── */}
      <SettingSection
        title="Accessibility"
        description="Accessibility preferences for an inclusive experience"
        icon={<Monitor className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Enable animations</Label>
              <p className="text-xs text-muted-foreground">
                Use smooth transitions and micro-interactions
              </p>
            </div>
            <Switch
              id="animations"
              checked={animationsEnabled}
              onCheckedChange={setAnimationsEnabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="reducedMotion">Reduced motion</Label>
              <p className="text-xs text-muted-foreground">
                Minimize animations for reduced visual motion
              </p>
            </div>
            <Switch
              id="reducedMotion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>

          {reducedMotion && (
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <AlertCircle className="inline-block h-4 w-4 mr-1" />
              Reduced motion mode will disable most animations and transitions
            </div>
          )}
        </div>
      </SettingSection>

      {/* ── Advanced ───────────────────────────────────────────────── */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Advanced Settings
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>

        {showAdvanced && (
          <div className="mt-4 rounded-lg border bg-card p-6 space-y-6">
            {/* Cache */}
            <div className="space-y-2">
              <Label>Application Cache</Label>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">256 MB used</Badge>
                <Button variant="outline" size="sm">
                  Clear Cache
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Clear cached data to free up local storage space
              </p>
            </div>

            <Separator />

            {/* Debug mode */}
            <div className="space-y-2">
              <Label>Debug Mode</Label>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Enable developer tools and verbose debug logging
                </p>
                <Switch
                  checked={debugMode}
                  onCheckedChange={setDebugMode}
                />
              </div>
            </div>

            <Separator />

            {/* Reset all */}
            <div className="space-y-2">
              <Label>Reset All Settings</Label>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setTheme("system");
                  setAccentColor("rose");
                  setFontSize("medium");
                  setFontFamily("sans");
                  setCompactNav(false);
                  setDefaultView("dashboard");
                  setAutoSave(true);
                  setAnimationsEnabled(true);
                  setReducedMotion(false);
                  setNotificationsEnabled(true);
                  setDesktopNotifications(false);
                  setSoundEnabled(true);
                  setDebugMode(false);
                  setInactivityTimeout("30");
                  toast({
                    title: "Reset to defaults",
                    description: "All settings have been reset to factory defaults.",
                  });
                }}
              >
                Reset to Defaults
              </Button>
              <p className="text-xs text-muted-foreground">
                This will revert every setting on this page to factory defaults
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky save bar (mobile) ───────────────────────────────── */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 md:hidden">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground truncate">
              <AlertCircle className="inline-block h-4 w-4 mr-1 shrink-0" />
              Unsaved changes
            </p>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" onClick={handleReset} size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} size="sm" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
