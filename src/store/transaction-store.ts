"use client";

import { create } from "zustand";
import type { Transaction } from "@/src/types/transaction";

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  fetchTransactions: (params?: Record<string, string>) => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined;
  addTransaction: (data: Record<string, unknown>) => Promise<Transaction | null>;
  updateTransaction: (id: string, data: Record<string, unknown>) => Promise<Transaction | null>;
  deleteTransaction: (id: string) => Promise<boolean>;
}

function mapTransaction(raw: Record<string, unknown>): Transaction {
  return {
    id: raw.id as string,
    title: raw.title as string,
    description: raw.description as string | null,
    amount: Number(raw.amount),
    type: raw.type as Transaction["type"],
    category: raw.category as string,
    status: raw.status as Transaction["status"],
    date: raw.date as string,
    account: raw.account as string | null,
    merchant: raw.merchant as string | null,
    reference: raw.reference as string | null,
    notes: raw.notes as string | null,
    receipt: raw.receipt as string | null,
    employeeId: raw.employeeId as string | null,
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-001",
    title: "Client Payment - Project Alpha",
    description: "Payment received for Q1 consulting services",
    amount: 2500000,
    type: "INCOME",
    category: "client_payment",
    status: "COMPLETED",
    date: "2026-03-01",
    account: "Company Operating Account",
    merchant: "Nigerian Breweries PLC",
    reference: "TRF-2026-0456",
    notes: "Full payment for January-March consulting",
    receipt: null,
    employeeId: null,
    organizationId: "org-1",
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "txn-002",
    title: "Office Supplies Purchase",
    description: "Monthly office supplies from Office Depot",
    amount: 185000,
    type: "EXPENSE",
    category: "supplies",
    status: "COMPLETED",
    date: "2026-03-05",
    account: "Company Operating Account",
    merchant: "Office Depot",
    reference: "INV-2026-045",
    notes: "Monthly supplies restocking",
    receipt: null,
    employeeId: null,
    organizationId: "org-1",
    createdAt: "2026-03-05T08:30:00Z",
    updatedAt: "2026-03-05T08:30:00Z",
  },
  {
    id: "txn-003",
    title: "Salary Payment - March",
    description: "Monthly salary disbursement for all staff",
    amount: 4500000,
    type: "EXPENSE",
    category: "salary",
    status: "COMPLETED",
    date: "2026-03-15",
    account: "Company Operating Account",
    merchant: null,
    reference: "SAL-2026-03",
    notes: "March salary payments",
    receipt: null,
    employeeId: null,
    organizationId: "org-1",
    createdAt: "2026-03-15T09:00:00Z",
    updatedAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "txn-004",
    title: "Office Rent Payment",
    description: "Monthly office rent for Lagos office",
    amount: 1200000,
    type: "EXPENSE",
    category: "rent",
    status: "PENDING",
    date: "2026-03-18",
    account: "Company Operating Account",
    merchant: "Property Management Ltd",
    reference: "RENT-2026-03",
    notes: "Awaiting approval from Finance Manager",
    receipt: null,
    employeeId: null,
    organizationId: "org-1",
    createdAt: "2026-03-18T11:00:00Z",
    updatedAt: "2026-03-18T11:00:00Z",
  },
  {
    id: "txn-005",
    title: "Client Payment - Project Beta",
    description: "Payment from Access Bank for software development",
    amount: 3200000,
    type: "INCOME",
    category: "client_payment",
    status: "PENDING",
    date: "2026-03-20",
    account: "Company Operating Account",
    merchant: "Access Bank Plc",
    reference: "TRF-2026-0901",
    notes: "Awaiting bank confirmation",
    receipt: null,
    employeeId: null,
    organizationId: "org-1",
    createdAt: "2026-03-20T14:00:00Z",
    updatedAt: "2026-03-20T14:00:00Z",
  },
  {
    id: "txn-006",
    title: "Electricity Bill",
    description: "Monthly electricity bill payment",
    amount: 85000,
    type: "EXPENSE",
    category: "utilities",
    status: "COMPLETED",
    date: "2026-03-22",
    account: "Company Operating Account",
    merchant: "Power Utility Company",
    reference: "UTIL-2026-03",
    notes: null,
    receipt: null,
    employeeId: null,
    organizationId: "org-1",
    createdAt: "2026-03-22T09:00:00Z",
    updatedAt: "2026-03-22T09:00:00Z",
  },
  {
    id: "txn-007",
    title: "Transfer to Savings",
    description: "Monthly transfer to savings account",
    amount: 500000,
    type: "TRANSFER",
    category: "other",
    status: "COMPLETED",
    date: "2026-03-25",
    account: "Company Savings Account",
    merchant: null,
    reference: "TRF-INT-001",
    notes: "Internal transfer to savings",
    receipt: null,
    employeeId: null,
    organizationId: "org-1",
    createdAt: "2026-03-25T10:00:00Z",
    updatedAt: "2026-03-25T10:00:00Z",
  },
  {
    id: "txn-008",
    title: "Marketing Campaign",
    description: "Digital marketing campaign for Q2",
    amount: 350000,
    type: "EXPENSE",
    category: "marketing",
    status: "CANCELLED",
    date: "2026-03-28",
    account: "Company Operating Account",
    merchant: "Digital Agency Ltd",
    reference: "MKT-2026-Q2",
    notes: "Campaign postponed to Q3",
    receipt: null,
    employeeId: null,
    organizationId: "org-1",
    createdAt: "2026-03-28T15:00:00Z",
    updatedAt: "2026-03-28T15:00:00Z",
  },
];

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,

  fetchTransactions: async () => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    set({ transactions: MOCK_TRANSACTIONS, loading: false });
  },

  getTransactionById: (id: string) => {
    return get().transactions.find((t) => t.id === id);
  },

  addTransaction: async (data) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      title: data.title as string,
      description: (data.description as string) || null,
      amount: Number(data.amount),
      type: data.type as Transaction["type"],
      category: data.category as string,
      status: (data.status as Transaction["status"]) || "PENDING",
      date: data.date as string,
      account: (data.account as string) || null,
      merchant: (data.merchant as string) || null,
      reference: (data.reference as string) || null,
      notes: (data.notes as string) || null,
      receipt: (data.receipt as string) || null,
      employeeId: (data.employeeId as string) || null,
      organizationId: "org-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ transactions: [newTxn, ...s.transactions], loading: false }));
    return newTxn;
  },

  updateTransaction: async (id, data) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    let updated: Transaction | null = null;
    set((s) => ({
      transactions: s.transactions.map((t) => {
        if (t.id !== id) return t;
        updated = {
          ...t,
          title: (data.title as string) ?? t.title,
          description: (data.description as string | null) ?? t.description,
          amount: data.amount !== undefined ? Number(data.amount) : t.amount,
          type: (data.type as Transaction["type"]) ?? t.type,
          category: (data.category as string) ?? t.category,
          status: (data.status as Transaction["status"]) ?? t.status,
          date: (data.date as string) ?? t.date,
          account: (data.account as string | null) ?? t.account,
          merchant: (data.merchant as string | null) ?? t.merchant,
          reference: (data.reference as string | null) ?? t.reference,
          notes: (data.notes as string | null) ?? t.notes,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }),
      loading: false,
    }));
    return updated;
  },

  deleteTransaction: async (id) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
      loading: false,
    }));
    return true;
  },
}));
