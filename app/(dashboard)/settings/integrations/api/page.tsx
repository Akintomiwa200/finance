"use client";

import { useEffect, useState } from "react";
import {
  Key,
  Save,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  BarChart3,
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
import { Badge } from "@/src/components/ui/badge";
import { useSettingsSection, useSyncSectionData } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const DEFAULTS = {
  enableAPIAccess: false,
  apiKey: "",
  rateLimit: "100",
};

export default function ApiSettingsPage() {
  const { data, isLoading, saveSection, settingsVersion } = useSettingsSection("integrations");

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const [form, setForm] = useState(DEFAULTS);

  useSyncSectionData(data, settingsVersion, hasChanges, (section) => {
    setForm({
      enableAPIAccess: (section.enableAPIAccess as boolean) ?? DEFAULTS.enableAPIAccess,
      apiKey: (section.apiKey as string) || DEFAULTS.apiKey,
      rateLimit: String((section.rateLimit as number) ?? DEFAULTS.rateLimit),
    });
  });

  useEffect(() => {
    if (!data) return;
    const changed =
      form.enableAPIAccess !== ((data.enableAPIAccess as boolean) ?? DEFAULTS.enableAPIAccess) ||
      form.apiKey !== ((data.apiKey as string) || DEFAULTS.apiKey) ||
      form.rateLimit !== String((data.rateLimit as number) ?? DEFAULTS.rateLimit);
    setHasChanges(changed);
  }, [form, data]);

  const update = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const ok = await saveSection({
        enableAPIAccess: form.enableAPIAccess,
        apiKey: form.apiKey,
        rateLimit: Number(form.rateLimit) || 100,
      });
      if (ok) setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!data) return;
    setForm({
      enableAPIAccess: (data.enableAPIAccess as boolean) ?? DEFAULTS.enableAPIAccess,
      apiKey: (data.apiKey as string) || DEFAULTS.apiKey,
      rateLimit: String((data.rateLimit as number) ?? DEFAULTS.rateLimit),
    });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(form.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "api_";
    for (let i = 0; i < 40; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    update("apiKey", result);
  };

  if (isLoading && !data) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Key className="h-8 w-8 text-primary" />
            API Access
          </h1>
          <p className="text-muted-foreground">
            Manage API tokens and access rate limits for external integrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges || isSaving}>
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

      {hasChanges && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-600/20 bg-yellow-50 dark:bg-yellow-950/30 p-4 text-sm text-yellow-800 dark:text-yellow-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>You have unsaved changes. Don&apos;t forget to save.</span>
        </div>
      )}

      {/* API Access */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">API Access</CardTitle>
              <CardDescription>
                Enable or disable API access for external applications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="enableAPIAccess">Enable API Access</Label>
              <p className="text-xs text-muted-foreground">
                Allow external applications to access your financial data via RESTful API endpoints
              </p>
            </div>
            <Switch
              id="enableAPIAccess"
              checked={form.enableAPIAccess}
              onCheckedChange={(v) => update("enableAPIAccess", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Key</CardTitle>
          <CardDescription>
            Use this key to authenticate requests. Keep it secret and never expose it in client-side code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                placeholder="api_..."
                value={form.apiKey}
                onChange={(e) => update("apiKey", e.target.value)}
                disabled={!form.enableAPIAccess}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={!form.enableAPIAccess}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyKey}
              disabled={!form.enableAPIAccess || !form.apiKey}
              title="Copy API key"
            >
              {copiedKey ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRegenerateKey}
              disabled={!form.enableAPIAccess}
              title="Regenerate API key"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Include this key in the Authorization: Bearer header of your API requests.
          </p>
        </CardContent>
      </Card>

      {/* Rate Limit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rate Limit</CardTitle>
          <CardDescription>
            Control the maximum number of API requests allowed per minute
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3">
            <Input
              id="rateLimit"
              type="number"
              min={1}
              max={10000}
              value={form.rateLimit}
              onChange={(e) => update("rateLimit", e.target.value)}
              disabled={!form.enableAPIAccess}
              className="max-w-[140px]"
            />
            <span className="text-sm text-muted-foreground">requests / minute</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Higher limits are available on request. Exceeding this limit will return HTTP 429 responses.
          </p>
        </CardContent>
      </Card>

      {/* API Usage Stats */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">API Usage Stats</CardTitle>
              <CardDescription>
                Overview of your current API usage (updated in real-time)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Requests Today</p>
              <p className="text-2xl font-bold">0</p>
              <Badge variant="secondary">Placeholder</Badge>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">This Month</p>
              <p className="text-2xl font-bold">0</p>
              <Badge variant="secondary">Placeholder</Badge>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Error Rate</p>
              <p className="text-2xl font-bold">0%</p>
              <Badge variant="secondary">Placeholder</Badge>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Avg Response</p>
              <p className="text-2xl font-bold">--ms</p>
              <Badge variant="secondary">Placeholder</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
