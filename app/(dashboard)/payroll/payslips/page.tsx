import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export default function PayslipsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Payslips</h1>
          <p className="page-description">View and generate employee payslips</p>
        </div>

        <div className="action-bar">
          <div className="flex items-center gap-3">
            <Input placeholder="Search employee..." className="max-w-xs" />
            <Input type="month" className="max-w-[180px]" />
          </div>
          <Button>Generate Payslips</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Payslips — May 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Gross Pay</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "John Doe", dept: "Engineering", gross: "NGN 850,000", deductions: "NGN 212,500", net: "NGN 637,500", status: "Generated" },
                  { name: "Jane Smith", dept: "Finance", gross: "NGN 1,200,000", deductions: "NGN 300,000", net: "NGN 900,000", status: "Generated" },
                  { name: "Paul Roller", dept: "HR", gross: "NGN 650,000", deductions: "NGN 162,500", net: "NGN 487,500", status: "Pending" },
                ].map((ps, i) => (
                  <tr key={i}>
                    <td className="font-medium">{ps.name}</td>
                    <td>{ps.dept}</td>
                    <td className="amount">{ps.gross}</td>
                    <td className="amount amount-negative">{ps.deductions}</td>
                    <td className="amount amount-positive">{ps.net}</td>
                    <td><span className={`status-badge status-${ps.status.toLowerCase()}`}>{ps.status}</span></td>
                    <td><Button variant="ghost" size="sm">Download</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
);
}
