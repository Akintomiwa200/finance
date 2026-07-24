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
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [departments, total] = await Promise.all([
    db.department.findMany({
      where,
      include: { _count: { select: { employees: true } } },
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.department.count({ where }),
  ]);

  const mapped = departments.map((d) => ({
    ...d,
    budgetAmount: Number(d.budgetAmount),
    employeeCount: d._count.employees,
  }));

  return NextResponse.json({ departments: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const lastDept = await db.department.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { code: true },
  });
  let nextCode = "DEPT-001";
  if (lastDept?.code) {
    const num = parseInt(lastDept.code.replace("DEPT-", "")) + 1;
    nextCode = `DEPT-${String(num).padStart(3, "0")}`;
  }

  const department = await db.department.create({
    data: {
      name: body.name,
      code: nextCode,
      description: body.description || null,
      costCenter: body.costCenter || null,
      budgetAmount: body.budgetAmount || 0,
      head: body.head || null,
      organizationId,
    },
  });

  return NextResponse.json({
    department: { ...department, budgetAmount: Number(department.budgetAmount) },
  }, { status: 201 });
}
