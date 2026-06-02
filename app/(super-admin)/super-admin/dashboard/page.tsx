import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";

export default function SuperAdminDashboardPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <h1 className="page-title text-white">Platform Dashboard</h1>
              <p className="page-description">
                Overview of all organizations using Finance as a Service
              </p>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          {[
            { label: "Active Companies", value: "3", change: 1, changeLabel: "this month" },
            { label: "Total Users", value: "1,247", change: 12.5, changeLabel: "vs last month" },
            { label: "Platform Revenue", value: "NGN 0", change: 0, changeLabel: "free tier" },
            { label: "Total Payroll Processed", value: "NGN 245M", change: 8.3, changeLabel: "all time" },
          ].map((stat) => (
            <div key={stat.label} className="stat-card !bg-zinc-900 !border-zinc-800">
              <span className="stat-label !text-zinc-400">{stat.label}</span>
              <div className="stat-value !text-white">{stat.value}</div>
              <div className="stat-change">
                <span className="text-green-400">
                  +{stat.change}%
                </span>
                <span className="text-zinc-500">{stat.changeLabel}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <Card className="!bg-zinc-900 !border-zinc-800">
            <CardHeader>
              <CardTitle className="!text-white">Registered Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <table>
                <thead>
                  <tr>
                    <th className="!text-zinc-400">Company</th>
                    <th className="!text-zinc-400">Users</th>
                    <th className="!text-zinc-400">Status</th>
                    <th className="!text-zinc-400">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Acme Corp", users: 8, status: "Active", date: "Jan 2026" },
                    { name: "Beta Corp", users: 3, status: "Active", date: "Mar 2026" },
                    { name: "FaaS Platform", users: 1, status: "System", date: "Jun 2026" },
                  ].map((row) => (
                    <tr key={row.name} className="!border-zinc-800">
                      <td className="!text-zinc-200">{row.name}</td>
                      <td className="!text-zinc-400">{row.users}</td>
                      <td>
                        <span className={`status-badge ${row.status === "Active" ? "status-approved" : "status-draft"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="!text-zinc-400">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="!bg-zinc-900 !border-zinc-800">
            <CardHeader>
              <CardTitle className="!text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New company registered", company: "Beta Corp", time: "2 hours ago" },
                  { action: "Payroll processed", company: "Acme Corp", time: "5 hours ago" },
                  { action: "Employee added", company: "Acme Corp", time: "1 day ago" },
                  { action: "Budget updated", company: "Acme Corp", time: "2 days ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-violet-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200">{item.action}</p>
                      <p className="text-xs text-zinc-500">{item.company} · {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
);
}
