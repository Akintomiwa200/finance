"use client";

import { create } from "zustand";
import type {
  Account,
  JournalEntry,
  LedgerEntry,
  mapPrismaAccount,
  mapPrismaJournalEntry,
} from "@/src/types/ledger";

interface LedgerState {
  accounts: Account[];
  journalEntries: JournalEntry[];
  loading: boolean;

  fetchAccounts: (params?: Record<string, string>) => Promise<void>;
  fetchJournalEntries: (params?: Record<string, string>) => Promise<void>;
  getAccountById: (id: string) => Account | undefined;
  getChildAccounts: (parentId: string) => Account[];
  getLedgerEntriesForAccount: (accountId: string) => LedgerEntry[];
  getJournalEntriesForAccount: (accountId: string) => JournalEntry[];
  addAccount: (data: Record<string, unknown>) => Promise<Account | null>;
  updateAccount: (id: string, data: Record<string, unknown>) => Promise<Account | null>;
  deleteAccount: (id: string) => Promise<boolean>;
  addJournalEntry: (data: Record<string, unknown>) => Promise<JournalEntry | null>;
  updateJournalEntry: (id: string, data: Record<string, unknown>) => Promise<JournalEntry | null>;
  deleteJournalEntry: (id: string) => Promise<boolean>;
  getAccountCounts: () => Record<string, number>;
  getTotalByType: () => Record<string, number>;
}

function toCamelCase(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        toCamelCase(v),
      ])
    );
  }
  return obj;
}

