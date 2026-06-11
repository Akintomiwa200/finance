import type { TenantBillingPlan } from "@/src/types/billing-plan";
import { DEFAULT_TENANT_BILLING_PLANS } from "@/src/types/billing-plan";
import { generateId } from "@/src/lib/utils";

let plans: TenantBillingPlan[] = DEFAULT_TENANT_BILLING_PLANS.map((p) => ({ ...p }));

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function ensureSinglePopular(targetId: string) {
  plans = plans.map((plan) => ({
    ...plan,
    popular: plan.id === targetId,
  }));
}

export function getBillingPlans(): TenantBillingPlan[] {
  return plans.map((p) => ({ ...p }));
}

export function getBillingPlan(id: string): TenantBillingPlan | null {
  const plan = plans.find((p) => p.id === id);
  return plan ? { ...plan } : null;
}

export function createBillingPlan(
  input: Omit<TenantBillingPlan, "id"> & { id?: string },
): TenantBillingPlan {
  const baseId = input.id?.trim() || slugify(input.name) || generateId();
  let id = baseId;
  let suffix = 1;
  while (plans.some((p) => p.id === id)) {
    id = `${baseId}-${suffix++}`;
  }

  const plan: TenantBillingPlan = {
    id,
    name: input.name.trim(),
    price: Math.max(0, input.price),
    users: input.users,
    modules: input.modules,
    popular: input.popular,
    active: input.active,
    description: input.description?.trim() || undefined,
  };

  plans = [...plans, plan];

  if (plan.popular) {
    ensureSinglePopular(plan.id);
    return { ...getBillingPlan(plan.id)! };
  }

  return { ...plan };
}

export function updateBillingPlan(
  id: string,
  patch: Partial<Omit<TenantBillingPlan, "id">>,
): TenantBillingPlan | null {
  const index = plans.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: TenantBillingPlan = {
    ...plans[index],
    ...patch,
    name: patch.name?.trim() ?? plans[index].name,
    price: patch.price !== undefined ? Math.max(0, patch.price) : plans[index].price,
    description:
      patch.description !== undefined
        ? patch.description.trim() || undefined
        : plans[index].description,
  };

  if (patch.popular) {
    plans[index] = { ...updated, popular: true };
    ensureSinglePopular(id);
    return getBillingPlan(id);
  }

  if (patch.popular === false) {
    updated.popular = false;
  }

  plans[index] = updated;
  return { ...updated };
}

export function deleteBillingPlan(id: string): boolean {
  if (plans.length <= 1) return false;
  const before = plans.length;
  plans = plans.filter((p) => p.id !== id);
  if (plans.length === before) return false;
  if (!plans.some((p) => p.popular) && plans.length > 0) {
    plans[0] = { ...plans[0], popular: true };
  }
  return true;
}
