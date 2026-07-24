import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const employeeId = searchParams.get("employeeId") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { employeeName: { contains: search, mode: "insensitive" } },
      { department: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (employeeId) where.employeeId = employeeId;

  const [reports, total] = await Promise.all([
    db.expenseReport.findMany({
      where,
      include: {
        items: true,
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.expenseReport.count({ where }),
  ]);

  const mapped = reports.map((r) => ({
    ...r,
    totalAmount: Number(r.totalAmount),
    employeeName: r.employeeName || `${r.employee?.firstName ?? ""} ${r.employee?.lastName ?? ""}`.trim(),
    employeeEmail: r.employeeEmail || r.employee?.email || null,
    department: r.department || r.employee?.department?.name || null,
    items: r.items.map((i) => ({
      ...i,
      amount: Number(i.amount),
    })),
  }));

  return NextResponse.json({ expenseReports: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const employee = await db.employee.findFirst({
    where: { id: body.employeeId, organizationId },
    select: { firstName: true, lastName: true, email: true, department: { select: { name: true } } },
  });

  const employeeName = body.employeeName || (employee ? `${employee.firstName} ${employee.lastName}` : null);
  const employeeEmail = body.employeeEmail || employee?.email || null;
  const department = body.department || employee?.department?.name || null;

  const totalAmount = (body.items || []).reduce((sum: number, item: Record<string, unknown>) => sum + (Number(item.amount) || 0), 0);

  const expenseReport = await db.$transaction(async (tx) => {
    const report = await tx.expenseReport.create({
      data: {
        title: body.title,
        description: body.description || null,
        department,
        totalAmount,
        status: "DRAFT",
        submittedAt: body.submittedAt ? new Date(body.submittedAt) : null,
        receiptUrl: body.receiptUrl || null,
        notes: body.notes || null,
        employeeId: body.employeeId || null,
        employeeName,
        employeeEmail,
        organizationId,
      },
    });

    if (body.items && body.items.length > 0) {
      await tx.expenseItem.createMany({
        data: body.items.map((item: Record<string, unknown>) => ({
          category: item.category || "OTHER",
          description: item.description || null,
          amount: item.amount || 0,
          receiptUrl: item.receiptUrl || null,
          expenseDate: item.expenseDate ? new Date(item.expenseDate as string) : null,
          paymentMethod: item.paymentMethod || null,
          isReimbursable: item.isReimbursable !== false,
          merchant: item.merchant || null,
          expenseReportId: report.id,
        })),
      });
    }

    return tx.expenseReport.findUnique({
      where: { id: report.id },
      include: {
        items: true,
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: { select: { name: true } },
          },
        },
      },
    });
  });

  return NextResponse.json({
    expenseReport: {
      ...expenseReport!,
      totalAmount: Number(expenseReport!.totalAmount),
      employeeName: expenseReport!.employeeName || `${expenseReport!.employee?.firstName ?? ""} ${expenseReport!.employee?.lastName ?? ""}`.trim(),
      employeeEmail: expenseReport!.employeeEmail || expenseReport!.employee?.email || null,
      department: expenseReport!.department || expenseReport!.employee?.department?.name || null,
      items: expenseReport!.items.map((i) => ({
        ...i,
        amount: Number(i.amount),
      })),
    },
  }, { status: 201 });
}
