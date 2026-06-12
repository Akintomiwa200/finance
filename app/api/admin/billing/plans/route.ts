import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  createBillingPlan,
  getBillingPlans,
} from "@/src/services/billing-plans.service";
import type { TenantBillingPlan } from "@/src/types/billing-plan";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  return NextResponse.json(getBillingPlans());
}

export async function POST(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const body = (await req.json()) as Partial<TenantBillingPlan>;
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Plan name is required" }, { status: 400 });
  }
  if (body.price === undefined || Number.isNaN(Number(body.price))) {
    return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
  }

  const plan = createBillingPlan({
    name: body.name,
    price: Number(body.price),
    users: body.users ?? 10,
    modules: body.modules ?? 5,
    moduleIds: body.moduleIds ?? [],
    popular: body.popular ?? false,
    active: body.active ?? true,
    description: body.description,
    id: body.id,
  });

  return NextResponse.json(plan, { status: 201 });
}
