"use client";

import { create } from "zustand";
import type {
  Customer,
  SalesInvoice,
  CustomerPayment,
  CreditNote,
} from "@/src/types/receivable";

interface ReceivableState {
  customers: Customer[];
  invoices: SalesInvoice[];
  payments: CustomerPayment[];
  creditNotes: CreditNote[];
  loading: boolean;
  _pollInterval: ReturnType<typeof setInterval> | null;

  fetchCustomers: (params?: Record<string, string>) => Promise<void>;
  fetchInvoices: (params?: Record<string, string>) => Promise<void>;
  fetchPayments: (params?: Record<string, string>) => Promise<void>;
  fetchCreditNotes: (params?: Record<string, string>) => Promise<void>;

  getCustomerById: (id: string) => Customer | undefined;
  getInvoiceById: (id: string) => SalesInvoice | undefined;
  getPaymentById: (id: string) => CustomerPayment | undefined;
  getCreditNoteById: (id: string) => CreditNote | undefined;

  addCustomer: (data: Record<string, unknown>) => Promise<Customer | null>;
  updateCustomer: (id: string, data: Record<string, unknown>) => Promise<Customer | null>;
  deleteCustomer: (id: string) => Promise<boolean>;

  addInvoice: (data: Record<string, unknown>) => Promise<SalesInvoice | null>;
  updateInvoice: (id: string, data: Record<string, unknown>) => Promise<SalesInvoice | null>;
  deleteInvoice: (id: string) => Promise<boolean>;

  addPayment: (data: Record<string, unknown>) => Promise<CustomerPayment | null>;
  updatePayment: (id: string, data: Record<string, unknown>) => Promise<CustomerPayment | null>;
  deletePayment: (id: string) => Promise<boolean>;

  addCreditNote: (data: Record<string, unknown>) => Promise<CreditNote | null>;
  updateCreditNote: (id: string, data: Record<string, unknown>) => Promise<CreditNote | null>;
  deleteCreditNote: (id: string) => Promise<boolean>;
  startPolling: () => void;
  stopPolling: () => void;
}

