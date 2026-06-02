import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function BudgetReportPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Budget vs Actual Report</h1>
          <p className="page-description">Compare budget allocations against actual spending</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fiscal Year 2026 — Budget Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dept: "Finance", budget: "NGN 50,000,000", spent: "NGN 32,000,000", remaining: "NGN 18,000,000", util: "64%" },
                  { dept: "Engineering", budget: "NGN 80,000,000", spent: "NGN 45,000,000", remaining: "NGN 35,000,000", util: "56%" },
                  { dept: "Human Resources", budget: "NGN 15,000,000", spent: "NGN 10,000,000", remaining: "NGN 5,000,000", util: "67%" },
                  { dept: "Sales", budget: "NGN 30,000,000", spent: "NGN 28,000,000", remaining: "NGN 2,000,000", util: "93%" },
                  { dept: "Operations", budget: "NGN 25,000,000", spent: "NGN 12,000,000", remaining: "NGN 13,000,000", util: "48%" },
                  { dept: "Admin", budget: "NGN 10,000,000", spent: "NGN 6,000,000", remaining: "NGN 4,000,000", util: "60%" },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="font-medium">{row.dept}</td>
                    <td className="amount">{row.budget}</td>
                    <td className="amount">{row.spent}</td>
                    <td className="amount amount-positive">{row.remaining}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${parseInt(row.util) > 80 ? "bg-danger" : parseInt(row.util) > 60 ? "bg-warning" : "bg-success"}`} style={{ width: row.util }} />
                        </div>
                        <span className="text-xs">{row.util}</span>
                      </div>
                    </td>
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
