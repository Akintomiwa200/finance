export interface TenantBillingPlan {
  id: string;
  name: string;
  price: number;
  users: number;
  modules: number;
  popular: boolean;
  active: boolean;
  description?: string;
}

export const DEFAULT_TENANT_BILLING_PLANS: TenantBillingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 25_000,
    users: 10,
    modules: 5,
    popular: false,
    active: true,
    description: "For small teams getting started with core finance modules.",
  },
  {
    id: "professional",
    name: "Professional",
    price: 75_000,
    users: 50,
    modules: 12,
    popular: true,
    active: true,
    description: "Growing companies that need more users and module coverage.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 200_000,
    users: -1,
    modules: -1,
    popular: false,
    active: true,
    description: "Unlimited scale, all modules, and priority support.",
  },
];
