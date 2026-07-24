import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const vendor = await db.vendor.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  return NextResponse.json({ vendor });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const existing = await db.vendor.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const vendor = await db.vendor.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.type !== undefined && { type: body.type.toUpperCase() }),
      ...(body.status !== undefined && { status: body.status.toUpperCase() }),
      ...(body.email !== undefined && { email: body.email || null }),
      ...(body.phone !== undefined && { phone: body.phone || null }),
      ...(body.website !== undefined && { website: body.website || null }),
      ...(body.taxId !== undefined && { taxId: body.taxId || null }),
      ...(body.paymentTerms !== undefined && { paymentTerms: body.paymentTerms.toUpperCase() }),
      ...(body.currency !== undefined && { currency: body.currency }),
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.notes !== undefined && { notes: body.notes || null }),
      ...(body.contactName !== undefined && { contactName: body.contactName || null }),
      ...(body.contactEmail !== undefined && { contactEmail: body.contactEmail || null }),
      ...(body.contactPhone !== undefined && { contactPhone: body.contactPhone || null }),
      ...(body.contactTitle !== undefined && { contactTitle: body.contactTitle || null }),
      ...(body.addressStreet !== undefined && { addressStreet: body.addressStreet || null }),
      ...(body.addressCity !== undefined && { addressCity: body.addressCity || null }),
      ...(body.addressState !== undefined && { addressState: body.addressState || null }),
      ...(body.addressZip !== undefined && { addressZip: body.addressZip || null }),
      ...(body.addressCountry !== undefined && { addressCountry: body.addressCountry || null }),
      ...(body.bankName !== undefined && { bankName: body.bankName || null }),
      ...(body.bankAccountName !== undefined && { bankAccountName: body.bankAccountName || null }),
      ...(body.bankAccountNumber !== undefined && { bankAccountNumber: body.bankAccountNumber || null }),
      ...(body.bankRoutingNumber !== undefined && { bankRoutingNumber: body.bankRoutingNumber || null }),
      ...(body.bankSwift !== undefined && { bankSwift: body.bankSwift || null }),
      ...(body.categories !== undefined && { categories: body.categories }),
    },
  });

  return NextResponse.json({ vendor });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.vendor.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const hasBills = await db.vendorBill.count({ where: { vendorId: id } });
  if (hasBills > 0) {
    return NextResponse.json({ error: "Cannot delete vendor with existing bills" }, { status: 400 });
  }

  await db.vendor.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
