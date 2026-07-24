import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const account = await db.account.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      childAccounts: true,
      parentAccount: true,
    },
  });

  if (!account) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ account });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await db.account.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (body.accountCode !== undefined) data.accountCode = body.accountCode;
  if (body.name !== undefined) data.name = body.name;
  if (body.type !== undefined) data.type = body.type.toUpperCase();
  if (body.category !== undefined) data.category = body.category.toUpperCase();
  if (body.subcategory !== undefined) data.subcategory = body.subcategory;
  if (body.parentAccountId !== undefined) data.parentAccountId = body.parentAccountId || null;
  if (body.normalBalance !== undefined) data.normalBalance = body.normalBalance.toUpperCase();
  if (body.currentBalance !== undefined) data.currentBalance = body.currentBalance;
  if (body.openingBalance !== undefined) data.openingBalance = body.openingBalance;
  if (body.closingBalance !== undefined) data.closingBalance = body.closingBalance;
  if (body.status !== undefined) data.status = body.status.toUpperCase();
  if (body.description !== undefined) data.description = body.description;
  if (body.department !== undefined) data.department = body.department;
  if (body.taxRelated !== undefined) data.taxRelated = body.taxRelated;
  if (body.bankName !== undefined) data.bankName = body.bankName;
  if (body.bankAccountNumber !== undefined) data.bankAccountNumber = body.bankAccountNumber;
  if (body.bankAccountName !== undefined) data.bankAccountName = body.bankAccountName;
  if (body.notes !== undefined) data.notes = body.notes;

  const account = await db.account.update({
    where: { id },
    data,
  });

  return NextResponse.json({ account });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await db.account.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { childAccounts: true, journalLines: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.childAccounts.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete account with sub-accounts. Remove sub-accounts first." },
      { status: 400 }
    );
  }

  if (existing.journalLines.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete account with journal entries. Deactivate instead." },
      { status: 400 }
    );
  }

  await db.account.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
