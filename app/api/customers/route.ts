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
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (type) where.type = type.toUpperCase();
  if (status) where.status = status.toUpperCase();

  const [customers, total] = await Promise.all([
    db.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.customer.count({ where }),
  ]);

  return NextResponse.json({ customers, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const lastCustomer = await db.customer.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { code: true },
  });
  let nextCode = "CUST-001";
  if (lastCustomer?.code) {
    const num = parseInt(lastCustomer.code.replace("CUST-", "")) + 1;
    nextCode = `CUST-${String(num).padStart(3, "0")}`;
  }

  const customer = await db.customer.create({
    data: {
      name: body.name,
      code: nextCode,
      type: (body.type || "business").toUpperCase(),
      status: (body.status || "active").toUpperCase(),
      email: body.email || null,
      phone: body.phone || null,
      website: body.website || null,
      taxId: body.taxId || null,
      paymentTerms: (body.paymentTerms || "net_30").toUpperCase(),
      currency: body.currency || "USD",
      creditLimit: body.creditLimit || 0,
      rating: body.rating || 0,
      notes: body.notes || null,
      contactName: body.contactName || null,
      contactEmail: body.contactEmail || null,
      contactPhone: body.contactPhone || null,
      contactTitle: body.contactTitle || null,
      addressStreet: body.addressStreet || null,
      addressCity: body.addressCity || null,
      addressState: body.addressState || null,
      addressZip: body.addressZip || null,
      addressCountry: body.addressCountry || null,
      organizationId,
    },
  });

  return NextResponse.json({ customer }, { status: 201 });
}
