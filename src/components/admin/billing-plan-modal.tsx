"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Layers,
  Tag,
  Users,
  Blocks,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { FieldAvatar, FormFieldRow } from "@/src/components/admin/admin-form-fields";
import { useMutation } from "@/src/hooks/use-mutation";
import { useToast } from "@/src/components/ui/use-toast";
import { api } from "@/src/lib/api";
import { formatCurrency } from "@/src/lib/utils";
import type { ModuleId } from "@/src/lib/permissions";
import {
  ALL_TENANT_MODULE_IDS,
  STARTER_PLAN_MODULES,
  TENANT_MODULE_SECTIONS,
} from "@/src/lib/tenant-module-catalog";
import type { TenantBillingPlan } from "@/src/types/billing-plan";

type PlanForm = {
  name: string;
  price: string;
  users: string;
  modules: string;
  unlimitedUsers: boolean;
  unlimitedModules: boolean;
  popular: boolean;
  active: boolean;
  description: string;
};

const emptyForm: PlanForm = {
  name: "",
  price: "",
  users: "10",
  modules: "5",
  unlimitedUsers: false,
  unlimitedModules: false,
  popular: false,
  active: true,
  description: "",
};

function planToForm(plan: TenantBillingPlan): PlanForm {
  return {
    name: plan.name,
    price: String(plan.price),
    users: plan.users === -1 ? "10" : String(plan.users),
    modules: plan.modules === -1 ? "5" : String(plan.modules),
    unlimitedUsers: plan.users === -1,
    unlimitedModules: plan.modules === -1,
    popular: plan.popular,
    active: plan.active,
    description: plan.description ?? "",
  };
}

interface BillingPlanModalProps {
  open: boolean;
  mode: "create" | "edit";
  plan?: TenantBillingPlan | null;
  onClose: () => void;
  onSaved?: () => void;
}

