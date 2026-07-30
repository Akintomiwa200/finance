import type { ReactNode } from "react";

const INCOME_LINE = "M4 42 L28 34 L52 38 L76 26 L100 30 L124 18 L148 22 L172 14";
const EXPENSE_LINE = "M4 44 L28 40 L52 42 L76 36 L100 38 L124 32 L148 34 L172 28";

export function MiniLineChart({ compact = false }: { compact?: boolean }) {
  const h = compact ? 48 : 56;
  return (
    <svg viewBox={`0 0 176 ${h}`} className="w-full" style={{ height: h }} aria-hidden="true">
      <path d={INCOME_LINE} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
      <path d={EXPENSE_LINE} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      {[28, 76, 124].map((x) => (
        <line key={x} x1={x} y1={8} x2={x} y2={h - 6} stroke="#E5E7EB" strokeWidth="0.75" />
      ))}
    </svg>
  );
}

export function MiniPieChart() {
  return (
    <svg viewBox="0 0 80 80" className="h-[72px] w-[72px]" aria-hidden="true">
      <circle cx="40" cy="40" r="28" fill="none" stroke="#3B82F6" strokeWidth="10" strokeDasharray="44 132" transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r="28" fill="none" stroke="#8B5CF6" strokeWidth="10" strokeDasharray="30 146" strokeDashoffset="-44" transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r="28" fill="none" stroke="#10B981" strokeWidth="10" strokeDasharray="24 152" strokeDashoffset="-74" transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r="28" fill="none" stroke="#F59E0B" strokeWidth="10" strokeDasharray="18 158" strokeDashoffset="-98" transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r="16" fill="white" />
      <text x="40" y="38" textAnchor="middle" fontSize="8" fontWeight="700" fill="#111">
        $18k
      </text>
      <text x="40" y="47" textAnchor="middle" fontSize="5" fill="#888">
        Total
      </text>
    </svg>
  );
}

export function MiniAudpayLogo({ size = 10 }: { size?: number }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <span
        className="absolute inset-0 rounded-[50%_50%_42%_42%] bg-[#ff5555]"
        style={{ transform: "rotate(18deg)" }}
      />
      <span
        className="absolute h-[55%] w-[45%] rounded-[50%_50%_8%_50%] bg-[#ff5555]"
        style={{ top: "-8%", left: "12%", transform: "rotate(-8deg)" }}
      />
    </span>
  );
}

export function MiniSidebar({ active = "dashboard" }: { active?: "dashboard" | "receivables" | "reports" }) {
  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "receivables", label: "Receivables" },
    { id: "reports", label: "Reports" },
  ] as const;

  return (
    <div className="flex h-full w-[46px] shrink-0 flex-col border-r border-[#ececec] bg-white">
      <div className="flex items-center justify-center border-b border-[#ececec] py-2">
        <MiniAudpayLogo size={12} />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-md px-1 py-1.5 text-center ${
              active === item.id ? "bg-[#fff1f1] text-[#ff5555]" : "text-[#888]"
            }`}
          >
            <div
              className={`mx-auto mb-0.5 h-1.5 w-1.5 rounded-sm ${
                active === item.id ? "bg-[#ff5555]" : "bg-[#ccc]"
              }`}
            />
            <div className="text-[4px] font-semibold leading-tight">{item.label.slice(0, 3)}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#ececec] p-1">
        <div className="mx-auto h-4 w-4 rounded-full bg-[#ff5555]/15 text-[5px] font-bold text-[#ff5555] flex items-center justify-center">
          SA
        </div>
      </div>
    </div>
  );
}

export function MiniStatCard({
  label,
  value,
  change,
  positive = true,
}: {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-[4px] border border-[#ececec] bg-white p-1.5 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex h-3.5 w-3.5 items-center justify-center rounded bg-[#fff1f1]">
          <div className="h-1.5 w-1.5 rounded-sm bg-[#ff5555]" />
        </div>
        <span
          className={`rounded-full px-1 py-0.5 text-[4px] font-medium ${
            positive ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fef2f2] text-[#dc2626]"
          }`}
        >
          {change}
        </span>
      </div>
      <div className="text-[4px] text-[#888]">{label}</div>
      <div className="text-[7px] font-bold text-[#111]">{value}</div>
    </div>
  );
}

export function MiniTransactionRow({
  name,
  date,
  amount,
  positive,
}: {
  name: string;
  date: string;
  amount: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#f0f0f0] py-1 last:border-0">
      <div className="flex min-w-0 items-center gap-1">
        <div
          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded text-[5px] font-bold ${
            positive ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fff1f1] text-[#ff5555]"
          }`}
        >
          {positive ? "↑" : "↓"}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[5px] font-medium text-[#111]">{name}</div>
          <div className="text-[4px] text-[#888]">{date}</div>
        </div>
      </div>
      <div className="shrink-0 text-[5px] font-semibold text-[#111]">{amount}</div>
    </div>
  );
}

