import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const asset = await db.asset.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  return NextResponse.json({ asset });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await db.asset.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.category !== undefined) data.category = body.category;
  if (body.description !== undefined) data.description = body.description;
  if (body.serialNumber !== undefined) data.serialNumber = body.serialNumber;
  if (body.purchasePrice !== undefined) data.purchasePrice = Number(body.purchasePrice);
  if (body.currentValue !== undefined) data.currentValue = Number(body.currentValue);
  if (body.purchaseDate !== undefined) data.purchaseDate = body.purchaseDate;
  if (body.depreciationMethod !== undefined) data.depreciationMethod = body.depreciationMethod;
  if (body.usefulLife !== undefined) data.usefulLife = Number(body.usefulLife);
  if (body.salvageValue !== undefined) data.salvageValue = Number(body.salvageValue);
  if (body.accumulatedDepreciation !== undefined) data.accumulatedDepreciation = Number(body.accumulatedDepreciation);
  if (body.monthlyDepreciation !== undefined) data.monthlyDepreciation = Number(body.monthlyDepreciation);
  if (body.status !== undefined) data.status = body.status.toUpperCase();
  if (body.location !== undefined) data.location = body.location;
  if (body.department !== undefined) data.departmentName = body.department;
  if (body.assignedTo !== undefined) data.assignedTo = body.assignedTo;
  if (body.supplier !== undefined) data.supplier = body.supplier;
  if (body.warrantyExpiry !== undefined) data.warrantyExpiry = body.warrantyExpiry;
  if (body.notes !== undefined) data.notes = body.notes;

  const asset = await db.asset.update({
    where: { id },
    data,
  });

  return NextResponse.json({ asset });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.asset.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  await db.asset.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
