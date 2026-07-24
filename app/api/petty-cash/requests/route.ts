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
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const department = searchParams.get("department") || "";
  const priority = searchParams.get("priority") || "";

  const where: Record<string, unknown> = {
    organizationId: session.user.organizationId,
  };

  if (search) {
    where.OR = [
      { requestNumber: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { employeeName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) where.status = status.toUpperCase();
  if (category) where.category = category;
  if (department) where.departmentName = department;
  if (priority) where.priority = priority.toUpperCase();

  const requests = await db.pettyCashRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  const count = await db.pettyCashRequest.count({
    where: { organizationId: session.user.organizationId },
  });

  const request = await db.pettyCashRequest.create({
    data: {
      requestNumber: `PCR-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`,
      title: body.title || body.purpose || "",
      description: body.description || body.purpose || null,
      amount: Number(body.amount) || 0,
      category: body.category || "Other",
      priority: (body.priority || "MEDIUM").toUpperCase(),
      status: "PENDING",
      paymentMethod: (body.paymentMethod || "cash").toUpperCase(),
      requestDate: body.requestDate || new Date().toISOString(),
      expectedDate: body.expectedDate || null,
      employeeName: body.employeeName || body.requesterName || "",
      employeeEmail: body.employeeEmail || body.requesterEmail || null,
      departmentName: body.departmentName || body.requesterDepartment || null,
      position: body.position || null,
      notes: body.notes || null,
      organizationId: session.user.organizationId,
    },
  });

  return NextResponse.json({ request }, { status: 201 });
}
