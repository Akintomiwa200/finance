import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const method = searchParams.get("method") || "";

  const where: Record<string, unknown> = {
    organizationId: session.user.organizationId,
  };

  if (status) where.status = status.toUpperCase();
  if (method) where.disposalMethod = method;

  const disposals = await db.assetDisposal.findMany({
    where,
    include: { asset: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ disposals });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  const count = await db.assetDisposal.count({
    where: { organizationId: session.user.organizationId },
  });

  const asset = await db.asset.findFirst({
    where: { id: body.assetId, organizationId: session.user.organizationId },
  });

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const saleAmount = Number(body.saleAmount) || 0;
  const disposalCost = Number(body.disposalCost) || 0;
  const netProceeds = saleAmount - disposalCost;
  const bookValueAtDisposal = Number(asset.currentValue);
  const gainLoss = netProceeds - bookValueAtDisposal;

  const disposal = await db.assetDisposal.create({
    data: {
      disposalNumber: `DIS-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`,
      disposalDate: body.disposalDate || new Date().toISOString(),
      disposalMethod: body.disposalMethod || "sale",
      saleAmount,
      disposalCost,
      netProceeds,
      bookValueAtDisposal,
      gainLoss,
      gainLossType: gainLoss >= 0 ? "gain" : "loss",
      status: "PENDING",
      buyerName: body.buyerName || null,
      buyerContact: body.buyerContact || null,
      reason: body.reason || null,
      reference: body.reference || null,
      notes: body.notes || null,
      assetId: body.assetId,
      organizationId: session.user.organizationId,
    },
    include: { asset: true },
  });

  return NextResponse.json({ disposal }, { status: 201 });
}
