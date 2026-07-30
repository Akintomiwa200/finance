"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import {
  Mail,
  Clock,
  Settings2,
  Banknote,
  Receipt,
  CheckCircle,
  TrendingUp,
  FileText,
  Save,
  RotateCcw,
} from "lucide-react";
import { useSettingsSection } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const CATEGORY_FIELDS = [
  {
    key: "payrollAlerts",
    label: "Payroll",
    description: "Get email updates on payroll processing and salary disbursements",
    icon: Banknote,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    key: "expenseAlerts",
    label: "Expenses",
    description: "Receive email notifications for expense submissions and approvals",
    icon: Receipt,
    color:
      "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    key: "approvalAlerts",
    label: "Approvals",
    description: "Get emailed when approvals are pending or completed",
    icon: CheckCircle,
    color:
      "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    key: "budgetAlerts",
    label: "Budget",
    description: "Email alerts when budget limits or thresholds are reached",
    icon: TrendingUp,
    color:
      "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    key: "invoiceAlerts",
    label: "Invoices",
    description: "Email notifications for new invoices, payments, and overdue items",
    icon: FileText,
    color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
  },
];

export default function EmailNotificationsPage() {
  const { data, isLoading, error, saveSection } =
    useSettingsSection("notifications");

  const notifications = (data || {}) as Record<string, unknown>;

  const [emailDigest, setEmailDigest] = useState(
    (notifications.emailDigest as string) || "realtime",
  );
  const [draft, setDraft] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const isDirty = useMemo(() => {
    if (emailDigest !== ((notifications.emailDigest as string) || "realtime"))
      return true;
    return Object.keys(draft).length > 0;
  }, [emailDigest, notifications, draft]);

  const currentValue = (key: string) => {
    if (key in draft) return draft[key];
    return !!notifications[key];
  };

  const handleToggle = (key: string, checked: boolean) => {
    setDraft((prev) => ({ ...prev, [key]: checked }));
  };

  const handleDigestChange = (value: string) => {
    setEmailDigest(value);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload: Record<string, unknown> = { ...draft, emailDigest };
    await saveSection(payload);
    setDraft({});
    setSaving(false);
  };

  const handleReset = () => {
    setDraft({});
    setEmailDigest(
      (notifications.emailDigest as string) || "realtime",
    );
  };

  if (isLoading) return <SettingsPageSkeleton />;

  if (error) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Email Notifications
          </h1>
          <p className="text-muted-foreground">
            Configure email notification preferences
          </p>
        </div>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Failed to load email settings. Please try again later.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6" />
          <span className="text-2xl font-bold tracking-tight">
            Email Notifications
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage how email notifications are sent to you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Enable or disable email notifications system-wide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">
                  Enable Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive all notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={currentValue("emailEnabled")}
              onCheckedChange={(checked) => handleToggle("emailEnabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Email Digest
          </CardTitle>
          <CardDescription>
            Choose how frequently you receive email digests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label className="text-sm font-medium mb-2 block">
              Frequency
            </Label>
            <Select value={emailDigest} onValueChange={handleDigestChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              {emailDigest === "realtime" &&
                "Receive emails immediately when notifications arrive."}
              {emailDigest === "daily" &&
                "Receive a single daily summary of all notifications."}
              {emailDigest === "weekly" &&
                "Receive a weekly digest of all notifications."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Select which categories send email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {CATEGORY_FIELDS.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${field.color}`}
                >
                  <field.icon className="h-4 w-4" />
                </div>
                <div>
                  <Label className="text-sm font-medium cursor-pointer">
                    {field.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {field.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={currentValue(field.key)}
                onCheckedChange={(checked) => handleToggle(field.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 justify-end">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!isDirty}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave} disabled={!isDirty || saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
