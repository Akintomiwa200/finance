"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Package,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronLeft,
  Lock,
  Unlock,
  TrendingUp,
  FileText,
  Users,
  BarChart,
  CreditCard,
  Briefcase,
  Home,
  Shield,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { MODULE_PERMISSIONS } from "@/src/services/permission-group.service";
import { useToast } from "@/src/components/ui/use-toast";

interface OrgDetail {
  id: string;
  name: string;
  domain?: string;
  employeeCount?: number;
  isActive?: boolean;
  plan?: string;
  enabledModules?: string[];
}

// Group modules by category
const MODULE_CATEGORIES = {
  "Core Finance": [
    "general-ledger",
    "accounts-payable",
    "accounts-receivable",
    "cash-management",
  ],
  "Advanced Finance": [
    "budgeting",
    "forecasting",
    "consolidation",
    "intercompany",
  ],
  Compliance: [
    "tax-management",
    "audit-trail",
    "regulatory-reporting",
    "internal-controls",
  ],
  Analytics: [
    "financial-reporting",
    "dashboard-analytics",
    "kpi-monitoring",
    "predictive-analytics",
  ],
  Operations: [
    "procurement",
    "inventory",
    "asset-management",
    "project-accounting",
  ],
};

const MODULE_ICONS: Record<string, any> = {
  "general-ledger": FileText,
  "accounts-payable": CreditCard,
  "accounts-receivable": CreditCard,
  "cash-management": TrendingUp,
  budgeting: BarChart,
  forecasting: TrendingUp,
  "tax-management": FileText,
  "audit-trail": Shield,
  "financial-reporting": BarChart,
  procurement: Briefcase,
  inventory: Package,
  "asset-management": Home,
};

export default function ModuleConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const {
    data: org,
    isLoading: isLoadingOrg,
    refetch,
  } = useFetch<OrgDetail>(`/api/admin/organizations/${id}`);

  // Initialize enabled modules from API or default
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    if (org?.enabledModules) {
      const initial: Record<string, boolean> = {};
      MODULE_PERMISSIONS.forEach((mod) => {
        initial[mod] = org.enabledModules?.includes(mod) || false;
      });
      return initial;
    }
    // Fallback: first 10 modules enabled by default
    return Object.fromEntries(MODULE_PERMISSIONS.map((m, i) => [m, i < 10]));
  });

  // Update enabled state when org data loads
  useEffect(() => {
    if (org?.enabledModules) {
      const newEnabled: Record<string, boolean> = {};
      MODULE_PERMISSIONS.forEach((mod) => {
        newEnabled[mod] = org.enabledModules?.includes(mod) || false;
      });
      setEnabled(newEnabled);
    }
  }, [org]);

  const enabledCount = Object.values(enabled).filter(Boolean).length;
  const totalModules = MODULE_PERMISSIONS.length;
  const enabledPercentage = (enabledCount / totalModules) * 100;

  const handleToggle = (module: string, checked: boolean) => {
    setEnabled((prev) => ({ ...prev, [module]: checked }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/organizations/${id}/modules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabledModules: Object.keys(enabled).filter((k) => enabled[k]),
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast({
        title: "Success",
        description: "Module configuration saved successfully",
      });
      setHasChanges(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryForModule = (module: string): string => {
    for (const [category, modules] of Object.entries(MODULE_CATEGORIES)) {
      if (modules.includes(module)) return category;
    }
    return "Other";
  };

  const getModulesByCategory = (category: string) => {
    if (category === "all") return MODULE_PERMISSIONS;
    if (category === "enabled")
      return MODULE_PERMISSIONS.filter((m) => enabled[m]);
    if (category === "disabled")
      return MODULE_PERMISSIONS.filter((m) => !enabled[m]);
    return MODULE_CATEGORIES[category as keyof typeof MODULE_CATEGORIES] || [];
  };

  const renderModuleRow = (mod: string) => {
    const Icon = MODULE_ICONS[mod] || Package;
    const isEnabled = enabled[mod] ?? false;

    return (
      <div
        key={mod}
        className="flex items-center justify-between py-4 hover:bg-muted/30 px-4 rounded-lg transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`p-2 rounded-lg ${isEnabled ? "bg-primary/10" : "bg-muted"} transition-colors`}
          >
            <Icon
              className={`h-5 w-5 ${isEnabled ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium capitalize">
                {mod.replace(/-/g, " ")}
              </p>
              {isEnabled ? (
                <Badge variant="default" className="gap-1 text-[10px]">
                  <CheckCircle className="h-3 w-3" />
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  <Lock className="h-3 w-3" />
                  Disabled
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Finance module access for {org?.name}
            </p>
          </div>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={(v) => handleToggle(mod, v)}
          aria-label={`Toggle ${mod}`}
        />
      </div>
    );
  };

  if (isLoadingOrg || !org) {
    return (
      <PageLayout title="Loading..." showBack>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={`Module Configuration — ${org.name}`}
      description="Toggle which finance modules this company can access"
      showBack
      breadcrumbs={[
        { label: "Module Management", href: "/admin/modules" },
        { label: org.name },
      ]}
      actions={
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Unsaved changes
            </Badge>
          )}
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="gap-2"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Company Info Banner */}
        <Card className="bg-gradient-to-r from-primary/5 via-primary/0 to-transparent border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={org.isActive !== false ? "default" : "secondary"}
                  >
                    {org.isActive !== false ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{org.plan || "Enterprise"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {org.domain && `${org.domain} • `}
                  {org.employeeCount || 0} users
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-bold">{enabledCount}</p>
                  <p className="text-xs text-muted-foreground">
                    Enabled Modules
                  </p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-right">
                  <p className="text-2xl font-bold">{totalModules}</p>
                  <p className="text-xs text-muted-foreground">
                    Total Available
                  </p>
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Module Coverage</span>
                <span>{Math.round(enabledPercentage)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${enabledPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Configuration Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Finance Modules</CardTitle>
            <CardDescription>
              Enable or disable specific modules to control feature access for
              this organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="flex flex-wrap h-auto gap-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  All Modules
                </TabsTrigger>
                <TabsTrigger value="enabled">
                  Enabled ({enabledCount})
                </TabsTrigger>
                <TabsTrigger value="disabled">
                  Disabled ({totalModules - enabledCount})
                </TabsTrigger>
                {Object.keys(MODULE_CATEGORIES).map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {[
                "all",
                "enabled",
                "disabled",
                ...Object.keys(MODULE_CATEGORIES),
              ].map((tabValue) => (
                <TabsContent
                  key={tabValue}
                  value={tabValue}
                  className="space-y-1"
                >
                  <div className="divide-y divide-border">
                    {getModulesByCategory(tabValue).map(renderModuleRow)}
                  </div>
                  {getModulesByCategory(tabValue).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No modules found in this category</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              const allEnabled = Object.fromEntries(
                MODULE_PERMISSIONS.map((m) => [m, true]),
              );
              setEnabled(allEnabled);
              setHasChanges(true);
            }}
          >
            <Unlock className="h-4 w-4 mr-2" />
            Enable All
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const allDisabled = Object.fromEntries(
                MODULE_PERMISSIONS.map((m) => [m, false]),
              );
              setEnabled(allDisabled);
              setHasChanges(true);
            }}
          >
            <Lock className="h-4 w-4 mr-2" />
            Disable All
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
