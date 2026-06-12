import { db } from "@/src/lib/db";
import { generateId } from "@/src/lib/utils";
import { onInvoiceSent, onPaymentSuccess } from "@/src/services/notification-events.service";

function formatMoney(amount: number | { toString(): string }) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(amount),
  );
}

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
  const invoice = await db.customerInvoice.update({
    where: { id },
    data: { status: "SENT" },
    include: { items: true },
  });

  if (invoice.customerEmail) {
    const subtotal = Number(invoice.totalAmount) - Number(invoice.taxAmount);
    void onInvoiceSent({
      email: invoice.customerEmail,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      dueDate: invoice.dueDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      lineItems: invoice.items.map((item) => ({
        name: item.description,
        quantity: String(item.quantity),
        amount: formatMoney(item.total),
      })),
      subtotal: formatMoney(subtotal),
      tax: formatMoney(invoice.taxAmount),
      total: formatMoney(invoice.totalAmount),
      actionPath: `/receivables/sales-invoices`,
    }).catch((err) => console.error("[notify] invoice sent", err));
  }

  return invoice;
}

export async function markInvoicePaid(id: string, payer?: { userId?: string; email?: string; name?: string }) {
  const invoice = await db.customerInvoice.update({
    where: { id },
    data: { status: "PAID" },
    include: { items: true },
  });

  if (payer?.email) {
    void onPaymentSuccess({
      userId: payer.userId ?? "",
      email: payer.email,
      name: payer.name,
      amount: formatMoney(invoice.totalAmount),
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      method: "Account payment",
      confirmationId: invoice.invoiceNumber,
      actionPath: `/receivables/sales-invoices`,
    }).catch((err) => console.error("[notify] payment success", err));
  }

  return invoice;
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
