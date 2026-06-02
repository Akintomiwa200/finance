import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function ReportsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Reports</h1>
          <p className="page-description">Financial reports and analytics</p>
        </div>
        <div className="stats-grid">
          {["Payroll Summary", "Budget vs Actual", "Expense Analysis", "Invoice Aging", "Tax Reports", "Audit Trail"].map((report) => (
            <Card key={report}>
              <CardHeader>
                <CardTitle>{report}</CardTitle>
              </CardHeader>
              <div className="px-6 pb-6">
                <p className="text-sm text-muted-foreground">Generate and export financial reports</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
);
}
