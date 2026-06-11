import { DEFAULT_TENANT_BILLING_PLANS } from "@/src/types/billing-plan";
import type { TenantBillingPlan } from "@/src/types/billing-plan";

export const TENANT_BILLING_PLANS = DEFAULT_TENANT_BILLING_PLANS;

export type TenantBillingPlanValue = string;

export const TENANT_PLAN_OPTIONS = DEFAULT_TENANT_BILLING_PLANS.map((p) => ({
  value: p.id,
  label: p.name,
}));

export function tenantPlanByIndex(
  index: number,
  source: Pick<TenantBillingPlan, "name" | "price">[] = DEFAULT_TENANT_BILLING_PLANS,
) {
  const list = source.length > 0 ? source : DEFAULT_TENANT_BILLING_PLANS;
  return list[index % list.length];
}

export function formatPlanLimits(users: number, modules: number) {
  const userLabel = users === -1 ? "Unlimited users" : `Up to ${users} users`;
  const moduleLabel = modules === -1 ? "All modules" : `${modules} modules`;
  return { userLabel, moduleLabel };
}
