"use client";

import {
  Bell,
  Mail,
  Monitor,
  Volume2,
  Banknote,
  Receipt,
  CheckCircle,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { useSettingsSection } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const DELIVERY_FIELDS = [
  {
    key: "emailEnabled",
    label: "Email Notifications",
    description: "Receive notifications via email",
    icon: Mail,
  },
  {
    key: "desktopEnabled",
    label: "Desktop Notifications",
    description: "Receive browser desktop notifications",
    icon: Monitor,
  },
  {
    key: "soundEnabled",
    label: "Sound Notifications",
    description: "Play a sound when a notification arrives",
    icon: Volume2,
  },
];

const ALERT_FIELDS = [
  {
    key: "payrollAlerts",
    label: "Payroll Alerts",
    description: "Receive notifications for payroll events",
    icon: Banknote,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    key: "expenseAlerts",
    label: "Expense Alerts",
    description: "Receive notifications for expense submissions and approvals",
    icon: Receipt,
    color:
      "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    key: "approvalAlerts",
    label: "Approval Alerts",
    description: "Receive notifications when approvals are required",
    icon: CheckCircle,
    color:
      "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    key: "budgetAlerts",
    label: "Budget Alerts",
    description: "Receive notifications when budget thresholds are reached",
    icon: TrendingUp,
    color:
      "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    key: "invoiceAlerts",
    label: "Invoice Alerts",
    description: "Receive notifications for invoice updates and overdue items",
    icon: FileText,
    color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
  },
];

export default function NotificationAlertsPage() {
  const { data, isLoading, error, saveSection } =
    useSettingsSection("notifications");

  const notifications = (data || {}) as Record<string, boolean>;

  const handleToggle = async (key: string, checked: boolean) => {
    await saveSection({ [key]: checked });
  };

  if (isLoading) return <SettingsPageSkeleton />;

  if (error) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Notification Alerts
          </h1>
          <p className="text-muted-foreground">
            Configure notification alert preferences
          </p>
        </div>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Failed to load notification settings. Please try again later.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <span className="text-2xl font-bold tracking-tight">
            Notification Alerts
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure how and when you receive notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Delivery Channels
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {DELIVERY_FIELDS.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <field.icon className="h-4 w-4 text-muted-foreground" />
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
                checked={!!notifications[field.key]}
                onCheckedChange={(checked) => handleToggle(field.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Categories
          </CardTitle>
          <CardDescription>
            Enable or disable specific notification categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {ALERT_FIELDS.map((field) => (
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
                checked={!!notifications[field.key]}
                onCheckedChange={(checked) => handleToggle(field.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
