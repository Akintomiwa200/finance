import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const customer = await db.customer.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  return NextResponse.json({ customer });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const existing = await db.customer.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const customer = await db.customer.update({
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
      ...(body.creditLimit !== undefined && { creditLimit: body.creditLimit }),
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
    },
  });

  return NextResponse.json({ customer });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.customer.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const hasInvoices = await db.salesInvoice.count({ where: { customerId: id } });
  if (hasInvoices > 0) {
    return NextResponse.json({ error: "Cannot delete customer with existing invoices" }, { status: 400 });
  }

  await db.customer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
