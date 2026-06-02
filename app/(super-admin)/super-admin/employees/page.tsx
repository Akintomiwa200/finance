import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";

export default function SuperAdminEmployeesPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title text-white">All Employees</h1>
          <p className="page-description">View all users across every organization</p>
        </div>

        <Card className="!bg-zinc-900 !border-zinc-800">
          <CardHeader>
            <CardTitle className="!text-white">Users Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th className="!text-zinc-400">Name</th>
                  <th className="!text-zinc-400">Email</th>
                  <th className="!text-zinc-400">Company</th>
                  <th className="!text-zinc-400">Department</th>
                  <th className="!text-zinc-400">Role</th>
                  <th className="!text-zinc-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Super Admin", email: "super@faas.dev", company: "FaaS Platform", dept: "Platform Admin", role: "SUPER_ADMIN", status: "Active" },
                  { name: "Admin User", email: "admin@acmecorp.com", company: "Acme Corp", dept: "Finance", role: "ADMIN", status: "Active" },
                  { name: "Jane Manager", email: "manager@acmecorp.com", company: "Acme Corp", dept: "Finance", role: "FINANCE_MANAGER", status: "Active" },
                  { name: "Paul Roller", email: "payroll@acmecorp.com", company: "Acme Corp", dept: "Finance", role: "PAYROLL_OFFICER", status: "Active" },
                  { name: "John Doe", email: "john@acmecorp.com", company: "Acme Corp", dept: "Engineering", role: "EMPLOYEE", status: "Active" },
                  { name: "Beta Admin", email: "admin@betacorp.com", company: "Beta Corp", dept: "Admin", role: "ADMIN", status: "Active" },
                ].map((row, i) => (
                  <tr key={i} className="!border-zinc-800">
                    <td className="!text-zinc-200">{row.name}</td>
                    <td className="!text-zinc-400">{row.email}</td>
                    <td className="!text-zinc-300">{row.company}</td>
                    <td className="!text-zinc-400">{row.dept}</td>
                    <td>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-zinc-800 text-zinc-300 font-mono">
                        {row.role}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge status-approved">{row.status}</span>
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
