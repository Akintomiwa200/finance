import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function TaxReportsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Tax Reports</h1>
          <p className="page-description">PAYE, VAT, and other tax obligation summaries</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">PAYE (MTD)</span>
            <div className="stat-value">NGN 3,500,000</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">VAT (MTD)</span>
            <div className="stat-value">NGN 850,000</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">YTD Total Tax</span>
            <div className="stat-value">NGN 26,100,000</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tax Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>PAYE</th>
                  <th>VAT</th>
                  <th>Withholding</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { period: "May 2026", paye: "NGN 3,500,000", vat: "NGN 850,000", wht: "NGN 420,000", total: "NGN 4,770,000", status: "Filed" },
                  { period: "April 2026", paye: "NGN 3,400,000", vat: "NGN 780,000", wht: "NGN 380,000", total: "NGN 4,560,000", status: "Filed" },
                  { period: "March 2026", paye: "NGN 3,600,000", vat: "NGN 820,000", wht: "NGN 400,000", total: "NGN 4,820,000", status: "Filed" },
                  { period: "Q1 2026", paye: "NGN 10,200,000", vat: "NGN 2,400,000", wht: "NGN 1,180,000", total: "NGN 13,780,000", status: "Filed" },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="font-medium">{row.period}</td>
                    <td className="amount">{row.paye}</td>
                    <td className="amount">{row.vat}</td>
                    <td className="amount">{row.wht}</td>
                    <td className="amount">{row.total}</td>
                    <td><span className="status-badge status-approved">{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-4">
          <Button variant="outline">Download Tax Summary</Button>
        </div>
      </div>
);
}
