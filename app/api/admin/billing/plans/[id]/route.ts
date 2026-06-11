import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  deleteBillingPlan,
  getBillingPlan,
  updateBillingPlan,
} from "@/src/services/billing-plans.service";
import type { TenantBillingPlan } from "@/src/types/billing-plan";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const plan = getBillingPlan(id);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  return NextResponse.json(plan);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const body = (await req.json()) as Partial<TenantBillingPlan>;
  const plan = updateBillingPlan(id, body);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  return NextResponse.json(plan);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const ok = deleteBillingPlan(id);
  if (!ok) {
    return NextResponse.json(
      { error: "Cannot delete the last plan or plan not found" },
      { status: 400 },
    );
  }
  return NextResponse.json({ success: true });
}
