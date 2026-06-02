import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function CustomerInvoicesPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Sales Invoices</h1>
          <p className="page-description">Accounts Receivable — customer invoices and payments</p>
        </div>

        <div className="action-bar">
          <Button>+ New Sales Invoice</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Customer Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "INV-001", customer: "Acme Corp", amount: "NGN 2,450,000", due: "15 Jun 2026", status: "Paid" },
                  { id: "INV-002", customer: "Beta Ltd", amount: "NGN 890,000", due: "20 Jun 2026", status: "Sent" },
                  { id: "INV-003", customer: "Gamma Inc", amount: "NGN 3,200,000", due: "05 Jun 2026", status: "Overdue" },
                  { id: "INV-004", customer: "Delta Co", amount: "NGN 1,100,000", due: "30 Jun 2026", status: "Draft" },
                ].map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-medium">{inv.id}</td>
                    <td>{inv.customer}</td>
                    <td className="amount">{inv.amount}</td>
                    <td>{inv.due}</td>
                    <td><span className={`status-badge status-${inv.status.toLowerCase()}`}>{inv.status}</span></td>
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