export function BillingPlanModal({
  open,
  mode,
  plan,
  onClose,
  onSaved,
}: BillingPlanModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<PlanForm>(emptyForm);
  const [selectedModuleIds, setSelectedModuleIds] = useState<ModuleId[]>([
    ...STARTER_PLAN_MODULES,
  ]);
  const [moduleTab, setModuleTab] = useState(TENANT_MODULE_SECTIONS[0].title);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && plan) {
      setForm(planToForm(plan));
      setSelectedModuleIds([...plan.moduleIds]);
    } else {
      setForm(emptyForm);
      setSelectedModuleIds([...STARTER_PLAN_MODULES]);
    }
    setModuleTab(TENANT_MODULE_SECTIONS[0].title);
  }, [open, mode, plan]);

  const toggleModule = (moduleId: ModuleId, enabled: boolean) => {
    if (moduleId === "dashboard" && !enabled) return;
    setSelectedModuleIds((prev) => {
      if (enabled) return [...new Set([...prev, moduleId])];
      return prev.filter((id) => id !== moduleId);
    });
    if (form.unlimitedModules) {
      setForm((f) => ({ ...f, unlimitedModules: false }));
    }
  };

  const toggleSectionModules = (sectionTitle: string, enabled: boolean) => {
    const section = TENANT_MODULE_SECTIONS.find((s) => s.title === sectionTitle);
    if (!section) return;
    const ids = section.modules.map((m) => m.id);
    setSelectedModuleIds((prev) => {
      if (enabled) return [...new Set([...prev, ...ids])];
      return prev.filter((id) => !ids.includes(id) || id === "dashboard");
    });
    if (form.unlimitedModules) {
      setForm((f) => ({ ...f, unlimitedModules: false }));
    }
  };

  const preview = useMemo(() => {
    const price = Number(form.price) || 0;
    const users = form.unlimitedUsers ? "Unlimited users" : `Up to ${form.users || 0} users`;
    const modules = form.unlimitedModules
      ? "All modules"
      : `${selectedModuleIds.length} sidebar modules`;
    return {
      title: form.name.trim() || "New plan",
      price: formatCurrency(price),
      users,
      modules,
    };
  }, [form, selectedModuleIds]);

  const { mutate, isPending } = useMutation<TenantBillingPlan, Record<string, unknown>>({
    mutationFn: async (input) => {
      if (mode === "edit" && plan) {
        const res = await api.patch<TenantBillingPlan>(
          `/api/admin/billing/plans/${plan.id}`,
          input,
        );
        return res.success && res.data
          ? { success: true, data: res.data }
          : { success: false, error: res.error ?? "Update failed" };
      }
      const res = await api.post<TenantBillingPlan>("/api/admin/billing/plans", input);
      return res.success && res.data
        ? { success: true, data: res.data }
        : { success: false, error: res.error ?? "Create failed" };
    },
  });

  const handleClose = () => {
    setForm(emptyForm);
    setSelectedModuleIds([...STARTER_PLAN_MODULES]);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast({
        title: "Plan name required",
        variant: "destructive",
      });
      return;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      toast({
        title: "Enter a valid monthly price",
        variant: "destructive",
      });
      return;
    }

    const users = form.unlimitedUsers ? -1 : Number(form.users);
    const moduleIds = form.unlimitedModules
      ? [...ALL_TENANT_MODULE_IDS]
      : [...new Set(["dashboard" as ModuleId, ...selectedModuleIds])];
    const modules = form.unlimitedModules ? -1 : moduleIds.length;

    if (!form.unlimitedUsers && (!Number.isFinite(users) || users < 1)) {
      toast({ title: "User limit must be at least 1", variant: "destructive" });
      return;
    }
    if (!form.unlimitedModules && moduleIds.length < 1) {
      toast({ title: "Select at least one module", variant: "destructive" });
      return;
    }

    const result = await mutate({
      name: form.name.trim(),
      price,
      users,
      modules,
      moduleIds,
      popular: form.popular,
      active: form.active,
      description: form.description.trim() || undefined,
    });

    if (result.success) {
      toast({
        title: mode === "edit" ? "Plan updated" : "Plan created",
      });
      onSaved?.();
      handleClose();
      return;
    }

    toast({
      title: "Could not save plan",
      description: result.error,
      variant: "destructive",
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px] sm:p-6"
      onClick={handleClose}
    >
      <div
        className="relative my-auto w-full min-w-0 max-w-5xl overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="billing-plan-modal-title"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at 12% 8%, color-mix(in srgb, var(--accent-400) 18%, transparent), transparent 50%), radial-gradient(ellipse at 88% 18%, color-mix(in srgb, #8b5cf6 14%, transparent), transparent 45%)",
          }}
        />

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-2 pt-10 text-center sm:px-10 sm:pt-12">
          <h2
            id="billing-plan-modal-title"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            {mode === "edit" ? "Edit Pricing Plan" : "Create Pricing Plan"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Subscription tiers billed to tenant companies using your platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="min-w-0 px-6 pb-8 pt-6 sm:px-10">
          <div className="mb-5 rounded-2xl border border-border/60 bg-muted/25 px-4 py-4 sm:px-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Preview
            </p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-foreground">{preview.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {preview.users} · {preview.modules}
                </p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {preview.price}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-background/40 px-4 sm:px-6">
            <FormFieldRow
              avatar={
                <FieldAvatar className="bg-brand-600/10 text-brand-600">
                  <Tag className="h-5 w-5" />
                </FieldAvatar>
              }
              title="Plan name"
              hint="Shown to tenants when choosing a subscription"
              trailing={
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Required
                </span>
              }
            >
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Professional"
                required
                className="h-10 w-full min-w-0 rounded-lg border-border/80 bg-card"
              />
            </FormFieldRow>

            <FormFieldRow
              avatar={
                <FieldAvatar className="bg-emerald-500/15 text-emerald-600">
                  <Layers className="h-5 w-5" />
                </FieldAvatar>
              }
              title="Monthly price"
              hint="Amount charged per billing cycle (NGN)"
              trailing={
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Required
                </span>
              }
            >
              <Input
                type="number"
                min={0}
                step={1000}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="75000"
                required
                className="h-10 w-full min-w-0 rounded-lg border-border/80 bg-card"
              />
            </FormFieldRow>

            <FormFieldRow
              avatar={
                <FieldAvatar>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </FieldAvatar>
              }
              title="User limit"
              hint="Maximum users included in this tier"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  disabled={form.unlimitedUsers}
                  value={form.users}
                  onChange={(e) => setForm((f) => ({ ...f, users: e.target.value }))}
                  className="h-10 w-28 min-w-0 rounded-lg border-border/80 bg-card"
                />
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Switch
                    checked={form.unlimitedUsers}
                    onCheckedChange={(unlimitedUsers) =>
                      setForm((f) => ({ ...f, unlimitedUsers }))
                    }
                  />
                  Unlimited users
                </label>
              </div>
            </FormFieldRow>

            <FormFieldRow
              avatar={
                <FieldAvatar>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </FieldAvatar>
              }
              title="Description"
              hint="Short summary for the plan card"
            >
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Ideal for mid-size finance teams..."
                rows={3}
                className="min-w-0 resize-none rounded-lg border-border/80 bg-card"
              />
            </FormFieldRow>

            <FormFieldRow
              avatar={
                <FieldAvatar className="bg-amber-500/15 text-amber-600">
                  <Sparkles className="h-5 w-5" />
                </FieldAvatar>
              }
              title="Visibility"
              hint="Control how this plan appears to tenants"
            >
              <div className="space-y-3">
                <label className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-card px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">Mark as popular</p>
                    <p className="text-xs text-muted-foreground">Highlights one recommended tier</p>
                  </div>
                  <Switch
                    checked={form.popular}
                    onCheckedChange={(popular) => setForm((f) => ({ ...f, popular }))}
                  />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-card px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">Active</p>
                    <p className="text-xs text-muted-foreground">Inactive plans are hidden from new sign-ups</p>
                  </div>
                  <Switch
                    checked={form.active}
                    onCheckedChange={(active) => setForm((f) => ({ ...f, active }))}
                  />
                </label>
              </div>
            </FormFieldRow>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-background/40">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <FieldAvatar className="bg-violet-500/15 text-violet-600">
                  <Blocks className="h-5 w-5" />
                </FieldAvatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">Tenant sidebar modules</p>
                  <p className="text-xs text-muted-foreground">
                    Companies on this plan only see these tabs; others show access denied
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch
                  checked={form.unlimitedModules}
                  onCheckedChange={(unlimitedModules) => {
                    setForm((f) => ({ ...f, unlimitedModules }));
                    if (unlimitedModules) {
                      setSelectedModuleIds([...ALL_TENANT_MODULE_IDS]);
                    }
                  }}
                />
                All modules
              </label>
            </div>

            <div className="p-4 sm:p-5">
              <Tabs value={moduleTab} onValueChange={setModuleTab}>
                <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
                  {TENANT_MODULE_SECTIONS.map((section) => (
                    <TabsTrigger
                      key={section.title}
                      value={section.title}
                      className="text-xs sm:text-sm"
                    >
                      {section.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {TENANT_MODULE_SECTIONS.map((section) => {
                  const sectionIds = section.modules.map((m) => m.id);
                  const enabledInSection = sectionIds.filter((id) =>
                    form.unlimitedModules
                      ? true
                      : selectedModuleIds.includes(id),
                  ).length;
                  const allInSection = enabledInSection === sectionIds.length;

                  return (
                    <TabsContent key={section.title} value={section.title} className="mt-0">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                          {enabledInSection} of {sectionIds.length} enabled in {section.title}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          disabled={form.unlimitedModules}
                          onClick={() => toggleSectionModules(section.title, !allInSection)}
                        >
                          {allInSection ? "Clear section" : "Enable section"}
                        </Button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {section.modules.map((mod) => {
                          const checked =
                            form.unlimitedModules || selectedModuleIds.includes(mod.id);
                          const locked = mod.id === "dashboard";
                          return (
                            <label
                              key={mod.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-3 py-2.5"
                            >
                              <div>
                                <p className="text-sm font-medium text-foreground">{mod.label}</p>
                                <p className="text-[11px] text-muted-foreground">{mod.id}</p>
                              </div>
                              <Switch
                                checked={checked}
                                disabled={form.unlimitedModules || locked}
                                onCheckedChange={(on) => toggleModule(mod.id, on)}
                              />
                            </label>
                          );
                        })}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-6 h-12 w-full rounded-xl bg-foreground text-base font-medium text-background hover:bg-foreground/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : mode === "edit" ? (
              "Save Plan"
            ) : (
              "Create Plan"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