function mapCustomer(raw: Record<string, unknown>): Customer {
  return {
    id: raw.id as string,
    name: raw.name as string,
    code: raw.code as string,
    type: (raw.type as string).toLowerCase() as Customer["type"],
    status: (raw.status as string).toLowerCase() as Customer["status"],
    email: raw.email as string | null,
    phone: raw.phone as string | null,
    website: raw.website as string | null,
    taxId: raw.taxId as string | null,
    creditLimit: Number(raw.creditLimit),
    currentBalance: Number(raw.currentBalance),
    creditRating: (raw.creditRating as string).toUpperCase() as Customer["creditRating"],
    paymentTerms: raw.paymentTerms as string,
    currency: raw.currency as string,
    industry: raw.industry as string | null,
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
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapInvoice(raw: Record<string, unknown>): SalesInvoice {
  return {
    id: raw.id as string,
    invoiceNumber: raw.invoiceNumber as string,
    type: (raw.type as string).toLowerCase() as SalesInvoice["type"],
    status: (raw.status as string).toLowerCase() as SalesInvoice["status"],
    invoiceDate: raw.invoiceDate as string,
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
    terms: raw.terms as string | null,
    currency: raw.currency as string,
    approvedBy: raw.approvedBy as string | null,
    approvedAt: raw.approvedAt as string | null,
    sentAt: raw.sentAt as string | null,
    customerId: raw.customerId as string,
    customerName: (raw.customerName as string) || "",
    organizationId: raw.organizationId as string,
    lines: ((raw.lines as Array<Record<string, unknown>>) || []).map((l) => ({
      id: l.id as string,
      description: l.description as string,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      amount: Number(l.amount),
      discount: Number(l.discount),
      tax: Number(l.tax),
      accountCode: l.accountCode as string | null,
      accountName: l.accountName as string | null,
    })),
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapPayment(raw: Record<string, unknown>): CustomerPayment {
  return {
    id: raw.id as string,
    paymentNumber: raw.paymentNumber as string,
    amount: Number(raw.amount),
    paymentDate: raw.paymentDate as string,
    paymentMethod: (raw.paymentMethod as string).toLowerCase() as CustomerPayment["paymentMethod"],
    status: (raw.status as string).toLowerCase() as CustomerPayment["status"],
    reference: raw.reference as string | null,
    notes: raw.notes as string | null,
    bankName: raw.bankName as string | null,
    bankAccountNumber: raw.bankAccountNumber as string | null,
    chequeNumber: raw.chequeNumber as string | null,
    cardLast4: raw.cardLast4 as string | null,
    onlineReference: raw.onlineReference as string | null,
    approvedBy: raw.approvedBy as string | null,
    approvedAt: raw.approvedAt as string | null,
    invoiceId: raw.invoiceId as string,
    invoiceNumber: (raw.invoiceNumber as string) || "",
    customerId: raw.customerId as string,
    customerName: (raw.customerName as string) || "",
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapCreditNote(raw: Record<string, unknown>): CreditNote {
  return {
    id: raw.id as string,
    creditNoteNumber: raw.creditNoteNumber as string,
    status: (raw.status as string).toLowerCase() as CreditNote["status"],
    reason: (raw.reason as string).toLowerCase() as CreditNote["reason"],
    reasonDescription: raw.reasonDescription as string | null,
    issueDate: raw.issueDate as string,
    expiryDate: raw.expiryDate as string | null,
    subtotal: Number(raw.subtotal),
    taxRate: raw.taxRate != null ? Number(raw.taxRate) : null,
    taxAmount: Number(raw.taxAmount),
    totalAmount: Number(raw.totalAmount),
    remainingAmount: Number(raw.remainingAmount),
    notes: raw.notes as string | null,
    approvedBy: raw.approvedBy as string | null,
    approvedAt: raw.approvedAt as string | null,
    customerId: raw.customerId as string,
    customerName: (raw.customerName as string) || "",
    invoiceId: raw.invoiceId as string | null,
    invoiceNumber: (raw.invoiceNumber as string) || null,
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const useReceivableStore = create<ReceivableState>()((set, get) => ({
  customers: [],
  invoices: [],
  payments: [],
  creditNotes: [],
  loading: false,
  _pollInterval: null,

  startPolling: () => {
    const state = get();
    if (state._pollInterval) return;
    state.fetchCustomers();
    state.fetchInvoices();
    state.fetchPayments();
    state.fetchCreditNotes();
    const id = setInterval(() => {
      get().fetchCustomers();
      get().fetchInvoices();
      get().fetchPayments();
      get().fetchCreditNotes();
    }, 30000);
    set({ _pollInterval: id });
  },
  stopPolling: () => {
    const state = get();
    if (state._pollInterval) {
      clearInterval(state._pollInterval);
      set({ _pollInterval: null });
    }
  },

  fetchCustomers: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/customers?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      set({ customers: data.customers.map(mapCustomer), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchInvoices: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/sales-invoices?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch sales invoices");
      const data = await res.json();
      set({ invoices: data.invoices.map(mapInvoice), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchPayments: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/customer-payments?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch customer payments");
      const data = await res.json();
      set({ payments: data.payments.map(mapPayment), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchCreditNotes: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/credit-notes?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch credit notes");
      const data = await res.json();
      set({ creditNotes: data.creditNotes.map(mapCreditNote), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getCustomerById: (id) => get().customers.find((c) => c.id === id),
  getInvoiceById: (id) => get().invoices.find((i) => i.id === id),
  getPaymentById: (id) => get().payments.find((p) => p.id === id),
  getCreditNoteById: (id) => get().creditNotes.find((n) => n.id === id),

  addCustomer: async (data) => {
    try {
      const res = await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { customer } = await res.json();
      const mapped = mapCustomer(customer);
      set({ customers: [mapped, ...get().customers] });
      return mapped;
    } catch { return null; }
  },

  updateCustomer: async (id, data) => {
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { customer } = await res.json();
      const mapped = mapCustomer(customer);
      set({ customers: get().customers.map((c) => (c.id === id ? mapped : c)) });
      return mapped;
    } catch { return null; }
  },

  deleteCustomer: async (id) => {
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ customers: get().customers.filter((c) => c.id !== id) });
      return true;
    } catch { return false; }
  },

  addInvoice: async (data) => {
    try {
      const res = await fetch("/api/sales-invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { invoice } = await res.json();
      const mapped = mapInvoice(invoice);
      set({ invoices: [mapped, ...get().invoices] });
      return mapped;
    } catch { return null; }
  },

  updateInvoice: async (id, data) => {
    try {
      const res = await fetch(`/api/sales-invoices/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { invoice } = await res.json();
      const mapped = mapInvoice(invoice);
      set({ invoices: get().invoices.map((i) => (i.id === id ? mapped : i)) });
      return mapped;
    } catch { return null; }
  },

  deleteInvoice: async (id) => {
    try {
      const res = await fetch(`/api/sales-invoices/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ invoices: get().invoices.filter((i) => i.id !== id) });
      return true;
    } catch { return false; }
  },

  addPayment: async (data) => {
    try {
      const res = await fetch("/api/customer-payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { payment } = await res.json();
      const mapped = mapPayment(payment);
      set({ payments: [mapped, ...get().payments] });
      return mapped;
    } catch { return null; }
  },

  updatePayment: async (id, data) => {
    try {
      const res = await fetch(`/api/customer-payments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { payment } = await res.json();
      const mapped = mapPayment(payment);
      set({ payments: get().payments.map((p) => (p.id === id ? mapped : p)) });
      return mapped;
    } catch { return null; }
  },

  deletePayment: async (id) => {
    try {
      const res = await fetch(`/api/customer-payments/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ payments: get().payments.filter((p) => p.id !== id) });
      return true;
    } catch { return false; }
  },

  addCreditNote: async (data) => {
    try {
      const res = await fetch("/api/credit-notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { creditNote } = await res.json();
      const mapped = mapCreditNote(creditNote);
      set({ creditNotes: [mapped, ...get().creditNotes] });
      return mapped;
    } catch { return null; }
  },

  updateCreditNote: async (id, data) => {
    try {
      const res = await fetch(`/api/credit-notes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { creditNote } = await res.json();
      const mapped = mapCreditNote(creditNote);
      set({ creditNotes: get().creditNotes.map((n) => (n.id === id ? mapped : n)) });
      return mapped;
    } catch { return null; }
  },

  deleteCreditNote: async (id) => {
    try {
      const res = await fetch(`/api/credit-notes/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ creditNotes: get().creditNotes.filter((n) => n.id !== id) });
      return true;
    } catch { return false; }
  },
}));
