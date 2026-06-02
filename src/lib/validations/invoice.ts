import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.coerce.number().min(0.01, "Unit price must be greater than 0"),
});

export const customerInvoiceSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerAddress: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  taxAmount: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "Add at least one line item"),
});

export const vendorInvoiceSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  totalAmount: z.coerce.number().min(0.01),
  taxAmount: z.coerce.number().min(0).default(0),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
});

export type CustomerInvoiceInput = z.infer<typeof customerInvoiceSchema>;
export type VendorInvoiceInput = z.infer<typeof vendorInvoiceSchema>;
