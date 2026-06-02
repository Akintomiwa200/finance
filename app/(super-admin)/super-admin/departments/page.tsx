import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function SuperAdminDepartmentsPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title text-white">Platform Departments</h1>
          <p className="page-description">Manage platform-level departments across all organizations</p>
        </div>

        <div className="action-bar">
          <Button variant="primary" size="sm">+ Add Department</Button>
        </div>

        <Card className="!bg-zinc-900 !border-zinc-800">
          <CardHeader>
            <CardTitle className="!text-white">All Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th className="!text-zinc-400">Name</th>
                  <th className="!text-zinc-400">Code</th>
                  <th className="!text-zinc-400">Company</th>
                  <th className="!text-zinc-400">Head</th>
                  <th className="!text-zinc-400">Employees</th>
                  <th className="!text-zinc-400">Status</th>
                  <th className="!text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Platform Admin", code: "PLT-ADM", company: "FaaS Platform", head: "Super Admin", emp: 1, status: "Active" },
                  { name: "Support", code: "PLT-SUP", company: "FaaS Platform", head: "—", emp: 0, status: "Active" },
                  { name: "Infrastructure", code: "PLT-INF", company: "FaaS Platform", head: "—", emp: 0, status: "Active" },
                  { name: "Finance", code: "FIN", company: "Acme Corp", head: "Jane Manager", emp: 12, status: "Active" },
                  { name: "Engineering", code: "ENG", company: "Acme Corp", head: "Tech Lead", emp: 45, status: "Active" },
                  { name: "Human Resources", code: "HR", company: "Acme Corp", head: "HR Director", emp: 8, status: "Active" },
                  { name: "Sales", code: "SAL", company: "Acme Corp", head: "Sales Manager", emp: 20, status: "Active" },
                  { name: "Operations", code: "OPS", company: "Acme Corp", head: "Ops Director", emp: 15, status: "Active" },
                  { name: "Admin", code: "ADM", company: "Acme Corp", head: "Admin Manager", emp: 6, status: "Active" },
                  { name: "Admin", code: "ADM-BETA", company: "Beta Corp", head: "Beta Admin", emp: 3, status: "Active" },
                ].map((dept, i) => (
                  <tr key={i} className="!border-zinc-800">
                    <td className="!text-zinc-200 font-medium">{dept.name}</td>
                    <td className="!text-zinc-400 font-mono text-xs">{dept.code}</td>
                    <td className="!text-zinc-300">{dept.company}</td>
                    <td className="!text-zinc-400">{dept.head}</td>
                    <td className="!text-zinc-400">{dept.emp}</td>
                    <td>
                      <span className="status-badge status-approved">{dept.status}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="!text-red-400">Disable</Button>
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
