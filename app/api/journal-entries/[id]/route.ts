import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const entry = await db.journalEntry.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      lines: {
        include: { account: { select: { id: true, accountCode: true, name: true } } },
      },
    },
  });

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await db.journalEntry.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.status === "POSTED") {
    return NextResponse.json(
      { error: "Cannot modify a posted journal entry" },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  if (body.date !== undefined) data.date = new Date(body.date);
  if (body.type !== undefined) data.type = body.type.toUpperCase();
  if (body.status !== undefined) data.status = body.status.toUpperCase();
  if (body.description !== undefined) data.description = body.description;
  if (body.reference !== undefined) data.reference = body.reference;

  if (body.status === "APPROVED") {
    data.approvedBy = session.user.name || session.user.email;
  }
  if (body.status === "POSTED") {
    data.postedBy = session.user.name || session.user.email;
  }

  if (body.lines && Array.isArray(body.lines)) {
    const totalDebit = body.lines.reduce((sum: number, l: { debit: number }) => sum + (l.debit || 0), 0);
    const totalCredit = body.lines.reduce((sum: number, l: { credit: number }) => sum + (l.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json(
        { error: "Debits must equal credits" },
        { status: 400 }
      );
    }

    data.totalDebit = totalDebit;
    data.totalCredit = totalCredit;

    await db.journalLine.deleteMany({ where: { journalEntryId: id } });
    data.lines = {
      create: body.lines.map((line: {
        accountId: string;
        description?: string;
        debit?: number;
        credit?: number;
      }) => ({
        accountId: line.accountId,
        description: line.description || null,
        debit: line.debit || 0,
        credit: line.credit || 0,
      })),
    };
  }

  const entry = await db.journalEntry.update({
    where: { id },
    data,
    include: {
      lines: {
        include: { account: { select: { id: true, accountCode: true, name: true } } },
      },
    },
  });

  return NextResponse.json({ entry });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await db.journalEntry.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.status === "POSTED") {
    return NextResponse.json(
      { error: "Cannot delete a posted journal entry" },
      { status: 400 }
    );
  }

  await db.journalEntry.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
