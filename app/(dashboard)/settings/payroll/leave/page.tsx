"use client";

import { useEffect, useState } from "react";
import {
  CalendarOff,
  CalendarDays,
  Stethoscope,
  User,
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
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useSettingsSection } from "@/src/hooks/use-settings-section";

export default function PayrollLeavePage() {
  const { data, isLoading, saveSection } = useSettingsSection("payroll");

  const [enableLeaveDeductions, setEnableLeaveDeductions] = useState(false);
  const [annualLeaveQuota, setAnnualLeaveQuota] = useState("15");
  const [sickLeaveQuota, setSickLeaveQuota] = useState("10");
  const [personalLeaveQuota, setPersonalLeaveQuota] = useState("5");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setEnableLeaveDeductions((data.enableLeaveDeductions as boolean) ?? false);
      setAnnualLeaveQuota(String((data as Record<string, unknown>).annualLeaveQuota ?? 15));
      setSickLeaveQuota(String((data as Record<string, unknown>).sickLeaveQuota ?? 10));
      setPersonalLeaveQuota(String((data as Record<string, unknown>).personalLeaveQuota ?? 5));
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const changed =
      enableLeaveDeductions !== ((data.enableLeaveDeductions as boolean) ?? false) ||
      annualLeaveQuota !== String((data as Record<string, unknown>).annualLeaveQuota ?? 15) ||
      sickLeaveQuota !== String((data as Record<string, unknown>).sickLeaveQuota ?? 10) ||
      personalLeaveQuota !== String((data as Record<string, unknown>).personalLeaveQuota ?? 5);
    setHasChanges(changed);
  }, [enableLeaveDeductions, annualLeaveQuota, sickLeaveQuota, personalLeaveQuota, data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection({
        enableLeaveDeductions,
        annualLeaveQuota: Number(annualLeaveQuota),
        sickLeaveQuota: Number(sickLeaveQuota),
        personalLeaveQuota: Number(personalLeaveQuota),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (data) {
      setEnableLeaveDeductions((data.enableLeaveDeductions as boolean) ?? false);
      setAnnualLeaveQuota(String((data as Record<string, unknown>).annualLeaveQuota ?? 15));
      setSickLeaveQuota(String((data as Record<string, unknown>).sickLeaveQuota ?? 10));
      setPersonalLeaveQuota(String((data as Record<string, unknown>).personalLeaveQuota ?? 5));
    }
  };

  const totalDays = Number(annualLeaveQuota) + Number(sickLeaveQuota) + Number(personalLeaveQuota);

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarOff className="h-8 w-8 text-primary" />
            Leave Policies
          </h1>
          <p className="text-muted-foreground">
            Configure leave quotas and how leave impacts payroll processing
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
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Leave Deduction Settings</CardTitle>
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
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Annual Leave Quota</CardTitle>
              <CardDescription>
                Number of paid vacation days employees receive per year
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-md">
            <Label>Days per year</Label>
            <Input
              type="number"
              min={0}
              max={365}
              value={annualLeaveQuota}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || (Number(val) >= 0 && Number(val) <= 365)) {
                  setAnnualLeaveQuota(val);
                }
              }}
              placeholder="e.g. 15"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Sick Leave Quota</CardTitle>
              <CardDescription>
                Number of paid sick days employees receive per year
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-md">
            <Label>Days per year</Label>
            <Input
              type="number"
              min={0}
              max={365}
              value={sickLeaveQuota}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || (Number(val) >= 0 && Number(val) <= 365)) {
                  setSickLeaveQuota(val);
                }
              }}
              placeholder="e.g. 10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Personal Leave Quota</CardTitle>
              <CardDescription>
                Number of paid personal / mental health days employees receive per year
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-md">
            <Label>Days per year</Label>
            <Input
              type="number"
              min={0}
              max={365}
              value={personalLeaveQuota}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || (Number(val) >= 0 && Number(val) <= 365)) {
                  setPersonalLeaveQuota(val);
                }
              }}
              placeholder="e.g. 5"
            />
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
              <CardTitle className="text-lg">Leave Policy Summary</CardTitle>
              <CardDescription>
                Overview of the current leave configuration per employee per year
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background p-6 space-y-4 max-w-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-md bg-muted/50 px-3 py-3">
                <p className="text-2xl font-bold">{Number(annualLeaveQuota) || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Annual Leave</p>
              </div>
              <div className="rounded-md bg-muted/50 px-3 py-3">
                <p className="text-2xl font-bold">{Number(sickLeaveQuota) || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Sick Leave</p>
              </div>
              <div className="rounded-md bg-muted/50 px-3 py-3">
                <p className="text-2xl font-bold">{Number(personalLeaveQuota) || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Personal Leave</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm text-muted-foreground">Total Paid Leave</span>
              <Badge variant="secondary">{totalDays} days/year</Badge>
            </div>
            <div className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              {enableLeaveDeductions
                ? "Leave deductions are active. Employees exceeding their quota will have unpaid days deducted from their salary."
                : "Leave deductions are disabled. All leave beyond quota is unpaid but will not automatically deduct from salary."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
