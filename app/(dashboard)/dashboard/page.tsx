import { AppShell } from "@/src/components/layout/app-shell";
import { FinancialCard } from "@/src/components/charts/financial-card";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">
            Real-time overview of your financial operations
          </p>
        </div>

        <div className="stats-grid">
          <FinancialCard
            label="Total Employees"
            value="156"
            change={5.2}
            changeLabel="vs last month"
          />
          <FinancialCard
            label="Monthly Payroll"
            value="NGN 45,230,000"
            change={-2.1}
            changeLabel="vs last month"
          />
          <FinancialCard
            label="Budget Utilization"
            value="68.4%"
            change={3.8}
            changeLabel="this fiscal year"
          />
          <FinancialCard
            label="Pending Approvals"
            value="12"
            change={-15}
            changeLabel="vs last week"
          />
          <FinancialCard
            label="Expenses (MTD)"
            value="NGN 3,240,000"
            change={8.3}
            changeLabel="vs last month"
          />
          <FinancialCard
            label="Overdue Invoices"
            value="NGN 2,890,000"
            change={12.5}
            changeLabel="vs last month"
          />
        </div>

        <div className="charts-grid">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Trend</CardTitle>
            </CardHeader>
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              Chart component — integrate Recharts here
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Budget vs Spent</CardTitle>
            </CardHeader>
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              Chart component — integrate Recharts here
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Department</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: "02 Jun 2026", desc: "Payroll Run — May 2026", dept: "All", amount: "NGN 45,230,000", status: "Paid" },
                { date: "01 Jun 2026", desc: "Office Supplies", dept: "Admin", amount: "NGN 340,000", status: "Approved" },
                { date: "30 May 2026", desc: "Vendor Payment — TechCorp", dept: "IT", amount: "NGN 1,200,000", status: "Pending" },
                { date: "29 May 2026", desc: "Travel Reimbursement", dept: "Sales", amount: "NGN 580,000", status: "Reimbursed" },
              ].map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>{row.desc}</td>
                  <td>{row.dept}</td>
                  <td className="amount">{row.amount}</td>
                  <td>
                    <span className={`status-badge status-${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}
