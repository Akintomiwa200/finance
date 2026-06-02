import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function PayrollRunsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Payroll Runs</h1>
          <p className="page-description">Manage payroll periods, computations, and approvals</p>
        </div>

        <div className="action-bar">
          <Button>+ Create Payroll Run</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payroll Periods</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { period: "May 2026", start: "01 May 2026", end: "31 May 2026", total: "NGN 45,230,000", status: "Paid" },
                  { period: "April 2026", start: "01 Apr 2026", end: "30 Apr 2026", total: "NGN 44,100,000", status: "Paid" },
                  { period: "June 2026", start: "01 Jun 2026", end: "30 Jun 2026", total: "NGN 0", status: "Draft" },
                ].map((run) => (
                  <tr key={run.period}>
                    <td className="font-medium">{run.period}</td>
                    <td>{run.start}</td>
                    <td>{run.end}</td>
                    <td className="amount">{run.total}</td>
                    <td><span className={`status-badge status-${run.status.toLowerCase()}`}>{run.status}</span></td>
                    <td><Button variant="ghost" size="sm">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
);
}
