import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function PayrollSummaryReportPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Payroll Summary Report</h1>
          <p className="page-description">Summary of payroll costs across departments and periods</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Payroll (MTD)</span>
            <div className="stat-value">NGN 45,230,000</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Employees</span>
            <div className="stat-value">156</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Avg Salary</span>
            <div className="stat-value">NGN 289,936</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">YTD Payroll</span>
            <div className="stat-value">NGN 271,380,000</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Gross Pay</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dept: "Engineering", emp: 45, gross: "NGN 15,400,000", deductions: "NGN 3,850,000", net: "NGN 11,550,000", pct: "34%" },
                  { dept: "Finance", emp: 12, gross: "NGN 8,200,000", deductions: "NGN 2,050,000", net: "NGN 6,150,000", pct: "18%" },
                  { dept: "Sales", emp: 20, gross: "NGN 7,800,000", deductions: "NGN 1,950,000", net: "NGN 5,850,000", pct: "17%" },
                  { dept: "HR", emp: 8, gross: "NGN 3,200,000", deductions: "NGN 800,000", net: "NGN 2,400,000", pct: "7%" },
                  { dept: "Operations", emp: 15, gross: "NGN 5,630,000", deductions: "NGN 1,407,500", net: "NGN 4,222,500", pct: "12%" },
                  { dept: "Admin", emp: 6, gross: "NGN 5,000,000", deductions: "NGN 1,250,000", net: "NGN 3,750,000", pct: "11%" },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="font-medium">{row.dept}</td>
                    <td>{row.emp}</td>
                    <td className="amount">{row.gross}</td>
                    <td className="amount amount-negative">{row.deductions}</td>
                    <td className="amount amount-positive">{row.net}</td>
                    <td>{row.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-4">
          <Button variant="outline">Export Report</Button>
        </div>
      </div>
);
}
