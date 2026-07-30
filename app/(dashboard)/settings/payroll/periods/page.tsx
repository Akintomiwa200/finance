"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  CreditCard,
  Info,
  Save,
  RefreshCw,
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
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useSettingsSection } from "@/src/hooks/use-settings-section";

const PAY_FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly", description: "52 pay periods per year" },
  { value: "bi-weekly", label: "Bi-Weekly", description: "26 pay periods per year" },
  { value: "semi-monthly", label: "Semi-Monthly", description: "24 pay periods per year (1st & 15th)" },
  { value: "monthly", label: "Monthly", description: "12 pay periods per year" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer", description: "Direct deposit to employee bank account" },
  { value: "CHECK", label: "Check", description: "Physical or mailed paper check" },
  { value: "CASH", label: "Cash", description: "Hand-to-hand cash disbursement" },
];

export default function PayrollPeriodsPage() {
  const { data, isLoading, saveSection } = useSettingsSection("payroll");

  const [payFrequency, setPayFrequency] = useState("monthly");
  const [enableAutoPayslip, setEnableAutoPayslip] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState("BANK_TRANSFER");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setPayFrequency((data.payFrequency as string) || "monthly");
      setEnableAutoPayslip((data.enableAutoPayslip as boolean) ?? false);
      setDefaultPaymentMethod((data.defaultPaymentMethod as string) || "BANK_TRANSFER");
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const changed =
      payFrequency !== (data.payFrequency || "monthly") ||
      enableAutoPayslip !== ((data.enableAutoPayslip as boolean) ?? false) ||
      defaultPaymentMethod !== ((data.defaultPaymentMethod as string) || "BANK_TRANSFER");
    setHasChanges(changed);
  }, [payFrequency, enableAutoPayslip, defaultPaymentMethod, data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection({ payFrequency, enableAutoPayslip, defaultPaymentMethod });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (data) {
      setPayFrequency((data.payFrequency as string) || "monthly");
      setEnableAutoPayslip((data.enableAutoPayslip as boolean) ?? false);
      setDefaultPaymentMethod((data.defaultPaymentMethod as string) || "BANK_TRANSFER");
    }
  };

  const selectedFrequency = useMemo(
    () => PAY_FREQUENCY_OPTIONS.find((o) => o.value === payFrequency),
    [payFrequency]
  );

  const currentPeriod = useMemo(() => {
    const now = new Date();
    switch (payFrequency) {
      case "weekly":
        return `Week ${Math.ceil(now.getDate() / 7)} of ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
      case "bi-weekly": {
        const weekNum = Math.ceil(now.getDate() / 14);
        return `Pay Period ${weekNum} of ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
      }
      case "semi-monthly": {
        const half = now.getDate() <= 15 ? "1st–15th" : "16th–End";
        return `${half} of ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
      }
      case "monthly":
      default:
        return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
    }
  }, [payFrequency]);

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Payroll Periods
          </h1>
          <p className="text-muted-foreground">
            Manage pay frequency, payslip generation, and payment methods
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges || isSaving}>
            <RefreshCw className="h-4 w-4 mr-2" />
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Pay Frequency</CardTitle>
              <CardDescription>
                How often payroll is processed for employees
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={payFrequency} onValueChange={setPayFrequency}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {PAY_FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex flex-col">
                      <span>{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Automatic Payslips</CardTitle>
              <CardDescription>
                Automatically generate and distribute payslips after each pay run
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="autoPayslip">Enable auto payslip</Label>
              <p className="text-xs text-muted-foreground">
                Employees will receive their payslip via email once payroll is processed
              </p>
            </div>
            <Switch
              id="autoPayslip"
              checked={enableAutoPayslip}
              onCheckedChange={setEnableAutoPayslip}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription>
                Default method used to disburse employee salaries
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={defaultPaymentMethod} onValueChange={setDefaultPaymentMethod}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex flex-col">
                      <span>{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Current Pay Period</CardTitle>
              <CardDescription>
                Based on your current frequency setting, here is the active pay period
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background p-6 space-y-4 max-w-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Period</span>
              <Badge>{selectedFrequency?.label}</Badge>
            </div>
            <div>
              <p className="text-xl font-semibold">{currentPeriod}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedFrequency?.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
              <div className="rounded-md bg-muted/50 px-3 py-2">
                <p className="text-muted-foreground">Auto Payslips</p>
                <p className="font-medium">{enableAutoPayslip ? "Enabled" : "Disabled"}</p>
              </div>
              <div className="rounded-md bg-muted/50 px-3 py-2">
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-medium">
                  {PAYMENT_METHOD_OPTIONS.find((m) => m.value === defaultPaymentMethod)?.label || defaultPaymentMethod}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