export function MiniBudgetBar({ label, spent, budget }: { label: string; spent: number; budget: number }) {
  const pct = Math.min((spent / budget) * 100, 100);
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[4px]">
        <span className="text-[#555]">{label}</span>
        <span className="text-[#888]">
          ${spent.toLocaleString()} / ${budget.toLocaleString()}
        </span>
      </div>
      <div className="h-1 rounded-full bg-[#f3f4f6]">
        <div className="h-1 rounded-full bg-[#ff5555]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function MiniDashboardShell({
  children,
  activeNav = "dashboard",
}: {
  children: ReactNode;
  activeNav?: "dashboard" | "receivables" | "reports";
}) {
  return (
    <div className="flex h-full bg-[#fafafa]">
      <MiniSidebar active={activeNav} />
      <div className="min-w-0 flex-1 overflow-hidden p-2">{children}</div>
    </div>
  );
}

export function LaptopDashboardPreview() {
  return (
    <MiniDashboardShell>
      <div className="pt-3.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div>
          <div className="text-[7px] font-bold text-[#111]">Dashboard</div>
          <div className="text-[4px] text-[#888]">Welcome back, Sami</div>
        </div>
        <div className="h-3.5 flex-1 max-w-[72px] rounded border border-[#ececec] bg-white px-1 text-[4px] text-[#aaa] flex items-center">
          Search...
        </div>
      </div>

      <div className="mb-1.5 grid grid-cols-4 gap-1">
        <MiniStatCard label="Total Income" value="$124,580" change="+12.4%" />
        <MiniStatCard label="Total Expenses" value="$86,420" change="+8.1%" positive={false} />
        <MiniStatCard label="Net Balance" value="$38,160" change="+18.2%" />
        <MiniStatCard label="Pending Bills" value="$4,280" change="-3.5%" positive={false} />
      </div>

      <div className="mb-1.5 rounded-[4px] border border-[#ececec] bg-white p-1.5 shadow-sm">
        <div className="mb-1 flex items-center justify-between">
          <div>
            <div className="text-[5px] font-bold text-[#111]">Financial Overview</div>
            <div className="text-[4px] text-[#888]">Monthly income vs expenses</div>
          </div>
          <div className="flex gap-1.5 text-[4px]">
            <span className="text-[#8B5CF6]">● Income</span>
            <span className="text-[#F59E0B]">● Expenses</span>
          </div>
        </div>
        <MiniLineChart />
      </div>

      <div className="rounded-[4px] border border-[#ececec] bg-white p-1.5 shadow-sm">
        <div className="mb-1 text-[5px] font-bold text-[#111]">Recent Transactions</div>
        <MiniTransactionRow name="Client Payment — Acme Co" date="Today" amount="+$2,450.00" positive />
        <MiniTransactionRow name="Office Supplies" date="Yesterday" amount="-$186.40" positive={false} />
      </div>
      </div>
    </MiniDashboardShell>
  );
}

