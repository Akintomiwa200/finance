import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function InvoiceAgingReportPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Invoice Aging Report</h1>
          <p className="page-description">Track overdue invoices and accounts receivable aging</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Outstanding AR</span>
            <div className="stat-value">NGN 4,440,000</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Overdue</span>
            <div className="stat-value text-danger">NGN 2,890,000</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Outstanding AP</span>
            <div className="stat-value">NGN 2,050,000</div>
          </div>
        </div>

        <div className="charts-grid">
          <Card>
            <CardHeader>
              <CardTitle>AR Aging Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Amount</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { period: "Current (0–30 days)", amount: "NGN 1,100,000", count: 2 },
                    { period: "31–60 days", amount: "NGN 890,000", count: 1 },
                    { period: "61–90 days", amount: "NGN 3,200,000", count: 1 },
                    { period: "90+ days", amount: "NGN 0", count: 0 },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="font-medium">{row.period}</td>
                      <td className="amount">{row.amount}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AP Aging Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Amount</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { period: "Current (0–30 days)", amount: "NGN 1,200,000", count: 2 },
                    { period: "31–60 days", amount: "NGN 750,000", count: 1 },
                    { period: "61–90 days", amount: "NGN 100,000", count: 1 },
                    { period: "90+ days", amount: "NGN 0", count: 0 },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="font-medium">{row.period}</td>
                      <td className="amount">{row.amount}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline">Export Report</Button>
        </div>
      </div>
);
}
