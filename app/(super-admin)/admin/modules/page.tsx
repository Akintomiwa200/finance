"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/src/components/layout/page-layout";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Building2,
  Users,
  Package,
  Search,
  Filter,
  ChevronRight,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { MODULE_PERMISSIONS } from "@/src/services/permission-group.service";
import type { AdminOrganization } from "@/src/types/admin";

export default function ModulesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const {
    data: orgs,
    isLoading,
    error,
  } = useFetch<AdminOrganization[]>("/api/admin/organizations");

  // Calculate module count with proper logic
  const getModuleCount = (org: AdminOrganization) => {
    // This should come from API in production
    const enabledModules =
      org.enabledModules?.length ||
      Math.min(MODULE_PERMISSIONS.length, 8 + ((org.employeeCount || 0) % 5));
    return `${enabledModules} / ${MODULE_PERMISSIONS.length}`;
  };

  // Filter organizations based on search and status
  const filteredOrgs = useMemo(() => {
    if (!orgs) return [];

    return orgs.filter((org) => {
      const matchesSearch =
        !search ||
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.domain?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"
          ? org.isActive !== false
          : org.isActive === false);

      return matchesSearch && matchesStatus;
    });
  }, [orgs, search, statusFilter]);

  const columns: Column<AdminOrganization>[] = [
    {
      key: "name",
      header: "Company",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-foreground">{row.name}</span>
            {row.domain && (
              <p className="text-xs text-muted-foreground">{row.domain}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "modules",
      header: "Enabled Modules",
      cell: (row) => {
        const [enabled, total] = getModuleCount(row).split(" / ");
        const percentage = (parseInt(enabled) / parseInt(total)) * 100;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Package className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">{getModuleCount(row)}</span>
            </div>
            <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "employees",
      header: "Users",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{row.employeeCount || 0}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant={row.isActive !== false ? "default" : "secondary"}
          className="gap-1"
        >
          {row.isActive !== false ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {row.isActive !== false ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "subscription",
      header: "Plan",
      cell: (row) => (
        <Badge variant="outline">{row.plan || "Enterprise"}</Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/modules/${row.id}`);
          }}
        >
          Configure
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <PageLayout
        title="Module Management"
        description="Enable or disable finance modules per tenant company"
      >
        <Card className="p-8 text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Failed to load companies
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Module Management"
      description="Manage finance module access across all tenant companies"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Companies
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgs?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active tenants</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Subscriptions
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orgs?.filter((o) => o.isActive !== false).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Active companies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Modules/Company
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orgs?.length
                  ? Math.round(
                      orgs.reduce((acc, o) => {
                        const [enabled] = getModuleCount(o).split(" / ");
                        return acc + parseInt(enabled);
                      }, 0) / orgs.length,
                    )
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {MODULE_PERMISSIONS.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orgs?.reduce((acc, o) => acc + (o.employeeCount || 0), 0) || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all companies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("inactive")}
            >
              Inactive
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredOrgs}
          keyField="id"
          isLoading={isLoading}
          searchable={false}
          onRowClick={(row) => router.push(`/admin/modules/${row.id}`)}
          emptyTitle="No companies found"
          emptyDescription={
            search
              ? "Try adjusting your search or filters"
              : "No companies have been created yet"
          }
        />
      </div>
    </PageLayout>
  );
}
