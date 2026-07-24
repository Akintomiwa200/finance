export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

export type AccountCategory =
  | "current"
  | "fixed"
  | "intangible"
  | "long_term"
  | "operating"
  | "non_operating";

export type AccountStatus = "active" | "inactive" | "suspended";

export type NormalBalance = "debit" | "credit";

export interface Account {
  id: string;
  accountCode: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  subcategory?: string | null;
  parentAccountId?: string | null;
  parentAccountName?: string;
  parentAccount?: Account | null;
  childAccounts?: Account[];
  normalBalance: NormalBalance;
  currentBalance: number;
  openingBalance: number;
  closingBalance: number;
  status: AccountStatus;
  description?: string | null;
  department?: string | null;
  taxRelated: boolean;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountName?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  journalId: string;
  journalType: string;
  createdBy: string;
}

export type JournalStatus = "draft" | "pending_approval" | "approved" | "posted" | "rejected";
export type JournalType = "general" | "adjusting" | "closing" | "reversing" | "payroll" | "sales" | "purchase";

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  type: JournalType;
  status: JournalStatus;
  description: string;
  reference: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  createdBy: string;
  approvedBy?: string | null;
  postedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ACCOUNT_TYPE_CONFIG: Record<
  AccountType,
  { label: string; color: string; bgColor: string }
> = {
  asset: { label: "Asset", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
  liability: { label: "Liability", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30 dark:text-red-400" },
  equity: { label: "Equity", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" },
  revenue: { label: "Revenue", color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
  expense: { label: "Expense", color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" },
};

export const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: "asset", label: "Asset" },
  { value: "liability", label: "Liability" },
  { value: "equity", label: "Equity" },
  { value: "revenue", label: "Revenue" },
  { value: "expense", label: "Expense" },
];

export const ACCOUNT_CATEGORY_OPTIONS: { value: AccountCategory; label: string }[] = [
  { value: "current", label: "Current" },
  { value: "fixed", label: "Fixed" },
  { value: "intangible", label: "Intangible" },
  { value: "long_term", label: "Long-term" },
  { value: "operating", label: "Operating" },
  { value: "non_operating", label: "Non-operating" },
];

export function mapPrismaAccount(raw: Record<string, unknown>): Account {
  return {
    id: raw.id as string,
    accountCode: raw.accountCode as string,
    name: raw.name as string,
    type: (raw.type as string).toLowerCase() as AccountType,
    category: (raw.category as string).toLowerCase() as AccountCategory,
    subcategory: raw.subcategory as string | null,
    parentAccountId: raw.parentAccountId as string | null,
    parentAccountName: (raw.parentAccount as { name?: string } | null)?.name,
    childAccounts: raw.childAccounts as Account[] | undefined,
    normalBalance: (raw.normalBalance as string).toLowerCase() as NormalBalance,
    currentBalance: Number(raw.currentBalance),
    openingBalance: Number(raw.openingBalance),
    closingBalance: Number(raw.closingBalance),
    status: (raw.status as string).toLowerCase() as AccountStatus,
    description: raw.description as string | null,
    department: raw.department as string | null,
    taxRelated: raw.taxRelated as boolean,
    bankName: raw.bankName as string | null,
    bankAccountNumber: raw.bankAccountNumber as string | null,
    bankAccountName: raw.bankAccountName as string | null,
    notes: raw.notes as string | null,
    createdBy: raw.createdBy as string | null,
    organizationId: raw.organizationId as string | undefined,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export function mapPrismaJournalEntry(raw: Record<string, unknown>): JournalEntry {
  const lines = (raw.lines as Array<Record<string, unknown>> || []).map((l) => ({
    id: l.id as string,
    accountId: l.accountId as string,
    accountCode: (l.account as { accountCode?: string })?.accountCode || "",
    accountName: (l.account as { name?: string })?.name || "",
    description: (l.description as string) || "",
    debit: Number(l.debit),
    credit: Number(l.credit),
  }));

  return {
    id: raw.id as string,
    entryNumber: raw.entryNumber as string,
    date: raw.date as string,
    type: (raw.type as string).toLowerCase() as JournalType,
    status: (raw.status as string).toLowerCase() as JournalStatus,
    description: (raw.description as string) || "",
    reference: (raw.reference as string) || "",
    lines,
    totalDebit: Number(raw.totalDebit),
    totalCredit: Number(raw.totalCredit),
    createdBy: (raw.createdBy as string) || "",
    approvedBy: raw.approvedBy as string | null,
    postedBy: raw.postedBy as string | null,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}
