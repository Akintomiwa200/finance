import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function AllDepartmentsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">All Departments</h1>
          <p className="page-description">Manage company departments, heads, and budgets</p>
        </div>

        <div className="action-bar">
          <Button>+ Add Department</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Head</th>
                  <th>Budget</th>
                  <th>Employees</th>
                  <th>Cost Center</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Finance", code: "FIN", head: "Jane Manager", budget: "NGN 50,000,000", employees: 12, cc: "CC-FIN-001" },
                  { name: "Engineering", code: "ENG", head: "Tech Lead", budget: "NGN 80,000,000", employees: 45, cc: "CC-ENG-001" },
                  { name: "Human Resources", code: "HR", head: "HR Director", budget: "NGN 15,000,000", employees: 8, cc: "CC-HR-001" },
                  { name: "Sales", code: "SAL", head: "Sales Manager", budget: "NGN 30,000,000", employees: 20, cc: "CC-SAL-001" },
                  { name: "Operations", code: "OPS", head: "Ops Director", budget: "NGN 25,000,000", employees: 15, cc: "CC-OPS-001" },
                  { name: "Admin", code: "ADM", head: "Admin Manager", budget: "NGN 10,000,000", employees: 6, cc: "CC-ADM-001" },
                ].map((dept) => (
                  <tr key={dept.code}>
                    <td className="font-medium">{dept.name}</td>
                    <td className="font-mono text-xs">{dept.code}</td>
                    <td>{dept.head}</td>
                    <td className="amount">{dept.budget}</td>
                    <td>{dept.employees}</td>
                    <td className="font-mono text-xs">{dept.cc}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
);
}
