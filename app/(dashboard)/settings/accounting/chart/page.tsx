"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Calculator,
  Globe,
  BarChart3,
  Building2,
  Save,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/src/components/ui/badge";
import { useSettingsSection, useSyncSectionData } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const ACCOUNT_TYPES = [
  { value: "ASSET", label: "Asset", description: "Resources owned by the business (cash, inventory, equipment)" },
  { value: "LIABILITY", label: "Liability", description: "Obligations owed to others (loans, accounts payable)" },
  { value: "EQUITY", label: "Equity", description: "Owner's residual interest in the business" },
  { value: "REVENUE", label: "Revenue", description: "Income earned from business operations" },
  { value: "EXPENSE", label: "Expense", description: "Costs incurred to generate revenue" },
];

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "NGN", label: "NGN — Nigerian Naira" },
  { value: "JPY", label: "JPY — Japanese Yen" },
];

const DEFAULTS = {
  defaultAccountType: "ASSET",
  enableAutoJournal: true,
  enableMultiCurrency: false,
  baseCurrency: "USD",
  decimalPlaces: 2,
  enableBudgetTracking: false,
  enableDepartmentAllocations: false,
  enableCostCenters: false,
};

export default function ChartOfAccountsSettings() {
  const router = useRouter();
  const { data, isLoading, saveSection, settingsVersion } = useSettingsSection("accounting");

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [form, setForm] = useState(DEFAULTS);

  useSyncSectionData(data, settingsVersion, hasChanges, (section) => {
    setForm({
      defaultAccountType: (section.defaultAccountType as string) || DEFAULTS.defaultAccountType,
      enableAutoJournal: (section.enableAutoJournal as boolean) ?? DEFAULTS.enableAutoJournal,
      enableMultiCurrency: (section.enableMultiCurrency as boolean) ?? DEFAULTS.enableMultiCurrency,
      baseCurrency: (section.baseCurrency as string) || DEFAULTS.baseCurrency,
      decimalPlaces: (section.decimalPlaces as number) ?? DEFAULTS.decimalPlaces,
      enableBudgetTracking: (section.enableBudgetTracking as boolean) ?? DEFAULTS.enableBudgetTracking,
      enableDepartmentAllocations: (section.enableDepartmentAllocations as boolean) ?? DEFAULTS.enableDepartmentAllocations,
      enableCostCenters: (section.enableCostCenters as boolean) ?? DEFAULTS.enableCostCenters,
    });
  });

  useEffect(() => {
    if (!data) return;
    const changed =
      form.defaultAccountType !== ((data.defaultAccountType as string) || DEFAULTS.defaultAccountType) ||
      form.enableAutoJournal !== ((data.enableAutoJournal as boolean) ?? DEFAULTS.enableAutoJournal) ||
      form.enableMultiCurrency !== ((data.enableMultiCurrency as boolean) ?? DEFAULTS.enableMultiCurrency) ||
      form.baseCurrency !== ((data.baseCurrency as string) || DEFAULTS.baseCurrency) ||
      form.decimalPlaces !== ((data.decimalPlaces as number) ?? DEFAULTS.decimalPlaces) ||
      form.enableBudgetTracking !== ((data.enableBudgetTracking as boolean) ?? DEFAULTS.enableBudgetTracking) ||
      form.enableDepartmentAllocations !== ((data.enableDepartmentAllocations as boolean) ?? DEFAULTS.enableDepartmentAllocations) ||
      form.enableCostCenters !== ((data.enableCostCenters as boolean) ?? DEFAULTS.enableCostCenters);
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
      defaultAccountType: (data.defaultAccountType as string) || DEFAULTS.defaultAccountType,
      enableAutoJournal: (data.enableAutoJournal as boolean) ?? DEFAULTS.enableAutoJournal,
      enableMultiCurrency: (data.enableMultiCurrency as boolean) ?? DEFAULTS.enableMultiCurrency,
      baseCurrency: (data.baseCurrency as string) || DEFAULTS.baseCurrency,
      decimalPlaces: (data.decimalPlaces as number) ?? DEFAULTS.decimalPlaces,
      enableBudgetTracking: (data.enableBudgetTracking as boolean) ?? DEFAULTS.enableBudgetTracking,
      enableDepartmentAllocations: (data.enableDepartmentAllocations as boolean) ?? DEFAULTS.enableDepartmentAllocations,
      enableCostCenters: (data.enableCostCenters as boolean) ?? DEFAULTS.enableCostCenters,
    });
  };

  if (isLoading && !data) return <SettingsPageSkeleton />;

  const samplePreview = (1234567.89).toLocaleString("en-US", {
    minimumFractionDigits: form.decimalPlaces,
    maximumFractionDigits: form.decimalPlaces,
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Chart of Accounts
            </h1>
            <p className="text-muted-foreground">
              Configure default account types, journal behaviour, and tracking options
            </p>
          </div>
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

      {/* Default Account Type */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Default Account Type</CardTitle>
              <CardDescription>
                Pre-selected type when creating a new account in the chart of accounts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => update("defaultAccountType", type.value)}
                className={`flex flex-col items-start rounded-lg border p-4 text-left transition-all ${
                  form.defaultAccountType === type.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <span className="font-medium text-sm">{type.label}</span>
                <span className="text-xs text-muted-foreground mt-1">{type.description}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto Journal */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Auto Journal</CardTitle>
              <CardDescription>
                Automatically create journal entries from transactions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="autoJournal">Enable Auto Journal</Label>
              <p className="text-xs text-muted-foreground">
                When enabled, journal entries are generated automatically whenever invoices, payments, or expenses are created
              </p>
            </div>
            <Switch
              id="autoJournal"
              checked={form.enableAutoJournal}
              onCheckedChange={(v) => update("enableAutoJournal", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Multi-Currency */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Multi-Currency</CardTitle>
              <CardDescription>
                Enable transactions and reporting in multiple currencies
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="multiCurrency">Enable Multi-Currency</Label>
              <p className="text-xs text-muted-foreground">
                Allow accounts and transactions in foreign currencies with automatic exchange rate conversion
              </p>
            </div>
            <Switch
              id="multiCurrency"
              checked={form.enableMultiCurrency}
              onCheckedChange={(v) => update("enableMultiCurrency", v)}
            />
          </div>

          {form.enableMultiCurrency && (
            <>
              <div className="h-px bg-border" />
              <div className="space-y-2">
                <Label>Base Currency</Label>
                <Select
                  value={form.baseCurrency}
                  onValueChange={(v) => update("baseCurrency", v)}
                >
                  <SelectTrigger className="max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Home currency used for consolidated financial reporting
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Decimal Places */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Decimal Places</CardTitle>
              <CardDescription>
                Number of decimal places for monetary amounts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="decimalPlaces">Decimal Places</Label>
            <Input
              id="decimalPlaces"
              type="number"
              min={0}
              max={6}
              value={form.decimalPlaces}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= 0 && v <= 6) update("decimalPlaces", v);
              }}
              className="max-w-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              Values between 0 and 6 are supported
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Preview</p>
            <p className="text-lg font-mono font-semibold">
              {samplePreview}
            </p>
            <p className="text-xs text-muted-foreground">
              Example of how monetary amounts will be displayed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Features */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Tracking Features</CardTitle>
              <CardDescription>
                Enable budgeting, department allocations, and cost centre tracking
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="budgetTracking">Budget Tracking</Label>
                <Switch
                  id="budgetTracking"
                  checked={form.enableBudgetTracking}
                  onCheckedChange={(v) => update("enableBudgetTracking", v)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Track budgets against actuals on accounts and generate variance reports
              </p>
              <Badge variant={form.enableBudgetTracking ? "default" : "secondary"}>
                {form.enableBudgetTracking ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="deptAlloc">Dept. Allocations</Label>
                <Switch
                  id="deptAlloc"
                  checked={form.enableDepartmentAllocations}
                  onCheckedChange={(v) => update("enableDepartmentAllocations", v)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Allocate income and expenses to specific departments for per-department reporting
              </p>
              <Badge variant={form.enableDepartmentAllocations ? "default" : "secondary"}>
                {form.enableDepartmentAllocations ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="costCenters">Cost Centres</Label>
                <Switch
                  id="costCenters"
                  checked={form.enableCostCenters}
                  onCheckedChange={(v) => update("enableCostCenters", v)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Track costs by business unit, project, or location for granular analysis
              </p>
              <Badge variant={form.enableCostCenters ? "default" : "secondary"}>
                {form.enableCostCenters ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
