import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function ExpenseAnalysisReportPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Expense Analysis</h1>
          <p className="page-description">Analyze expense patterns by category, department, and time</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Expenses (MTD)</span>
            <div className="stat-value">NGN 3,240,000</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Avg per Report</span>
            <div className="stat-value">NGN 405,000</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Approval</span>
            <div className="stat-value">NGN 1,200,000</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Reports</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cat: "Travel & Transport", amount: "NGN 1,200,000", count: 8, pct: "37%" },
                  { cat: "Office Supplies", amount: "NGN 640,000", count: 12, pct: "20%" },
                  { cat: "Software & Licenses", amount: "NGN 2,100,000", count: 3, pct: "65%" },
                  { cat: "Meals & Entertainment", amount: "NGN 340,000", count: 6, pct: "10%" },
                  { cat: "Utilities", amount: "NGN 500,000", count: 4, pct: "15%" },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="font-medium">{row.cat}</td>
                    <td className="amount">{row.amount}</td>
                    <td>{row.count}</td>
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
