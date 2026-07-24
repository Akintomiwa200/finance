import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const disposal = await db.assetDisposal.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { asset: true },
  });

  if (!disposal) {
    return NextResponse.json({ error: "Disposal not found" }, { status: 404 });
  }

  return NextResponse.json({ disposal });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await db.assetDisposal.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Disposal not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (body.status !== undefined) data.status = body.status.toUpperCase();
  if (body.approvedBy !== undefined) data.approvedBy = body.approvedBy;
  if (body.approvedAt !== undefined) data.approvedAt = body.approvedAt || new Date().toISOString();
  if (body.processedBy !== undefined) data.processedBy = body.processedBy;
  if (body.processedAt !== undefined) data.processedAt = body.processedAt || new Date().toISOString();
  if (body.disposalDate !== undefined) data.disposalDate = body.disposalDate;
  if (body.disposalMethod !== undefined) data.disposalMethod = body.disposalMethod;
  if (body.saleAmount !== undefined) data.saleAmount = Number(body.saleAmount);
  if (body.disposalCost !== undefined) data.disposalCost = Number(body.disposalCost);
  if (body.buyerName !== undefined) data.buyerName = body.buyerName;
  if (body.buyerContact !== undefined) data.buyerContact = body.buyerContact;
  if (body.reason !== undefined) data.reason = body.reason;
  if (body.reference !== undefined) data.reference = body.reference;
  if (body.notes !== undefined) data.notes = body.notes;

  if (body.status === "APPROVED") {
    data.approvedAt = data.approvedAt || new Date().toISOString();
  }
  if (body.status === "COMPLETED") {
    data.processedAt = data.processedAt || new Date().toISOString();
  }

  const disposal = await db.assetDisposal.update({
    where: { id },
    data,
    include: { asset: true },
  });

  if (body.status === "COMPLETED" && existing.assetId) {
    await db.asset.update({
      where: { id: existing.assetId },
      data: { status: "DISPOSED" },
    });
  }

  return NextResponse.json({ disposal });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.assetDisposal.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Disposal not found" }, { status: 404 });
  }

  await db.assetDisposal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
