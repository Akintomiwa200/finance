"use client";

import { create } from "zustand";
import type {
  Vendor,
  VendorBill,
  PurchaseOrder,
  BillPayment,
} from "@/src/types/payable";

interface PayableState {
  vendors: Vendor[];
  bills: VendorBill[];
  purchaseOrders: PurchaseOrder[];
  payments: BillPayment[];
  loading: boolean;

  fetchVendors: (params?: Record<string, string>) => Promise<void>;
  fetchBills: (params?: Record<string, string>) => Promise<void>;
  fetchPurchaseOrders: (params?: Record<string, string>) => Promise<void>;
  fetchPayments: (params?: Record<string, string>) => Promise<void>;

  getVendorById: (id: string) => Vendor | undefined;
  getBillById: (id: string) => VendorBill | undefined;
  getPOById: (id: string) => PurchaseOrder | undefined;
  getPaymentById: (id: string) => BillPayment | undefined;

  addVendor: (data: Record<string, unknown>) => Promise<Vendor | null>;
  updateVendor: (id: string, data: Record<string, unknown>) => Promise<Vendor | null>;
  deleteVendor: (id: string) => Promise<boolean>;

  addBill: (data: Record<string, unknown>) => Promise<VendorBill | null>;
  updateBill: (id: string, data: Record<string, unknown>) => Promise<VendorBill | null>;
  deleteBill: (id: string) => Promise<boolean>;

  addPO: (data: Record<string, unknown>) => Promise<PurchaseOrder | null>;
  updatePO: (id: string, data: Record<string, unknown>) => Promise<PurchaseOrder | null>;
  deletePO: (id: string) => Promise<boolean>;

  addPayment: (data: Record<string, unknown>) => Promise<BillPayment | null>;
  updatePayment: (id: string, data: Record<string, unknown>) => Promise<BillPayment | null>;
  deletePayment: (id: string) => Promise<boolean>;
}