export function TabletDashboardPreview({
  activeMonth = 0,
  onMonthChange,
  interactive = false,
}: {
  activeMonth?: number;
  onMonthChange?: (index: number) => void;
  interactive?: boolean;
}) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className="flex h-full bg-[#fafafa]">
      <MiniSidebar active="reports" />

      <div className="flex min-w-0 flex-1 flex-col p-2">
        <div className="mb-1">
          <div className="text-[7px] font-bold text-[#111]">Financial Reports</div>
          <div className="text-[4px] text-[#888]">Expense breakdown & budgets</div>
        </div>

        <div className="mb-1.5 grid grid-cols-3 gap-1">
          <MiniStatCard label="Income" value="$24.5k" change="+12.3%" />
          <MiniStatCard label="Expenses" value="$18.2k" change="+8.7%" positive={false} />
          <MiniStatCard label="Balance" value="$6.3k" change="+15.1%" />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 gap-1.5">
          <div className="rounded-[4px] border border-[#ececec] bg-white p-1.5 shadow-sm">
            <div className="mb-1 text-[5px] font-bold text-[#111]">Expense Breakdown</div>
            <div className="flex items-center gap-1.5">
              <MiniPieChart />
              <div className="flex-1 space-y-0.5">
                {[
                  { name: "Payroll", color: "#3B82F6", value: "$6.2k" },
                  { name: "Operations", color: "#8B5CF6", value: "$4.8k" },
                  { name: "Marketing", color: "#10B981", value: "$3.1k" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[4px]">
                    <span className="flex items-center gap-1 text-[#888]">
                      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-medium text-[#111]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[4px] border border-[#ececec] bg-white p-1.5 shadow-sm">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-[5px] font-bold text-[#111]">Monthly Budget</div>
              <span className="text-[4px] text-[#059669]">On track</span>
            </div>
            <div className="space-y-1">
              <MiniBudgetBar label="Housing" spent={2400} budget={3000} />
              <MiniBudgetBar label="Operations" spent={1800} budget={2200} />
            </div>
            <div className="mt-1 flex justify-between">
              {months.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  disabled={!interactive}
                  onClick={() => interactive && onMonthChange?.(index)}
                  className={`text-[4px] transition-colors ${
                    index === activeMonth ? "font-bold text-[#ff5555]" : "text-[#888]"
                  } ${interactive ? "cursor-pointer" : "cursor-default"}`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneDashboardPreview() {
  return (
    <div className="flex h-full flex-col bg-[#fafafa] p-2 pt-8">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-[6px] font-bold text-[#111]">Dashboard</div>
          <div className="text-[4px] text-[#888]">Welcome back, Sami</div>
        </div>
        <MiniAudpayLogo size={10} />
      </div>

      <div className="mb-2 grid grid-cols-2 gap-1">
        <MiniStatCard label="Net Balance" value="$38,160" change="+18%" />
        <MiniStatCard label="Pending Bills" value="$4,280" change="3 due" positive={false} />
      </div>

      <div className="mb-2 rounded-[4px] border border-[#ececec] bg-white p-1.5 shadow-sm">
        <div className="mb-1 text-[5px] font-bold text-[#111]">Quick Transfer</div>
        <div className="mb-1 flex gap-1">
          {["SA", "JK", "LW"].map((initials, i) => (
            <div
              key={initials}
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[4px] font-bold ${
                i === 0 ? "bg-[#ff5555] text-white" : "bg-[#f3f4f6] text-[#555]"
              }`}
            >
              {initials}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          <div className="h-4 flex-1 rounded border border-[#ececec] bg-[#fafafa] px-1 text-[4px] text-[#aaa] flex items-center">
            Amount
          </div>
          <div className="flex h-4 items-center rounded bg-[#ff5555] px-1.5 text-[4px] font-semibold text-white">
            Send
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-[4px] border border-[#ececec] bg-white p-1.5 shadow-sm">
        <div className="mb-1 text-[5px] font-bold text-[#111]">Recent Activity</div>
        <MiniTransactionRow name="Invoice #1042 paid" date="2h ago" amount="+$890" positive />
        <MiniTransactionRow name="Vendor bill due" date="Today" amount="-$420" positive={false} />
        <MiniTransactionRow name="Payroll processed" date="Yesterday" amount="-$12.4k" positive={false} />
      </div>
    </div>
  );
}

export function PhoneSecurityPreview() {
  return (
    <div className="flex h-full flex-col bg-[#fafafa] p-2 pt-8">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[6px] font-bold text-[#111]">Security</div>
        <span className="rounded-full bg-[#ecfdf5] px-1 py-0.5 text-[4px] font-bold text-[#059669]">
          Protected
        </span>
      </div>
      <div className="space-y-1.5">
        {[
          { label: "Encrypted sessions", value: "Active" },
          { label: "Two-factor auth", value: "Enabled" },
          { label: "Automatic backups", value: "Daily" },
        ].map((item) => (
          <div key={item.label} className="rounded-[4px] border border-[#ececec] bg-white p-1.5">
            <div className="text-[4px] text-[#888]">{item.label}</div>
            <div className="text-[6px] font-bold text-[#111]">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
