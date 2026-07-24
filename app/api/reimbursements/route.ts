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
      { description: { contains: search, mode: "insensitive" } },
      { employeeName: { contains: search, mode: "insensitive" } },
      { department: { contains: search, mode: "insensitive" } },
      { expenseReport: { title: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (employeeId) where.employeeId = employeeId;

  const [reimbursements, total] = await Promise.all([
    db.reimbursement.findMany({
      where,
      include: {
        expenseReport: { select: { title: true } },
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
    db.reimbursement.count({ where }),
  ]);

  const mapped = reimbursements.map((r) => ({
    ...r,
    amount: Number(r.amount),
    expenseReportTitle: r.expenseReport?.title || null,
    employeeName: r.employeeName || `${r.employee?.firstName ?? ""} ${r.employee?.lastName ?? ""}`.trim(),
    employeeEmail: r.employeeEmail || r.employee?.email || null,
    department: r.department || r.employee?.department?.name || null,
  }));

  return NextResponse.json({ reimbursements: mapped, total, page, limit });
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

  const reimbursement = await db.reimbursement.create({
    data: {
      amount: body.amount || 0,
      status: "PENDING",
      description: body.description || null,
      submittedAt: body.submittedAt ? new Date(body.submittedAt) : new Date(),
      category: body.category || null,
      paymentMethod: body.paymentMethod || null,
      employeeName,
      employeeEmail,
      department,
      expenseReportId: body.expenseReportId || null,
      employeeId: body.employeeId || null,
      organizationId,
    },
    include: {
      expenseReport: { select: { title: true } },
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

  return NextResponse.json({
    reimbursement: {
      ...reimbursement,
      amount: Number(reimbursement.amount),
      expenseReportTitle: reimbursement.expenseReport?.title || null,
      employeeName: reimbursement.employeeName || `${reimbursement.employee?.firstName ?? ""} ${reimbursement.employee?.lastName ?? ""}`.trim(),
      employeeEmail: reimbursement.employeeEmail || reimbursement.employee?.email || null,
      department: reimbursement.department || reimbursement.employee?.department?.name || null,
    },
  }, { status: 201 });
}
