"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";

const roles = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "FINANCE_MANAGER", label: "Finance Manager" },
  { value: "ACCOUNTANT_PAYABLE", label: "Accountant (AP)" },
  { value: "ACCOUNTANT_RECEIVABLE", label: "Accountant (AR)" },
  { value: "PAYROLL_OFFICER", label: "Payroll Officer" },
  { value: "BUDGET_ANALYST", label: "Budget Analyst" },
  { value: "DEPARTMENT_HEAD", label: "Department Head" },
  { value: "AUDITOR", label: "Auditor" },
  { value: "TAX_SPECIALIST", label: "Tax Specialist" },
  { value: "EMPLOYEE", label: "Employee" },
];

const initialEmployees = [
  { name: "Jane Manager", email: "jane@acmecorp.com", dept: "Finance", role: "FINANCE_MANAGER" },
  { name: "Paul Roller", email: "payroll@acmecorp.com", dept: "Finance", role: "PAYROLL_OFFICER" },
  { name: "John Doe", email: "john@acmecorp.com", dept: "Engineering", role: "EMPLOYEE" },
  { name: "Alice Lee", email: "alice@acmecorp.com", dept: "Finance", role: "ACCOUNTANT_PAYABLE" },
  { name: "Bob King", email: "bob@acmecorp.com", dept: "Sales", role: "EMPLOYEE" },
  { name: "Sarah Connor", email: "sarah@acmecorp.com", dept: "HR", role: "DEPARTMENT_HEAD" },
];

export default function RolesPermissionsPage() {
  const [employees, setEmployees] = useState(initialEmployees);

  const handleRoleChange = (index: number, newRole: string) => {
    const updated = [...employees];
    updated[index] = { ...updated[index], role: newRole };
    setEmployees(updated);
  };

  const handleSave = () => {
    alert("Roles updated successfully!");
  };

  return (
<div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Roles & Permissions</h1>
          <p className="page-description">Assign and manage user roles across the organization</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <div className="stat-value">{employees.length}</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Departments</span>
            <div className="stat-value">4</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Roles Available</span>
            <div className="stat-value">{roles.length}</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Role Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Current Role</th>
                  <th>Assign New Role</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp.email}>
                    <td className="font-medium">{emp.name}</td>
                    <td className="text-muted-foreground">{emp.email}</td>
                    <td>{emp.dept}</td>
                    <td>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                        {roles.find((r) => r.value === emp.role)?.label || emp.role}
                      </span>
                    </td>
                    <td>
                      <Select
                        value={emp.role}
                        onValueChange={(value) => handleRoleChange(index, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Role Changes</Button>
        </div>
      </div>
);
}
