import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function VendorInvoicesPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Purchase Invoices</h1>
          <p className="page-description">Accounts Payable — vendor invoices and payments</p>
        </div>

        <div className="action-bar">
          <Button>+ Record Vendor Invoice</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Vendor Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "VEN-001", vendor: "TechCorp", amount: "NGN 1,200,000", due: "10 Jun 2026", status: "Pending" },
                  { id: "VEN-002", vendor: "OfficeMart", amount: "NGN 340,000", due: "18 Jun 2026", status: "Paid" },
                  { id: "VEN-003", vendor: "CloudServ", amount: "NGN 2,100,000", due: "25 Jun 2026", status: "Draft" },
                  { id: "VEN-004", vendor: "ConsultPro", amount: "NGN 750,000", due: "01 Jul 2026", status: "Overdue" },
                ].map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-medium">{inv.id}</td>
                    <td>{inv.vendor}</td>
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