export const useLedgerStore = create<LedgerState>()((set, get) => ({
  accounts: [],
  journalEntries: [],
  loading: false,

  fetchAccounts: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/accounts?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch accounts");
      const data = await res.json();
      const accounts = data.accounts.map((a: Record<string, unknown>) => {
        const mapped: Account = {
          id: a.id as string,
          accountCode: a.accountCode as string,
          name: a.name as string,
          type: (a.type as string).toLowerCase() as Account["type"],
          category: (a.category as string).toLowerCase() as Account["category"],
          subcategory: a.subcategory as string | null,
          parentAccountId: a.parentAccountId as string | null,
          parentAccountName: (a.parentAccount as { name?: string } | null)?.name,
          childAccounts: (a.childAccounts as Array<Record<string, unknown>> | undefined)?.map((ca) => ({
            id: ca.id as string,
            accountCode: ca.accountCode as string,
            name: ca.name as string,
            type: (ca.type as string).toLowerCase() as Account["type"],
            category: (ca.category as string).toLowerCase() as Account["category"],
            normalBalance: (ca.normalBalance as string).toLowerCase() as Account["normalBalance"],
            currentBalance: Number(ca.currentBalance),
            openingBalance: Number(ca.openingBalance),
            closingBalance: Number(ca.closingBalance),
            status: (ca.status as string).toLowerCase() as Account["status"],
            description: ca.description as string | null,
            taxRelated: ca.taxRelated as boolean,
            createdAt: ca.createdAt as string,
            updatedAt: ca.updatedAt as string,
          })),
          normalBalance: (a.normalBalance as string).toLowerCase() as Account["normalBalance"],
          currentBalance: Number(a.currentBalance),
          openingBalance: Number(a.openingBalance),
          closingBalance: Number(a.closingBalance),
          status: (a.status as string).toLowerCase() as Account["status"],
          description: a.description as string | null,
          department: a.department as string | null,
          taxRelated: a.taxRelated as boolean,
          bankName: a.bankName as string | null,
          bankAccountNumber: a.bankAccountNumber as string | null,
          bankAccountName: a.bankAccountName as string | null,
          notes: a.notes as string | null,
          createdBy: a.createdBy as string | null,
          organizationId: a.organizationId as string | undefined,
          createdAt: a.createdAt as string,
          updatedAt: a.updatedAt as string,
        };
        return mapped;
      });
      set({ accounts, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchJournalEntries: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/journal-entries?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch journal entries");
      const data = await res.json();
      const entries = data.entries.map((je: Record<string, unknown>) => {
        const lines = (je.lines as Array<Record<string, unknown>> || []).map((l) => ({
          id: l.id as string,
          accountId: l.accountId as string,
          accountCode: (l.account as Record<string, string>)?.accountCode || "",
          accountName: (l.account as Record<string, string>)?.name || "",
          description: (l.description as string) || "",
          debit: Number(l.debit),
          credit: Number(l.credit),
        }));
        return {
          id: je.id as string,
          entryNumber: je.entryNumber as string,
          date: je.date as string,
          type: (je.type as string).toLowerCase() as JournalEntry["type"],
          status: (je.status as string).toLowerCase() as JournalEntry["status"],
          description: (je.description as string) || "",
          reference: (je.reference as string) || "",
          lines,
          totalDebit: Number(je.totalDebit),
          totalCredit: Number(je.totalCredit),
          createdBy: (je.createdBy as string) || "",
          approvedBy: je.approvedBy as string | null,
          postedBy: je.postedBy as string | null,
          createdAt: je.createdAt as string,
          updatedAt: je.updatedAt as string,
        };
      });
      set({ journalEntries: entries, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getAccountById: (id) => get().accounts.find((a) => a.id === id),

  getChildAccounts: (parentId) => get().accounts.filter((a) => a.parentAccountId === parentId),

  getLedgerEntriesForAccount: (accountId) => {
    const entries: LedgerEntry[] = [];
    const account = get().getAccountById(accountId);
    if (!account) return entries;

    let runningBalance = account.openingBalance;

    for (const je of get().journalEntries.filter((j) => j.status === "posted")) {
      for (const line of je.lines.filter((l) => l.accountId === accountId)) {
        if (account.normalBalance === "debit") {
          runningBalance += line.debit - line.credit;
        } else {
          runningBalance += line.credit - line.debit;
        }
        entries.push({
          id: line.id,
          date: je.date,
          reference: je.entryNumber,
          description: line.description,
          debit: line.debit,
          credit: line.credit,
          balance: runningBalance,
          journalId: je.id,
          journalType: je.type,
          createdBy: je.createdBy,
        });
      }
    }

    return entries;
  },

  getJournalEntriesForAccount: (accountId) => {
    return get().journalEntries.filter((je) =>
      je.lines.some((l) => l.accountId === accountId)
    );
  },

  addAccount: async (data) => {
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create account");
      }
      const { account } = await res.json();
      set({ accounts: [...get().accounts, toCamelCase(account) as Account] });
      return toCamelCase(account) as Account;
    } catch {
      return null;
    }
  },

  updateAccount: async (id, data) => {
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update account");
      }
      const { account } = await res.json();
      const mapped = toCamelCase(account) as Account;
      set({
        accounts: get().accounts.map((a) => (a.id === id ? mapped : a)),
      });
      return mapped;
    } catch {
      return null;
    }
  },

  deleteAccount: async (id) => {
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete account");
      }
      set({ accounts: get().accounts.filter((a) => a.id !== id) });
      return true;
    } catch {
      return false;
    }
  },

  addJournalEntry: async (data) => {
    try {
      const res = await fetch("/api/journal-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create journal entry");
      }
      const { entry } = await res.json();
      const mapped = toCamelCase(entry) as JournalEntry;
      set({ journalEntries: [mapped, ...get().journalEntries] });
      return mapped;
    } catch {
      return null;
    }
  },

  updateJournalEntry: async (id, data) => {
    try {
      const res = await fetch(`/api/journal-entries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update journal entry");
      }
      const { entry } = await res.json();
      const mapped = toCamelCase(entry) as JournalEntry;
      set({
        journalEntries: get().journalEntries.map((je) => (je.id === id ? mapped : je)),
      });
      return mapped;
    } catch {
      return null;
    }
  },

  deleteJournalEntry: async (id) => {
    try {
      const res = await fetch(`/api/journal-entries/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete journal entry");
      }
      set({ journalEntries: get().journalEntries.filter((je) => je.id !== id) });
      return true;
    } catch {
      return false;
    }
  },

  getAccountCounts: () => {
    const counts: Record<string, number> = { all: 0, asset: 0, liability: 0, equity: 0, revenue: 0, expense: 0 };
    for (const a of get().accounts) {
      counts.all++;
      counts[a.type]++;
    }
    return counts;
  },

  getTotalByType: () => {
    const totals: Record<string, number> = { asset: 0, liability: 0, equity: 0, revenue: 0, expense: 0 };
    for (const a of get().accounts) {
      if (!a.childAccounts || a.childAccounts.length === 0) {
        totals[a.type] += a.currentBalance;
      }
    }
    return totals;
  },
}));
