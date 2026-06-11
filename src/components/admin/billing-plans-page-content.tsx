"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Layers,
  Sparkles,
  Pencil,
  Trash2,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { useMutation } from "@/src/hooks/use-mutation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { EmptyState } from "@/src/components/ui/empty-state";
import { DataTable, type Column } from "@/src/components/ui/data-table";
import { BillingPlanModal } from "@/src/components/admin/billing-plan-modal";
import { CHART_COLORS } from "@/src/components/charts/chart-theme";
import { api } from "@/src/lib/api";
import { cn, formatCurrency } from "@/src/lib/utils";
import { formatPlanLimits } from "@/src/lib/tenant-billing-plans";
import { useToast } from "@/src/components/ui/use-toast";
import type { TenantBillingPlan } from "@/src/types/billing-plan";

function DashCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <DashCard className="flex items-center gap-4">
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          iconClassName,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      </div>
    </DashCard>
  );
}

function PlanFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
      <span>{children}</span>
    </li>
  );
}

export function BillingPlansPageContent() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingPlan, setEditingPlan] = useState<TenantBillingPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TenantBillingPlan | null>(null);

  const { data: plans, isLoading, refetch } = useFetch<TenantBillingPlan[]>(
    "/api/admin/billing/plans",
  );

  const { mutate: deletePlan, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/admin/billing/plans/${id}`);
      return res.success
        ? { success: true, data: undefined }
        : { success: false, error: res.error ?? "Delete failed" };
    },
  });

  const filtered = useMemo(() => {
    const list = plans ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [plans, search]);

  const stats = useMemo(() => {
    const list = plans ?? [];
    const active = list.filter((p) => p.active).length;
    const avg =
      list.length > 0
        ? Math.round(list.reduce((sum, p) => sum + p.price, 0) / list.length)
        : 0;
    const popular = list.find((p) => p.popular)?.name ?? "—";
    return { total: list.length, active, avg, popular };
  }, [plans]);

  const openCreate = () => {
    setEditingPlan(null);
    setModalMode("create");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingPlan(null);
  };

  const openEdit = (plan: TenantBillingPlan) => {
    setEditingPlan(plan);
    setModalMode("edit");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deletePlan(deleteTarget.id);
    if (result.success) {
      toast({ title: "Plan deleted" });
      setDeleteTarget(null);
      refetch();
      return;
    }
    toast({
      title: "Could not delete plan",
      description: result.error,
      variant: "destructive",
    });
  };

  const columns: Column<TenantBillingPlan>[] = [
    {
      key: "name",
      header: "Plan",
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.id}</p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price / mo",
      cell: (row) => <span className="font-medium">{formatCurrency(row.price)}</span>,
    },
    {
      key: "limits",
      header: "Limits",
      cell: (row) => {
        const { userLabel, moduleLabel } = formatPlanLimits(row.users, row.modules);
        return (
          <span className="text-sm text-muted-foreground">
            {userLabel} · {moduleLabel}
          </span>
        );
      },
    },
    {
      key: "flags",
      header: "Status",
      cell: (row) => (
        <div className="flex flex-wrap gap-1.5">
          {row.popular && <Badge variant="info">Popular</Badge>}
          <Badge variant={row.active ? "success" : "secondary"}>
            {row.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(row)}
            disabled={(plans?.length ?? 0) <= 1}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="primary" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total plans"
          value={stats.total}
          icon={<Layers className="h-5 w-5" />}
          iconClassName="bg-brand-600/10 text-brand-600"
        />
        <StatCard
          label="Active plans"
          value={stats.active}
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconClassName="bg-emerald-500/15 text-emerald-600"
        />
        <StatCard
          label="Average price"
          value={formatCurrency(stats.avg)}
          icon={<CircleDollarSign className="h-5 w-5" />}
          iconClassName="bg-violet-500/15 text-violet-600"
        />
        <StatCard
          label="Popular tier"
          value={stats.popular}
          icon={<Sparkles className="h-5 w-5" />}
          iconClassName="bg-amber-500/15 text-amber-600"
        />
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plans..."
          className="h-10 rounded-xl border-border/80 bg-card pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No plans found"
          description={search ? "Try a different search term." : "Create your first tenant pricing plan."}
          action={
            !search ? (
              <Button variant="primary" onClick={openCreate}>
                Create Plan
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-3">
            {filtered.map((plan, index) => {
              const accent = CHART_COLORS[index % CHART_COLORS.length];
              const { userLabel, moduleLabel } = formatPlanLimits(plan.users, plan.modules);
              return (
                <DashCard
                  key={plan.id}
                  className={cn(
                    "relative overflow-hidden transition-shadow hover:shadow-md",
                    plan.popular && "ring-2 ring-brand-600/25 border-brand-600/30",
                    !plan.active && "opacity-75",
                  )}
                >
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                        {plan.popular && <Badge variant="info">Popular</Badge>}
                        {!plan.active && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                        {formatCurrency(plan.price)}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </p>
                    </div>
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${accent} 18%, transparent)`,
                        color: accent,
                      }}
                    >
                      <Layers className="h-5 w-5" />
                    </div>
                  </div>

                  {plan.description && (
                    <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                      {plan.description}
                    </p>
                  )}

                  <ul className="relative mt-4 space-y-2">
                    <PlanFeature>{userLabel}</PlanFeature>
                    <PlanFeature>{moduleLabel}</PlanFeature>
                    <PlanFeature>Billed monthly to tenant companies</PlanFeature>
                  </ul>

                  <div className="relative mt-6 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => openEdit(plan)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Plan
                    </Button>
                  </div>
                </DashCard>
              );
            })}
          </div>

          <DashCard className="overflow-hidden p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">All plans</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage limits, pricing, and visibility for each tier
              </p>
            </div>
            <DataTable
              columns={columns}
              data={filtered}
              keyField="id"
              emptyTitle="No plans"
              className="border-0 shadow-none rounded-none"
            />
          </DashCard>
        </>
      )}

      <BillingPlanModal
        open={modalMode !== null}
        mode={modalMode === "edit" ? "edit" : "create"}
        plan={editingPlan}
        onClose={closeModal}
        onSaved={refetch}
      />

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-semibold text-foreground">Delete plan?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{deleteTarget.name}</span> will be
              removed. Existing tenant subscriptions referencing this plan may need to be
              reassigned.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
