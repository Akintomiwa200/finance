"use client";

import { useEffect, useState } from "react";
import {
  Webhook,
  Save,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  RotateCw,
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

const WEBHOOK_EVENTS = [
  { id: "invoice.created", label: "invoice.created", description: "When a new invoice is created" },
  { id: "payment.received", label: "payment.received", description: "When a payment is recorded" },
  { id: "expense.submitted", label: "expense.submitted", description: "When an expense is submitted for approval" },
  { id: "approval.requested", label: "approval.requested", description: "When an approval workflow is triggered" },
];

const DEFAULTS = {
  enableWebhooks: false,
  webhookUrl: "",
  webhookSecret: "",
  webhookEvents: [] as string[],
};

function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function WebhooksSettingsPage() {
  const { data, isLoading, saveSection, settingsVersion } = useSettingsSection("integrations");

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const [form, setForm] = useState(DEFAULTS);

  useSyncSectionData(data, settingsVersion, hasChanges, (section) => {
    setForm({
      enableWebhooks: (section.enableWebhooks as boolean) ?? DEFAULTS.enableWebhooks,
      webhookUrl: (section.webhookUrl as string) || DEFAULTS.webhookUrl,
      webhookSecret: (section.webhookSecret as string) || DEFAULTS.webhookSecret,
      webhookEvents: (section.webhookEvents as string[]) || DEFAULTS.webhookEvents,
    });
  });

  useEffect(() => {
    if (!data) return;
    const changed =
      form.enableWebhooks !== ((data.enableWebhooks as boolean) ?? DEFAULTS.enableWebhooks) ||
      form.webhookUrl !== ((data.webhookUrl as string) || DEFAULTS.webhookUrl) ||
      form.webhookSecret !== ((data.webhookSecret as string) || DEFAULTS.webhookSecret) ||
      JSON.stringify(form.webhookEvents) !== JSON.stringify((data.webhookEvents as string[]) || DEFAULTS.webhookEvents);
    setHasChanges(changed);
  }, [form, data]);

  const update = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleEvent = (eventId: string) => {
    setForm((prev) => ({
      ...prev,
      webhookEvents: prev.webhookEvents.includes(eventId)
        ? prev.webhookEvents.filter((e) => e !== eventId)
        : [...prev.webhookEvents, eventId],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const ok = await saveSection(form);
      if (ok) setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!data) return;
    setForm({
      enableWebhooks: (data.enableWebhooks as boolean) ?? DEFAULTS.enableWebhooks,
      webhookUrl: (data.webhookUrl as string) || DEFAULTS.webhookUrl,
      webhookSecret: (data.webhookSecret as string) || DEFAULTS.webhookSecret,
      webhookEvents: (data.webhookEvents as string[]) || DEFAULTS.webhookEvents,
    });
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(form.webhookSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleRegenerateSecret = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "whsec_";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    update("webhookSecret", result);
  };

  const urlValid = isValidUrl(form.webhookUrl);

  if (isLoading && !data) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Webhook className="h-8 w-8 text-primary" />
            Webhooks
          </h1>
          <p className="text-muted-foreground">
            Configure webhook endpoints for real-time event notifications
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

      {/* Enable Webhooks */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Webhook className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Enable Webhooks</CardTitle>
              <CardDescription>
                Send HTTP POST requests to your endpoint when events occur
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="enableWebhooks">Enable Webhooks</Label>
              <p className="text-xs text-muted-foreground">
                Toggle to start or stop sending webhook notifications to your configured endpoint
              </p>
            </div>
            <Switch
              id="enableWebhooks"
              checked={form.enableWebhooks}
              onCheckedChange={(v) => update("enableWebhooks", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Webhook URL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Webhook URL</CardTitle>
          <CardDescription>
            The URL that will receive POST requests with event payloads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              id="webhookUrl"
              placeholder="https://your-app.com/webhooks/finance"
              value={form.webhookUrl}
              onChange={(e) => update("webhookUrl", e.target.value)}
              disabled={!form.enableWebhooks}
              className={!urlValid && form.webhookUrl ? "border-destructive" : ""}
            />
            {form.webhookUrl && (
              <Badge variant={urlValid ? "success" : "danger"} className="shrink-0">
                {urlValid ? "Valid" : "Invalid"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Must be a valid HTTPS URL. All webhook payloads will be sent as POST requests to this address.
          </p>
        </CardContent>
      </Card>

      {/* Webhook Secret */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Webhook Secret</CardTitle>
          <CardDescription>
            Used to sign webhook payloads for signature verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="webhookSecret"
                type={showSecret ? "text" : "password"}
                placeholder="whsec_..."
                value={form.webhookSecret}
                onChange={(e) => update("webhookSecret", e.target.value)}
                disabled={!form.enableWebhooks}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={!form.enableWebhooks}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopySecret}
              disabled={!form.enableWebhooks || !form.webhookSecret}
              title="Copy secret"
            >
              {copiedSecret ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRegenerateSecret}
              disabled={!form.enableWebhooks}
              title="Regenerate secret"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Keep this secret secure. Use it to verify that incoming webhook requests are authentic.
          </p>
        </CardContent>
      </Card>

      {/* Webhook Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Webhook Events</CardTitle>
          <CardDescription>
            Select which events should trigger webhook notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {WEBHOOK_EVENTS.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between gap-4 rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-medium">{event.label}</code>
                </div>
                <p className="text-xs text-muted-foreground">{event.description}</p>
              </div>
              <Switch
                checked={form.webhookEvents.includes(event.id)}
                onCheckedChange={() => toggleEvent(event.id)}
                disabled={!form.enableWebhooks}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
