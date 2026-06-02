export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerAddress: string | null;
  totalAmount: number;
  taxAmount: number;
  dueDate: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  notes: string | null;
  pdfUrl: string | null;
  items?: CustomerInvoiceItem[];
  createdAt: string;
}

export interface CustomerInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoiceId: string;
}

export interface VendorInvoice {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  totalAmount: number;
  taxAmount: number;
  dueDate: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  notes: string | null;
  documentUrl: string | null;
  createdAt: string;
}
