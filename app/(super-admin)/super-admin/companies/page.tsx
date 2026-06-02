import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function SuperAdminCompaniesPage() {
  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title text-white">Companies</h1>
          <p className="page-description">Manage all organizations using the FaaS platform</p>
        </div>

        <Card className="!bg-zinc-900 !border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="!text-white">Registered Organizations</CardTitle>
              <Button variant="primary" size="sm">Add Company</Button>
            </div>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th className="!text-zinc-400">Name</th>
                  <th className="!text-zinc-400">Slug</th>
                  <th className="!text-zinc-400">Email</th>
                  <th className="!text-zinc-400">Departments</th>
                  <th className="!text-zinc-400">Status</th>
                  <th className="!text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Acme Corp", slug: "acme-corp", email: "finance@acmecorp.com", depts: 5, status: "Active" },
                  { name: "Beta Corp", slug: "beta-corp", email: "finance@betacorp.com", depts: 1, status: "Active" },
                  { name: "FaaS Platform", slug: "faas-platform", email: "super@faas.dev", depts: 1, status: "System" },
                ].map((row) => (
                  <tr key={row.slug} className="!border-zinc-800">
                    <td className="!text-zinc-200 font-medium">{row.name}</td>
                    <td className="!text-zinc-400 font-mono text-xs">{row.slug}</td>
                    <td className="!text-zinc-400">{row.email}</td>
                    <td className="!text-zinc-400">{row.depts}</td>
                    <td>
                      <span className={`status-badge ${row.status === "Active" ? "status-approved" : "status-draft"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="!text-red-400">Suspend</Button>
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
