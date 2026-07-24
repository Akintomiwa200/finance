export type VendorStatusType = "active" | "inactive" | "suspended" | "pending";
export type VendorTypeEnum = "supplier" | "contractor" | "consultant" | "service_provider" | "individual";
export type PaymentTermsType = "net_15" | "net_30" | "net_45" | "net_60" | "net_90" | "due_on_receipt" | "cod";
export type BillStatusType = "draft" | "pending" | "approved" | "paid" | "overdue" | "cancelled";
export type BillTypeEnum = "purchase" | "service" | "utility" | "rent" | "other";
export type POStatusType = "draft" | "pending_approval" | "approved" | "ordered" | "partially_received" | "fully_received" | "cancelled" | "rejected";
export type POPriorityType = "low" | "medium" | "high" | "urgent";
export type DeliveryMethodType = "pickup" | "delivery" | "courier";
export type BillPaymentStatusType = "pending" | "processing" | "completed" | "failed" | "cancelled";
export type BillPaymentMethodType = "bank_transfer" | "cash" | "cheque" | "credit_card" | "online";

export interface Vendor {
  id: string;
  name: string;
  code: string;
  type: VendorTypeEnum;
  status: VendorStatusType;
  email: string | null;
  phone: string | null;
  website: string | null;
  taxId: string | null;
  paymentTerms: PaymentTermsType;
  currency: string;
  rating: number;
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
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankRoutingNumber: string | null;
  bankSwift: string | null;
  categories: string[];
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  accountCode: string | null;
  accountName: string | null;
}

export interface VendorBill {
  id: string;
  billNumber: string;
  type: BillTypeEnum;
  status: BillStatusType;
  issueDate: string;
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
  documentUrl: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  vendorId: string;
  vendorName: string;
  organizationId: string;
  lines: BillLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
  amount: number;
  accountCode: string | null;
  accountName: string | null;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  status: POStatusType;
  priority: POPriorityType;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate: string | null;
  deliveryMethod: DeliveryMethodType;
  deliveryAddress: string | null;
  deliveryNotes: string | null;
  subtotal: number;
  taxRate: number | null;
  taxAmount: number;
  totalAmount: number;
  notes: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  orderedBy: string | null;
  orderedAt: string | null;
  receivedBy: string | null;
  receivedAt: string | null;
  vendorId: string;
  vendorName: string;
  organizationId: string;
  lines: PurchaseOrderLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BillPayment {
  id: string;
  paymentNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: BillPaymentMethodType;
  status: BillPaymentStatusType;
  reference: string | null;
  notes: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  chequeNumber: string | null;
  cardLast4: string | null;
  onlineReference: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  processedBy: string | null;
  processedAt: string | null;
  confirmedBy: string | null;
  confirmedAt: string | null;
  billId: string;
  billNumber: string;
  vendorName: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export const VENDOR_TYPE_OPTIONS: { value: VendorTypeEnum; label: string }[] = [
  { value: "supplier", label: "Supplier" },
  { value: "contractor", label: "Contractor" },
  { value: "consultant", label: "Consultant" },
  { value: "service_provider", label: "Service Provider" },
  { value: "individual", label: "Individual" },
];

export const PAYMENT_TERMS_OPTIONS: { value: PaymentTermsType; label: string }[] = [
  { value: "net_15", label: "Net 15" },
  { value: "net_30", label: "Net 30" },
  { value: "net_45", label: "Net 45" },
  { value: "net_60", label: "Net 60" },
  { value: "net_90", label: "Net 90" },
  { value: "due_on_receipt", label: "Due on Receipt" },
  { value: "cod", label: "COD" },
];

export const BILL_TYPE_OPTIONS: { value: BillTypeEnum; label: string }[] = [
  { value: "purchase", label: "Purchase" },
  { value: "service", label: "Service" },
  { value: "utility", label: "Utility" },
  { value: "rent", label: "Rent" },
  { value: "other", label: "Other" },
];

export const PO_PRIORITY_OPTIONS: { value: POPriorityType; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const DELIVERY_METHOD_OPTIONS: { value: DeliveryMethodType; label: string }[] = [
  { value: "pickup", label: "Pickup" },
  { value: "delivery", label: "Delivery" },
  { value: "courier", label: "Courier" },
];

export const PAYMENT_METHOD_OPTIONS: { value: BillPaymentMethodType; label: string }[] = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "credit_card", label: "Credit Card" },
  { value: "online", label: "Online" },
];
