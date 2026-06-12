import type { ModuleId } from "@/src/lib/permissions";
import { ALL_TENANT_MODULE_IDS } from "@/src/lib/tenant-module-catalog";
import { getBillingPlan } from "@/src/services/billing-plans.service";

const orgPlanIds: Record<string, string> = {};

export function setOrganizationPlan(orgId: string, planId: string) {
  orgPlanIds[orgId] = planId;
}

export function getOrganizationPlanId(orgId: string): string {
  if (!orgPlanIds[orgId]) {
    orgPlanIds[orgId] = "starter";
  }
  return orgPlanIds[orgId];
}

export function getOrganizationPlanModuleIds(orgId: string): ModuleId[] {
  const plan = getBillingPlan(getOrganizationPlanId(orgId));
  if (!plan) return [...ALL_TENANT_MODULE_IDS];
  if (plan.modules === -1 || plan.moduleIds.length >= ALL_TENANT_MODULE_IDS.length) {
    return [...ALL_TENANT_MODULE_IDS];
  }
  return plan.moduleIds;
}
