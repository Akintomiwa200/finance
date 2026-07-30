"use client";

import { useEffect, useState } from "react";
import {
  MinusCircle,
  CreditCard,
  HandCoins,
  Landmark,
  CheckCircle2,
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
import { Badge } from "@/src/components/ui/badge";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useSettingsSection, useSyncSectionData } from "@/src/hooks/use-settings-section";

const PAYMENT_METHODS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Landmark, description: "Direct deposit to employee bank account" },
  { value: "CHECK", label: "Check", icon: CreditCard, description: "Physical or mailed paper check" },
  { value: "CASH", label: "Cash", icon: HandCoins, description: "Hand-to-hand cash disbursement" },
];

export default function PayrollDeductionsPage() {
  const { data, isLoading, saveSection, settingsVersion } = useSettingsSection("payroll");

  const [enableLeaveDeductions, setEnableLeaveDeductions] = useState(false);
  const [enableLoanTracking, setEnableLoanTracking] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState("BANK_TRANSFER");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useSyncSectionData(data, settingsVersion, hasChanges, (section) => {
    setEnableLeaveDeductions((section.enableLeaveDeductions as boolean) ?? false);
    setEnableLoanTracking((section.enableLoanTracking as boolean) ?? false);
    setDefaultPaymentMethod((section.defaultPaymentMethod as string) || "BANK_TRANSFER");
  });

  useEffect(() => {
    if (!data) return;
    const changed =
      enableLeaveDeductions !== ((data.enableLeaveDeductions as boolean) ?? false) ||
      enableLoanTracking !== ((data.enableLoanTracking as boolean) ?? false) ||
      defaultPaymentMethod !== ((data.defaultPaymentMethod as string) || "BANK_TRANSFER");
    setHasChanges(changed);
  }, [enableLeaveDeductions, enableLoanTracking, defaultPaymentMethod, data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection({ enableLeaveDeductions, enableLoanTracking, defaultPaymentMethod });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (data) {
      setEnableLeaveDeductions((data.enableLeaveDeductions as boolean) ?? false);
      setEnableLoanTracking((data.enableLoanTracking as boolean) ?? false);
      setDefaultPaymentMethod((data.defaultPaymentMethod as string) || "BANK_TRANSFER");
    }
  };

  const activeDeductions = [
    enableLeaveDeductions && "Leave Deductions",
    enableLoanTracking && "Loan Tracking",
  ].filter((d): d is string => Boolean(d));

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MinusCircle className="h-8 w-8 text-primary" />
            Deductions & Payments
          </h1>
          <p className="text-muted-foreground">
            Configure deductions, loan tracking, and payment methods
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
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Leave Deductions</CardTitle>
              <CardDescription>
                Automatically deduct pay for unpaid leave days
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="leaveDeductions">Enable leave deductions</Label>
              <p className="text-xs text-muted-foreground">
                When enabled, employees without sufficient leave balance will have unpaid days deducted from their salary
              </p>
            </div>
            <Switch
              id="leaveDeductions"
              checked={enableLeaveDeductions}
              onCheckedChange={setEnableLeaveDeductions}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HandCoins className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Loan Tracking</CardTitle>
              <CardDescription>
                Track employee loans and deduct repayments from payroll
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="loanTracking">Enable loan tracking</Label>
              <p className="text-xs text-muted-foreground">
                Manage employee loan records and automatically schedule payroll deductions for repayments
              </p>
            </div>
            <Switch
              id="loanTracking"
              checked={enableLoanTracking}
              onCheckedChange={setEnableLoanTracking}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Default Payment Method</CardTitle>
              <CardDescription>
                Default method used to disburse employee salaries
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 max-w-lg">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = defaultPaymentMethod === method.value;
              return (
                <button
                  key={method.value}
                  onClick={() => setDefaultPaymentMethod(method.value)}
                  className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{method.label}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
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
              <CardTitle className="text-lg">Deduction Summary</CardTitle>
              <CardDescription>
                Overview of currently active deductions and payment settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background p-6 space-y-4 max-w-lg">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Deductions</p>
              <div className="flex flex-wrap gap-2">
                {activeDeductions.length > 0 ? (
                  activeDeductions.map((d) => (
                    <Badge key={d} variant="secondary">{d}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No deductions enabled</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Default Payment Method</p>
              <Badge variant="outline">
                {PAYMENT_METHODS.find((m) => m.value === defaultPaymentMethod)?.label || defaultPaymentMethod}
              </Badge>
            </div>
            <div className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              {activeDeductions.length > 0
                ? `${activeDeductions.length} deduction type(s) active. These will apply to all eligible employees during payroll processing.`
                : "No deductions are currently active. Enable deduction types above to apply them during payroll processing."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
