import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import {
  getOrganizationPlanId,
  getOrganizationPlanModuleIds,
} from "@/src/services/org-subscription.service";
import { getBillingPlan } from "@/src/services/billing-plans.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = session.user.organizationId;

  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { id: true, name: true, slug: true, logo: true },
  });

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const planId = getOrganizationPlanId(orgId);
  const plan = getBillingPlan(planId);
  const enabledModuleIds = getOrganizationPlanModuleIds(orgId);

  return NextResponse.json({
    ...org,
    planId,
    planName: plan?.name ?? null,
    enabledModuleIds,
  });
}
