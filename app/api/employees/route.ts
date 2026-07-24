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
  const departmentId = searchParams.get("departmentId") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { employeeCode: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { position: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status === "active") where.isActive = true;
  if (status === "inactive") where.isActive = false;
  if (departmentId) where.departmentId = departmentId;

  const [employees, total] = await Promise.all([
    db.employee.findMany({
      where,
      include: { department: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.employee.count({ where }),
  ]);

  const mapped = employees.map((e) => ({
    ...e,
    baseSalary: Number(e.baseSalary),
    departmentName: e.department?.name || null,
  }));

  return NextResponse.json({ employees: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const lastEmployee = await db.employee.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { employeeCode: true },
  });
  let nextCode = "EMP-001";
  if (lastEmployee?.employeeCode) {
    const num = parseInt(lastEmployee.employeeCode.replace("EMP-", "")) + 1;
    nextCode = `EMP-${String(num).padStart(3, "0")}`;
  }

  const employee = await db.employee.create({
    data: {
      employeeCode: nextCode,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      position: body.position || null,
      baseSalary: body.baseSalary || 0,
      bankName: body.bankName || null,
      bankAccount: body.bankAccount || null,
      bankCode: body.bankCode || null,
      taxId: body.taxId || null,
      hireDate: body.hireDate ? new Date(body.hireDate) : null,
      isActive: body.isActive !== false,
      role: (body.role || "EMPLOYEE").toUpperCase(),
      departmentId: body.departmentId,
      organizationId,
    },
    include: { department: { select: { name: true } } },
  });

  return NextResponse.json({
    employee: {
      ...employee,
      baseSalary: Number(employee.baseSalary),
      departmentName: employee.department?.name || null,
    },
  }, { status: 201 });
}
