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

  const [vendors, total] = await Promise.all([
    db.vendor.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.vendor.count({ where }),
  ]);

  return NextResponse.json({ vendors, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const lastVendor = await db.vendor.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { code: true },
  });
  let nextCode = "VND-001";
  if (lastVendor?.code) {
    const num = parseInt(lastVendor.code.replace("VND-", "")) + 1;
    nextCode = `VND-${String(num).padStart(3, "0")}`;
  }

  const vendor = await db.vendor.create({
    data: {
      name: body.name,
      code: nextCode,
      type: (body.type || "supplier").toUpperCase(),
      status: (body.status || "active").toUpperCase(),
      email: body.email || null,
      phone: body.phone || null,
      website: body.website || null,
      taxId: body.taxId || null,
      paymentTerms: (body.paymentTerms || "net_30").toUpperCase(),
      currency: body.currency || "USD",
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
      bankName: body.bankName || null,
      bankAccountName: body.bankAccountName || null,
      bankAccountNumber: body.bankAccountNumber || null,
      bankRoutingNumber: body.bankRoutingNumber || null,
      bankSwift: body.bankSwift || null,
      categories: body.categories || [],
      organizationId,
    },
  });

  return NextResponse.json({ vendor }, { status: 201 });
}
