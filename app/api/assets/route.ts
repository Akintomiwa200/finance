import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const department = searchParams.get("department") || "";

  const where: Record<string, unknown> = {
    organizationId: session.user.organizationId,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { serialNumber: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) where.category = category;
  if (status) where.status = status.toUpperCase();
  if (department) where.departmentName = department;

  const assets = await db.asset.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  const count = await db.asset.count({
    where: { organizationId: session.user.organizationId },
  });

  const code = body.code || `AST-${(body.category || "GEN").substring(0, 3).toUpperCase()}-${String(count + 1).padStart(3, "0")}`;

  const purchasePrice = Number(body.purchasePrice) || 0;
  const salvageValue = Number(body.salvageValue) || 0;
  const usefulLife = Number(body.usefulLife) || 3;
  const depreciationMethod = body.depreciationMethod || "straight_line";

  let monthlyDepreciation = 0;
  if (depreciationMethod === "straight_line") {
    monthlyDepreciation = (purchasePrice - salvageValue) / (usefulLife * 12);
  } else {
    const rate = depreciationMethod === "double_declining" ? 2 / usefulLife : 1 / usefulLife;
    monthlyDepreciation = ((purchasePrice + salvageValue) / 2) * rate / 12;
  }

  const purchaseDate = new Date(body.purchaseDate || new Date());
  const monthsOwned = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const accumulatedDepreciation = Math.min(monthlyDepreciation * monthsOwned, purchasePrice - salvageValue);
  const currentValue = purchasePrice - accumulatedDepreciation;

  const asset = await db.asset.create({
    data: {
      name: body.name,
      code,
      category: body.category || "Other",
      description: body.description || null,
      serialNumber: body.serialNumber || null,
      purchasePrice,
      currentValue,
      purchaseDate: purchaseDate.toISOString(),
      depreciationMethod,
      usefulLife,
      salvageValue,
      accumulatedDepreciation,
      monthlyDepreciation,
      status: "ACTIVE",
      location: body.location || null,
      departmentName: body.department || null,
      assignedTo: body.assignedTo || null,
      supplier: body.supplier || null,
      warrantyExpiry: body.warrantyExpiry || null,
      notes: body.notes || null,
      organizationId: session.user.organizationId,
    },
  });

  return NextResponse.json({ asset }, { status: 201 });
}