function mapVendor(raw: Record<string, unknown>): Vendor {
  return {
    id: raw.id as string,
    name: raw.name as string,
    code: raw.code as string,
    type: (raw.type as string).toLowerCase() as Vendor["type"],
    status: (raw.status as string).toLowerCase() as Vendor["status"],
    email: raw.email as string | null,
    phone: raw.phone as string | null,
    website: raw.website as string | null,
    taxId: raw.taxId as string | null,
    paymentTerms: (raw.paymentTerms as string).toLowerCase() as Vendor["paymentTerms"],
    currency: raw.currency as string,
    rating: Number(raw.rating),
    notes: raw.notes as string | null,
    contactName: raw.contactName as string | null,
    contactEmail: raw.contactEmail as string | null,
    contactPhone: raw.contactPhone as string | null,
    contactTitle: raw.contactTitle as string | null,
    addressStreet: raw.addressStreet as string | null,
    addressCity: raw.addressCity as string | null,
    addressState: raw.addressState as string | null,
    addressZip: raw.addressZip as string | null,
    addressCountry: raw.addressCountry as string | null,
    bankName: raw.bankName as string | null,
    bankAccountName: raw.bankAccountName as string | null,
    bankAccountNumber: raw.bankAccountNumber as string | null,
    bankRoutingNumber: raw.bankRoutingNumber as string | null,
    bankSwift: raw.bankSwift as string | null,
    categories: (raw.categories as string[]) || [],
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapBill(raw: Record<string, unknown>): VendorBill {
  return {
    id: raw.id as string,
    billNumber: raw.billNumber as string,
    type: (raw.type as string).toLowerCase() as VendorBill["type"],
    status: (raw.status as string).toLowerCase() as VendorBill["status"],
    issueDate: raw.issueDate as string,
    dueDate: raw.dueDate as string,
    description: raw.description as string | null,
    subtotal: Number(raw.subtotal),
    taxRate: raw.taxRate != null ? Number(raw.taxRate) : null,
    taxAmount: Number(raw.taxAmount),
    discountRate: raw.discountRate != null ? Number(raw.discountRate) : null,
    discountAmount: Number(raw.discountAmount),
    totalAmount: Number(raw.totalAmount),
    amountPaid: Number(raw.amountPaid),
    balanceDue: Number(raw.balanceDue),
    notes: raw.notes as string | null,
    documentUrl: raw.documentUrl as string | null,
    approvedBy: raw.approvedBy as string | null,
    approvedAt: raw.approvedAt as string | null,
    vendorId: raw.vendorId as string,
    vendorName: (raw.vendorName as string) || "",
    organizationId: raw.organizationId as string,
    lines: ((raw.lines as Array<Record<string, unknown>>) || []).map((l) => ({
      id: l.id as string,
      description: l.description as string,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      amount: Number(l.amount),
      accountCode: l.accountCode as string | null,
      accountName: l.accountName as string | null,
    })),
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapPO(raw: Record<string, unknown>): PurchaseOrder {
  return {
    id: raw.id as string,
    poNumber: raw.poNumber as string,
    status: (raw.status as string).toLowerCase() as PurchaseOrder["status"],
    priority: (raw.priority as string).toLowerCase() as PurchaseOrder["priority"],
    orderDate: raw.orderDate as string,
    expectedDeliveryDate: raw.expectedDeliveryDate as string,
    actualDeliveryDate: raw.actualDeliveryDate as string | null,
    deliveryMethod: (raw.deliveryMethod as string).toLowerCase() as PurchaseOrder["deliveryMethod"],
    deliveryAddress: raw.deliveryAddress as string | null,
    deliveryNotes: raw.deliveryNotes as string | null,
    subtotal: Number(raw.subtotal),
    taxRate: raw.taxRate != null ? Number(raw.taxRate) : null,
    taxAmount: Number(raw.taxAmount),
    totalAmount: Number(raw.totalAmount),
    notes: raw.notes as string | null,
    approvedBy: raw.approvedBy as string | null,
    approvedAt: raw.approvedAt as string | null,
    orderedBy: raw.orderedBy as string | null,
    orderedAt: raw.orderedAt as string | null,
    receivedBy: raw.receivedBy as string | null,
    receivedAt: raw.receivedAt as string | null,
    vendorId: raw.vendorId as string,
    vendorName: (raw.vendorName as string) || "",
    organizationId: raw.organizationId as string,
    lines: ((raw.lines as Array<Record<string, unknown>>) || []).map((l) => ({
      id: l.id as string,
      description: l.description as string,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      receivedQuantity: Number(l.receivedQuantity),
      amount: Number(l.amount),
      accountCode: l.accountCode as string | null,
      accountName: l.accountName as string | null,
    })),
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapPayment(raw: Record<string, unknown>): BillPayment {
  return {
    id: raw.id as string,
    paymentNumber: raw.paymentNumber as string,
    amount: Number(raw.amount),
    paymentDate: raw.paymentDate as string,
    paymentMethod: (raw.paymentMethod as string).toLowerCase() as BillPayment["paymentMethod"],
    status: (raw.status as string).toLowerCase() as BillPayment["status"],
    reference: raw.reference as string | null,
    notes: raw.notes as string | null,
    bankName: raw.bankName as string | null,
    bankAccountNumber: raw.bankAccountNumber as string | null,
    chequeNumber: raw.chequeNumber as string | null,
    cardLast4: raw.cardLast4 as string | null,
    onlineReference: raw.onlineReference as string | null,
    approvedBy: raw.approvedBy as string | null,
    approvedAt: raw.approvedAt as string | null,
    processedBy: raw.processedBy as string | null,
    processedAt: raw.processedAt as string | null,
    confirmedBy: raw.confirmedBy as string | null,
    confirmedAt: raw.confirmedAt as string | null,
    billId: raw.billId as string,
    billNumber: (raw.billNumber as string) || "",
    vendorName: (raw.vendorName as string) || "",
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const usePayableStore = create<PayableState>()((set, get) => ({
  vendors: [],
  bills: [],
  purchaseOrders: [],
  payments: [],
  loading: false,

  fetchVendors: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/vendors?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch vendors");
      const data = await res.json();
      set({ vendors: data.vendors.map(mapVendor), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchBills: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/bills?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch bills");
      const data = await res.json();
      set({ bills: data.bills.map(mapBill), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchPurchaseOrders: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/purchase-orders?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch purchase orders");
      const data = await res.json();
      set({ purchaseOrders: data.orders.map(mapPO), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchPayments: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/bill-payments?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      set({ payments: data.payments.map(mapPayment), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getVendorById: (id) => get().vendors.find((v) => v.id === id),
  getBillById: (id) => get().bills.find((b) => b.id === id),
  getPOById: (id) => get().purchaseOrders.find((o) => o.id === id),
  getPaymentById: (id) => get().payments.find((p) => p.id === id),

  addVendor: async (data) => {
    try {
      const res = await fetch("/api/vendors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { vendor } = await res.json();
      const mapped = mapVendor(vendor);
      set({ vendors: [mapped, ...get().vendors] });
      return mapped;
    } catch { return null; }
  },

  updateVendor: async (id, data) => {
    try {
      const res = await fetch(`/api/vendors/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { vendor } = await res.json();
      const mapped = mapVendor(vendor);
      set({ vendors: get().vendors.map((v) => (v.id === id ? mapped : v)) });
      return mapped;
    } catch { return null; }
  },

  deleteVendor: async (id) => {
    try {
      const res = await fetch(`/api/vendors/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ vendors: get().vendors.filter((v) => v.id !== id) });
      return true;
    } catch { return false; }
  },

  addBill: async (data) => {
    try {
      const res = await fetch("/api/bills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { bill } = await res.json();
      const mapped = mapBill(bill);
      set({ bills: [mapped, ...get().bills] });
      return mapped;
    } catch { return null; }
  },

  updateBill: async (id, data) => {
    try {
      const res = await fetch(`/api/bills/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { bill } = await res.json();
      const mapped = mapBill(bill);
      set({ bills: get().bills.map((b) => (b.id === id ? mapped : b)) });
      return mapped;
    } catch { return null; }
  },

  deleteBill: async (id) => {
    try {
      const res = await fetch(`/api/bills/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ bills: get().bills.filter((b) => b.id !== id) });
      return true;
    } catch { return false; }
  },

  addPO: async (data) => {
    try {
      const res = await fetch("/api/purchase-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { order } = await res.json();
      const mapped = mapPO(order);
      set({ purchaseOrders: [mapped, ...get().purchaseOrders] });
      return mapped;
    } catch { return null; }
  },

  updatePO: async (id, data) => {
    try {
      const res = await fetch(`/api/purchase-orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { order } = await res.json();
      const mapped = mapPO(order);
      set({ purchaseOrders: get().purchaseOrders.map((o) => (o.id === id ? mapped : o)) });
      return mapped;
    } catch { return null; }
  },

  deletePO: async (id) => {
    try {
      const res = await fetch(`/api/purchase-orders/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ purchaseOrders: get().purchaseOrders.filter((o) => o.id !== id) });
      return true;
    } catch { return false; }
  },

  addPayment: async (data) => {
    try {
      const res = await fetch("/api/bill-payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { payment } = await res.json();
      const mapped = mapPayment(payment);
      set({ payments: [mapped, ...get().payments] });
      return mapped;
    } catch { return null; }
  },

  updatePayment: async (id, data) => {
    try {
      const res = await fetch(`/api/bill-payments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { payment } = await res.json();
      const mapped = mapPayment(payment);
      set({ payments: get().payments.map((p) => (p.id === id ? mapped : p)) });
      return mapped;
    } catch { return null; }
  },

  deletePayment: async (id) => {
    try {
      const res = await fetch(`/api/bill-payments/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ payments: get().payments.filter((p) => p.id !== id) });
      return true;
    } catch { return false; }
  },
}));
