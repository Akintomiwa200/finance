"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Save,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Building2,
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
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { useSettingsSection, useSyncSectionData } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const DEFAULTS = {
  enableBudgetTracking: false,
  enableDepartmentAllocations: false,
  enableCostCenters: false,
};

export default function AccountingPeriodsSettings() {
  const { data, isLoading, saveSection, settingsVersion } = useSettingsSection("accounting");

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [enableBudgetTracking, setEnableBudgetTracking] = useState(DEFAULTS.enableBudgetTracking);
  const [enableDepartmentAllocations, setEnableDepartmentAllocations] = useState(DEFAULTS.enableDepartmentAllocations);
  const [enableCostCenters, setEnableCostCenters] = useState(DEFAULTS.enableCostCenters);

  useSyncSectionData(data, settingsVersion, hasChanges, (section) => {
    if (section.enableBudgetTracking !== undefined) setEnableBudgetTracking(section.enableBudgetTracking as boolean);
    if (section.enableDepartmentAllocations !== undefined) setEnableDepartmentAllocations(section.enableDepartmentAllocations as boolean);
    if (section.enableCostCenters !== undefined) setEnableCostCenters(section.enableCostCenters as boolean);
  });

  useEffect(() => {
    if (!data) return;
    const changed =
      enableBudgetTracking !== (data.enableBudgetTracking as boolean ?? DEFAULTS.enableBudgetTracking) ||
      enableDepartmentAllocations !== (data.enableDepartmentAllocations as boolean ?? DEFAULTS.enableDepartmentAllocations) ||
      enableCostCenters !== (data.enableCostCenters as boolean ?? DEFAULTS.enableCostCenters);
    setHasChanges(changed);
  }, [enableBudgetTracking, enableDepartmentAllocations, enableCostCenters, data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const ok = await saveSection({
        enableBudgetTracking,
        enableDepartmentAllocations,
        enableCostCenters,
      });
      if (ok) setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEnableBudgetTracking((data?.enableBudgetTracking as boolean) ?? DEFAULTS.enableBudgetTracking);
    setEnableDepartmentAllocations((data?.enableDepartmentAllocations as boolean) ?? DEFAULTS.enableDepartmentAllocations);
    setEnableCostCenters((data?.enableCostCenters as boolean) ?? DEFAULTS.enableCostCenters);
  };

  if (isLoading && !data) return <SettingsPageSkeleton />;

  const enabledCount = [enableBudgetTracking, enableDepartmentAllocations, enableCostCenters].filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Accounting Periods
          </h1>
          <p className="text-muted-foreground">
            Configure tracking features for budgeting, departments, and cost centres
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

      {/* Budget Tracking */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Budget Tracking</CardTitle>
              <CardDescription>
                Track and compare actual vs. budgeted amounts across accounting periods
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="budgetTracking">Enable Budget Tracking</Label>
              <p className="text-xs text-muted-foreground">
                Set budgets for accounts and monitor variance between planned and actual figures per period
              </p>
            </div>
            <Switch
              id="budgetTracking"
              checked={enableBudgetTracking}
              onCheckedChange={setEnableBudgetTracking}
            />
          </div>
        </CardContent>
      </Card>

      {/* Department Allocations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Department Allocations</CardTitle>
              <CardDescription>
                Allocate income and expenses across departments per accounting period
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="deptAlloc">Enable Department Allocations</Label>
              <p className="text-xs text-muted-foreground">
                Split financial data by department to generate per-department period-level reports
              </p>
            </div>
            <Switch
              id="deptAlloc"
              checked={enableDepartmentAllocations}
              onCheckedChange={setEnableDepartmentAllocations}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cost Centres */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Cost Centres</CardTitle>
              <CardDescription>
                Track costs by business unit, project, or location within each period
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="costCenters">Enable Cost Centres</Label>
              <p className="text-xs text-muted-foreground">
                Assign transactions to cost centres for granular period-level cost analysis
              </p>
            </div>
            <Switch
              id="costCenters"
              checked={enableCostCenters}
              onCheckedChange={setEnableCostCenters}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Configuration Summary</CardTitle>
          <CardDescription>
            Overview of currently enabled tracking features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Budget Tracking</span>
              <Badge variant={enableBudgetTracking ? "default" : "secondary"}>
                {enableBudgetTracking ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Department Allocations</span>
              <Badge variant={enableDepartmentAllocations ? "default" : "secondary"}>
                {enableDepartmentAllocations ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Cost Centres</span>
              <Badge variant={enableCostCenters ? "default" : "secondary"}>
                {enableCostCenters ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">Active Features</span>
              <Badge variant="outline">
                {enabledCount} of 3
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
