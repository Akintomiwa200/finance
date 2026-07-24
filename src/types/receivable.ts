export type CustomerStatusType = "active" | "inactive" | "suspended" | "blacklisted";
export type CustomerTypeEnum = "individual" | "business" | "government" | "non_profit";
export type CreditRatingType = "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "D";
export type SalesInvoiceStatusType = "draft" | "sent" | "partially_paid" | "paid" | "overdue" | "cancelled";
export type SalesInvoiceTypeEnum = "standard" | "proforma" | "credit_note" | "debit_note";
export type CustomerPaymentStatusType = "pending" | "completed" | "failed" | "refunded";
export type CustomerPaymentMethodType = "bank_transfer" | "cash" | "cheque" | "credit_card" | "online";
export type CreditNoteStatusType = "draft" | "issued" | "applied" | "cancelled";
export type CreditNoteReasonType = "product_return" | "price_adjustment" | "damaged_goods" | "service_issue" | "billing_error" | "goodwill" | "other";

export interface Customer {
  id: string;
  name: string;
  code: string;
  type: CustomerTypeEnum;
  status: CustomerStatusType;
  email: string | null;
  phone: string | null;
  website: string | null;
  taxId: string | null;
  creditLimit: number;
  currentBalance: number;
  creditRating: CreditRatingType;
  paymentTerms: string;
  currency: string;
  industry: string | null;
  notes: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactTitle: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZip: string | null;
  addressCountry: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesInvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  discount: number;
  tax: number;
  accountCode: string | null;
  accountName: string | null;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  type: SalesInvoiceTypeEnum;
  status: SalesInvoiceStatusType;
  invoiceDate: string;
  dueDate: string;
  description: string | null;
  subtotal: number;
  taxRate: number | null;
  taxAmount: number;
  discountRate: number | null;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  notes: string | null;
  terms: string | null;
  currency: string;
  approvedBy: string | null;
  approvedAt: string | null;
  sentAt: string | null;
  customerId: string;
  customerName: string;
  organizationId: string;
  lines: SalesInvoiceLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPayment {
  id: string;
  paymentNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: CustomerPaymentMethodType;
  status: CustomerPaymentStatusType;
  reference: string | null;
  notes: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  chequeNumber: string | null;
  cardLast4: string | null;
  onlineReference: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  status: CreditNoteStatusType;
  reason: CreditNoteReasonType;
  reasonDescription: string | null;
  issueDate: string;
  expiryDate: string | null;
  subtotal: number;
  taxRate: number | null;
  taxAmount: number;
  totalAmount: number;
  remainingAmount: number;
  notes: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  customerId: string;
  customerName: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export const CUSTOMER_TYPE_OPTIONS: { value: CustomerTypeEnum; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
  { value: "government", label: "Government" },
  { value: "non_profit", label: "Non-Profit" },
];

export const CREDIT_RATING_OPTIONS: { value: CreditRatingType; label: string }[] = [
  { value: "AAA", label: "AAA - Excellent" },
  { value: "AA", label: "AA - Very Good" },
  { value: "A", label: "A - Good" },
  { value: "BBB", label: "BBB - Fair" },
  { value: "BB", label: "BB - Below Average" },
  { value: "B", label: "B - Poor" },
  { value: "CCC", label: "CCC - Very Poor" },
  { value: "D", label: "D - Default" },
];

export const INVOICE_TYPE_OPTIONS: { value: SalesInvoiceTypeEnum; label: string }[] = [
  { value: "standard", label: "Standard Invoice" },
  { value: "proforma", label: "Proforma Invoice" },
  { value: "credit_note", label: "Credit Note" },
  { value: "debit_note", label: "Debit Note" },
];

export const CUSTOMER_PAYMENT_METHOD_OPTIONS: { value: CustomerPaymentMethodType; label: string }[] = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "credit_card", label: "Credit Card" },
  { value: "online", label: "Online" },
];

export const CREDIT_NOTE_REASON_OPTIONS: { value: CreditNoteReasonType; label: string }[] = [
  { value: "product_return", label: "Product Return" },
  { value: "price_adjustment", label: "Price Adjustment" },
  { value: "damaged_goods", label: "Damaged Goods" },
  { value: "service_issue", label: "Service Issue" },
  { value: "billing_error", label: "Billing Error" },
  { value: "goodwill", label: "Goodwill" },
  { value: "other", label: "Other" },
];
