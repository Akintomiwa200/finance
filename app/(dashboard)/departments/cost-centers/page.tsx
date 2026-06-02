import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function CostCentersPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Cost Centers</h1>
          <p className="page-description">Manage cost center codes and budget allocations</p>
        </div>

        <div className="action-bar">
          <Button>+ Add Cost Center</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cost Centers</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Budget Allocated</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { code: "CC-FIN-001", name: "Finance Operations", dept: "Finance", allocated: "NGN 50,000,000", spent: "NGN 32,000,000", remaining: "NGN 18,000,000", status: "Active" },
                  { code: "CC-ENG-001", name: "Engineering R&D", dept: "Engineering", allocated: "NGN 80,000,000", spent: "NGN 45,000,000", remaining: "NGN 35,000,000", status: "Active" },
                  { code: "CC-HR-001", name: "HR Operations", dept: "HR", allocated: "NGN 15,000,000", spent: "NGN 10,000,000", remaining: "NGN 5,000,000", status: "Active" },
                  { code: "CC-SAL-001", name: "Sales & Marketing", dept: "Sales", allocated: "NGN 30,000,000", spent: "NGN 28,000,000", remaining: "NGN 2,000,000", status: "Active" },
                ].map((cc) => (
                  <tr key={cc.code}>
                    <td className="font-mono text-xs font-medium">{cc.code}</td>
                    <td>{cc.name}</td>
                    <td>{cc.dept}</td>
                    <td className="amount">{cc.allocated}</td>
                    <td className="amount">{cc.spent}</td>
                    <td className="amount amount-positive">{cc.remaining}</td>
                    <td><span className="status-badge status-approved">{cc.status}</span></td>
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
