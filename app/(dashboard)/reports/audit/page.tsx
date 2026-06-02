import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export default function AuditTrailPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Audit Trail</h1>
          <p className="page-description">Track all system activity and changes for compliance</p>
        </div>

        <div className="action-bar">
          <div className="flex items-center gap-3">
            <Input placeholder="Search by user, action..." className="max-w-xs" />
            <Input type="date" className="max-w-[180px]" />
            <Input type="date" className="max-w-[180px]" />
          </div>
          <Button variant="outline">Export Log</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: "02 Jun 2026 14:30", user: "Admin User", action: "CREATE", entity: "Payroll Run", details: "Created May 2026 payroll" },
                  { time: "02 Jun 2026 11:15", user: "Jane Manager", action: "APPROVE", entity: "Expense Report", details: "Approved travel expense" },
                  { time: "01 Jun 2026 16:45", user: "John Doe", action: "SUBMIT", entity: "Expense Report", details: "Submitted office supplies" },
                  { time: "01 Jun 2026 10:00", user: "Admin User", action: "UPDATE", entity: "Employee", details: "Updated salary for Bob King" },
                  { time: "31 May 2026 09:30", user: "Paul Roller", action: "COMPUTE", entity: "Payroll", details: "Computed May 2026 payroll" },
                  { time: "30 May 2026 15:20", user: "Jane Manager", action: "CREATE", entity: "Budget", details: "Created FY2027 budget draft" },
                ].map((log, i) => (
                  <tr key={i}>
                    <td className="text-xs whitespace-nowrap">{log.time}</td>
                    <td className="font-medium">{log.user}</td>
                    <td>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        log.action === "CREATE" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                        log.action === "APPROVE" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        log.action === "SUBMIT" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                        "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                      }`}>{log.action}</span>
                    </td>
                    <td>{log.entity}</td>
                    <td className="text-muted-foreground">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
);
}
