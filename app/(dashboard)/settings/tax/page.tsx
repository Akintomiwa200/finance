import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export default function TaxSettingsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Tax Configuration</h1>
          <p className="page-description">Configure tax brackets, rates, and thresholds</p>
        </div>

        <div className="action-bar">
          <Button>+ Add Tax Bracket</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tax Brackets</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rate (%)</th>
                  <th>Threshold (NGN)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "PAYE Basic", rate: "7.5", threshold: "300,000", status: "Active" },
                  { name: "PAYE Mid", rate: "15", threshold: "600,000", status: "Active" },
                  { name: "PAYE High", rate: "21", threshold: "1,100,000", status: "Active" },
                  { name: "PAYE Top", rate: "24", threshold: "1,600,000", status: "Active" },
                  { name: "VAT Standard", rate: "7.5", threshold: "0", status: "Active" },
                ].map((bracket, i) => (
                  <tr key={i}>
                    <td className="font-medium">{bracket.name}</td>
                    <td>{bracket.rate}%</td>
                    <td className="amount">{bracket.threshold}</td>
                    <td><span className="status-badge status-approved">{bracket.status}</span></td>
                    <td><Button variant="ghost" size="sm">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
);
}
