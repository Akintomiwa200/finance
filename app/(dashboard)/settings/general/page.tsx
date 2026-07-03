"use client";

import { useEffect, useState } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { useToast } from "@/src/components/ui/use-toast";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { usePlatformSettingsStore } from "@/src/store/platform-settings-store";
import { useSessionSettingsStore, type SessionTimeout } from "@/src/store/session-settings-store";
import type {
  AccentColor,
  FontSize,
} from "@/src/types/platform-settings";
import type { ThemeMode } from "@/src/context/theme-context";

// --- Constants ---
const THEME_OPTIONS: {
  value: ThemeMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
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

const ACCENT_COLORS: {
  value: AccentColor;
  label: string;
  swatch: string;
  ring: string;
}[] = [
  {
    value: "blue",
    label: "Blue",
    swatch: "bg-blue-600",
    ring: "ring-blue-600",
  },
  {
    value: "purple",
    label: "Purple",
    swatch: "bg-purple-600",
    ring: "ring-purple-600",
  },
  {
    value: "emerald",
    label: "Emerald",
    swatch: "bg-emerald-600",
    ring: "ring-emerald-600",
  },
  {
    value: "amber",
    label: "Amber",
    swatch: "bg-amber-500",
    ring: "ring-amber-500",
  },
  {
    value: "rose",
    label: "Rose",
    swatch: "bg-rose-600",
    ring: "ring-rose-600",
  },

];

const FONT_SIZES: {
  value: FontSize;
  label: string;
  preview: string;
  size: number;
}[] = [
  { value: "small", label: "Small", preview: "text-sm", size: 14 },
  { value: "medium", label: "Medium", preview: "text-base", size: 16 },
  { value: "large", label: "Large", preview: "text-lg", size: 18 },

];

const DEFAULT_VIEWS = [
  { value: "dashboard", label: "Dashboard" },
  { value: "projects", label: "Projects" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports" },
  { value: "calendar", label: "Calendar" },
];



// --- Sub-components ---

interface SettingSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function SettingSection({
  title,
  description,
  icon,
  children,
  className = "",
}: SettingSectionProps) {
  return (
    <Card className={className}>
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

interface ColorPickerProps {
  value: AccentColor;
  onChange: (value: AccentColor) => void;
}

function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {ACCENT_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onChange(color.value)}
          className={`relative h-10 w-10 rounded-full ${color.swatch} transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${
            value === color.value
              ? `ring-2 ring-offset-2 ring-offset-background ${color.ring}`
              : "ring-0"
          }`}
          aria-label={`Select ${color.label} accent color`}
        >
          {value === color.value && (
            <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-sm">
              <Check className="h-5 w-5" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// --- Main Component ---

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Store values
  const theme = usePlatformSettingsStore((s) => s.theme);
  const accentColor = usePlatformSettingsStore((s) => s.accentColor);
  const fontSize = usePlatformSettingsStore((s) => s.fontSize);
  const setSettings = usePlatformSettingsStore((s) => s.setSettings);

  const { inactivityTimeoutMinutes, setInactivityTimeout } =
    useSessionSettingsStore();

  // Local state
  const [localTheme, setLocalTheme] = useState<ThemeMode>(theme);
  const [localAccentColor, setLocalAccentColor] =
    useState<AccentColor>(accentColor);
  const [localFontSize, setLocalFontSize] = useState<FontSize>(fontSize);
  const [localTimeout, setLocalTimeout] = useState(
    String(inactivityTimeoutMinutes),
  );

  const [defaultView, setDefaultView] = useState("dashboard");
  const [autoSave, setAutoSave] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const hasUnsavedChanges =
      localTheme !== theme ||
      localAccentColor !== accentColor ||
      localFontSize !== fontSize ||
      Number(localTimeout) !== inactivityTimeoutMinutes;
    setHasChanges(hasUnsavedChanges);
  }, [
    localTheme,
    localAccentColor,
    localFontSize,
    localTimeout,
    theme,
    accentColor,
    fontSize,
    inactivityTimeoutMinutes,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSettings({
        theme: localTheme,
        accentColor: localAccentColor,
        fontSize: localFontSize,
      });
      setInactivityTimeout(Number(localTimeout) as SessionTimeout);

      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalTheme(theme);
    setLocalAccentColor(accentColor);
    setLocalFontSize(fontSize);
    setLocalTimeout(String(inactivityTimeoutMinutes));
    setDefaultView("dashboard");
    setAutoSave(true);
    setNotificationsEnabled(true);
    setDesktopNotifications(false);
    setSoundEnabled(true);
    setAnimationsEnabled(true);
    setReducedMotion(false);
    setShowAdvanced(false);
    toast({
      title: "Settings reset",
      description: "All settings have been reset to their saved values.",
    });
  };

  const handleTimeoutChange = (value: string) => {
    setLocalTimeout(value);
  };

  const getTimeoutLabel = (value: string) => {
    const option = TIMEOUT_OPTIONS.find((opt) => opt.value === value);
    return option?.label || value;
  };

  if (loading) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* --- Page Header --- */}
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

      {/* --- Unsaved Changes Warning --- */}
      {hasChanges && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-600/20 bg-yellow-50 dark:bg-yellow-950/30 p-4 text-sm text-yellow-800 dark:text-yellow-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>
            You have unsaved changes. Don't forget to save your preferences.
          </span>
        </div>
      )}

      {/* --- Appearance Settings --- */}
      <SettingSection
        title="Appearance"
        description="Customize the look and feel of the application"
        icon={<Palette className="h-5 w-5" />}
      >
        <div className="space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="flex gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLocalTheme(option.value)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                    localTheme === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Accent Color */}
          <div className="space-y-3">
            <Label>Accent Color</Label>
            <ColorPicker
              value={localAccentColor}
              onChange={setLocalAccentColor}
            />
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-3">
            <Label>Font Size</Label>
            <div className="flex gap-2">
              {FONT_SIZES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLocalFontSize(option.value)}
                  className={`flex flex-1 items-center justify-center rounded-lg border px-4 py-2 transition-all ${
                    localFontSize === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Type className="h-4 w-4 mr-2" />
                  <span className={option.preview}>{option.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Current size:{" "}
              {FONT_SIZES.find((f) => f.value === localFontSize)?.size}px
            </p>
          </div>
        </div>
      </SettingSection>

      {/* --- Language & Regional --- */}
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
              {DEFAULT_VIEWS.map((view) => (
                <SelectItem key={view.value} value={view.value}>
                  {view.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SettingSection>

      {/* --- Session & Security --- */}
      <SettingSection
        title="Session & Security"
        description="Manage your session preferences and security settings"
        icon={<Clock className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Session Timeout</Label>
            <Select value={localTimeout} onValueChange={handleTimeoutChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeout duration" />
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
              {localTimeout === "0"
                ? "Session will never expire automatically"
                : `Session will expire after ${getTimeoutLabel(localTimeout).toLowerCase()}`}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="autoSave">Auto-save changes</Label>
              <p className="text-xs text-muted-foreground">
                Automatically save settings as you make changes
              </p>
            </div>
            <Switch
              id="autoSave"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
        </div>
      </SettingSection>

      {/* --- Notifications --- */}
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
              <Label htmlFor="desktopNotifications">
                Desktop notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Show notifications outside the browser
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

      {/* --- Accessibility --- */}
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
                Minimize animations for better accessibility
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

      {/* --- Advanced --- */}
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
            className={`h-4 w-4 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="mt-4 rounded-lg border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label>Application Cache</Label>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">256 MB used</Badge>
                <Button variant="outline" size="sm">
                  Clear Cache
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Clear cached data to free up storage space
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Debug Mode</Label>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Enable developer tools and debug logging
                </p>
                <Switch />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Reset All Settings</Label>
              <Button variant="destructive" size="sm">
                Reset to Defaults
              </Button>
              <p className="text-xs text-muted-foreground">
                This will reset all settings to their factory defaults
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- Save Bar (Sticky at bottom on mobile) --- */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 md:relative md:p-0 md:border-0 md:bg-transparent md:backdrop-blur-none">
          <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <AlertCircle className="inline-block h-4 w-4 mr-1" />
              You have unsaved changes
            </p>
            <div className="flex gap-2">
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
                    Save Changes
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
