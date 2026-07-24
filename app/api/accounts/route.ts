import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const parentId = searchParams.get("parentId");
  const rootOnly = searchParams.get("rootOnly") === "true";

  const where: Prisma.AccountWhereInput = {
    organizationId: session.user.organizationId,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { accountCode: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type) where.type = type.toUpperCase() as Prisma.EnumAccountTypeFilter["equals"];
  if (category) where.category = category.toUpperCase() as Prisma.EnumAccountCategoryFilter["equals"];
  if (status) where.status = status.toUpperCase() as Prisma.EnumAccountStatusFilter["equals"];
  if (parentId) where.parentAccountId = parentId;
  if (rootOnly) where.parentAccountId = null;

  const accounts = await db.account.findMany({
    where,
    orderBy: { accountCode: "asc" },
    include: { childAccounts: true },
  });

  return NextResponse.json({ accounts });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  const existing = await db.account.findFirst({
    where: {
      organizationId: session.user.organizationId,
      accountCode: body.accountCode,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: `Account code ${body.accountCode} already exists` },
      { status: 409 }
    );
  }

  const account = await db.account.create({
    data: {
      accountCode: body.accountCode,
      name: body.name,
      type: body.type.toUpperCase(),
      category: body.category.toUpperCase(),
      subcategory: body.subcategory || null,
      parentAccountId: body.parentAccountId || null,
      normalBalance: body.normalBalance.toUpperCase(),
      currentBalance: body.currentBalance || 0,
      openingBalance: body.openingBalance || 0,
      closingBalance: body.closingBalance || 0,
      status: (body.status || "active").toUpperCase(),
      description: body.description || null,
      department: body.department || null,
      taxRelated: body.taxRelated || false,
      bankName: body.bankName || null,
      bankAccountNumber: body.bankAccountNumber || null,
      bankAccountName: body.bankAccountName || null,
      notes: body.notes || null,
      createdBy: session.user.name || session.user.email || "System",
      organizationId: session.user.organizationId,
    },
  });

  return NextResponse.json({ account }, { status: 201 });
}
