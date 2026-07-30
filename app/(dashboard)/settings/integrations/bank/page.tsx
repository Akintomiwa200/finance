"use client";

import { useEffect, useState } from "react";
import {
  Landmark,
  Save,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
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
import { Switch } from "@/src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { useSettingsSection, useSyncSectionData } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const BANK_PROVIDERS = [
  { value: "plaid", label: "Plaid", description: "Connect to 12,000+ financial institutions with real-time data sync" },
  { value: "stripe", label: "Stripe", description: "Integrated bank connectivity with Stripe's financial infrastructure" },
  { value: "square", label: "Square", description: "Bank feeds optimised for Square sellers and businesses" },
  { value: "manual", label: "Manual", description: "Manually import bank statements via CSV upload" },
];

const DEFAULTS = {
  enableBankFeed: false,
  bankProvider: "",
};

export default function BankFeedsSettingsPage() {
  const { data, isLoading, saveSection, settingsVersion } = useSettingsSection("integrations");

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [form, setForm] = useState(DEFAULTS);

  useSyncSectionData(data, settingsVersion, hasChanges, (section) => {
    setForm({
      enableBankFeed: (section.enableBankFeed as boolean) ?? DEFAULTS.enableBankFeed,
      bankProvider: (section.bankProvider as string) || DEFAULTS.bankProvider,
    });
  });

  useEffect(() => {
    if (!data) return;
    const changed =
      form.enableBankFeed !== ((data.enableBankFeed as boolean) ?? DEFAULTS.enableBankFeed) ||
      form.bankProvider !== ((data.bankProvider as string) || DEFAULTS.bankProvider);
    setHasChanges(changed);
  }, [form, data]);

  const update = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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
      enableBankFeed: (data.enableBankFeed as boolean) ?? DEFAULTS.enableBankFeed,
      bankProvider: (data.bankProvider as string) || DEFAULTS.bankProvider,
    });
  };

  const connectionStatus = !form.enableBankFeed
    ? "disconnected"
    : form.bankProvider
      ? "connected"
      : "pending";

  const statusConfig = {
    connected: { label: "Connected", variant: "default" as const, icon: CheckCircle2, color: "text-emerald-600" },
    disconnected: { label: "Disconnected", variant: "secondary" as const, icon: XCircle, color: "text-muted-foreground" },
    pending: { label: "Pending Setup", variant: "outline" as const, icon: Clock, color: "text-amber-600" },
  };

  const status = statusConfig[connectionStatus];
  const StatusIcon = status.icon;

  if (isLoading && !data) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Landmark className="h-8 w-8 text-primary" />
            Bank Feeds
          </h1>
          <p className="text-muted-foreground">
            Connect and manage bank data feeds for automatic transaction import
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

      {/* Bank Feed Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Bank Feed Integration</CardTitle>
              <CardDescription>
                Enable automatic bank transaction imports through your preferred data provider
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="enableBankFeed">Enable Bank Feeds</Label>
              <p className="text-xs text-muted-foreground">
                Automatically import transactions from connected bank accounts on a daily schedule
              </p>
            </div>
            <Switch
              id="enableBankFeed"
              checked={form.enableBankFeed}
              onCheckedChange={(v) => update("enableBankFeed", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Provider */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bank Provider</CardTitle>
          <CardDescription>
            Choose the third-party provider used to connect to your bank
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BANK_PROVIDERS.map((provider) => (
              <button
                key={provider.value}
                type="button"
                onClick={() => update("bankProvider", provider.value)}
                disabled={!form.enableBankFeed}
                className={`flex flex-col items-start rounded-lg border p-4 text-left transition-all ${
                  form.bankProvider === provider.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                } ${!form.enableBankFeed ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="font-medium text-sm">{provider.label}</span>
                <span className="text-xs text-muted-foreground mt-1">{provider.description}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Connection Status</CardTitle>
          <CardDescription>
            Current state of your bank feed integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-5 w-5 ${status.color}`} />
              <div>
                <p className="text-sm font-medium">{status.label}</p>
                <p className="text-xs text-muted-foreground">
                  {!form.enableBankFeed && "Bank feeds are currently turned off"}
                  {form.enableBankFeed && !form.bankProvider && "Select a bank provider to complete setup"}
                  {form.enableBankFeed && form.bankProvider && `Connected via ${BANK_PROVIDERS.find((p) => p.value === form.bankProvider)?.label || form.bankProvider}`}
                </p>
              </div>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
