import { db } from "@/src/lib/db";
import { generateId } from "@/src/lib/utils";

export async function getCustomerInvoices(organizationId: string) {
  return db.customerInvoice.findMany({
    where: { organizationId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerInvoiceById(id: string) {
  return db.customerInvoice.findUnique({
    where: { id },
    include: { items: true },
  });
}

export async function createCustomerInvoice(data: {
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  dueDate: Date;
  taxAmount?: number;
  notes?: string;
  organizationId: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}) {
  const invoiceNumber = `INV-${generateId("")}`;
  const itemTotals = data.items.map((item) => ({
    ...item,
    total: item.quantity * item.unitPrice,
  }));
  const subtotal = itemTotals.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = data.taxAmount ?? 0;
  const totalAmount = subtotal + taxAmount;

  return db.customerInvoice.create({
    data: {
      invoiceNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      dueDate: data.dueDate,
      taxAmount,
      totalAmount,
      notes: data.notes,
      organizationId: data.organizationId,
      status: "DRAFT",
      items: {
        create: itemTotals,
      },
    },
    include: { items: true },
  });
}

export async function sendInvoice(id: string) {
  return db.customerInvoice.update({
    where: { id },
    data: { status: "SENT" },
  });
}

export async function markInvoicePaid(id: string) {
  return db.customerInvoice.update({
    where: { id },
    data: { status: "PAID" },
  });
}

export async function markInvoiceOverdue(id: string) {
  return db.customerInvoice.update({
    where: { id },
    data: { status: "OVERDUE" },
  });
}

export async function getVendorInvoices(organizationId: string) {
  return db.vendorInvoice.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createVendorInvoice(data: {
  vendorName: string;
  invoiceNumber: string;
  totalAmount: number;
  taxAmount?: number;
  dueDate: Date;
  notes?: string;
  organizationId: string;
}) {
  return db.vendorInvoice.create({
    data: {
      ...data,
      taxAmount: data.taxAmount ?? 0,
    },
  });
}
