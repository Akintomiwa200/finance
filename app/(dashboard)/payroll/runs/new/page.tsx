"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { usePayrollStore } from "@/src/store/payroll-store";
import { useEmployeeStore } from "@/src/store/employee-store";

interface EmployeeRow {
  employeeId: string;
  employeeName: string;
  departmentName: string;
  position: string;
  grossPay: number;
  allowances: number;
  bonus: number;
  deductions: number;
  taxAmount: number;
  loanDeduction: number;
  overtimePay: number;
}

export default function NewPayrollRunPage() {
  const router = useRouter();
  const { addPayrollRun } = usePayrollStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const [submitting, setSubmitting] = useState(false);

  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [items, setItems] = useState<Record<string, EmployeeRow>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const selectedEmployees = useMemo(
    () => employees.filter((e) => selectedIds.includes(e.id)),
    [employees, selectedIds]
  );

  const toggleEmployee = (emp: typeof employees[0]) => {
    const id = emp.id;
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      if (!prev.includes(id)) {
        setItems((prevItems) => ({
          ...prevItems,
          [id]: {
            employeeId: id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            departmentName: emp.departmentName,
            position: emp.position ?? "",
            grossPay: emp.baseSalary,
            allowances: 0,
            bonus: 0,
            deductions: 0,
            taxAmount: 0,
            loanDeduction: 0,
            overtimePay: 0,
          },
        }));
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.length === employees.length) {
      setSelectedIds([]);
      setItems({});
    } else {
      const allIds = employees.map((e) => e.id);
      setSelectedIds(allIds);
      const newItems: Record<string, EmployeeRow> = {};
      employees.forEach((emp) => {
        newItems[emp.id] = {
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          departmentName: emp.departmentName,
          position: emp.position ?? "",
          grossPay: emp.baseSalary,
          allowances: 0,
          bonus: 0,
          deductions: 0,
          taxAmount: 0,
          loanDeduction: 0,
          overtimePay: 0,
        };
      });
      setItems(newItems);
    }
  };

  const updateItem = (empId: string, field: keyof EmployeeRow, value: number) => {
    setItems((prev) => ({
      ...prev,
      [empId]: { ...prev[empId], [field]: value },
    }));
  };

  const getNetPay = (item: EmployeeRow) =>
    item.grossPay + item.allowances + item.bonus + item.overtimePay - item.deductions - item.taxAmount - item.loanDeduction;

  const totalAmount = selectedEmployees.reduce((sum, emp) => {
    const item = items[emp.id];
    return sum + (item ? getNetPay(item) : 0);
  }, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!periodStart) e.periodStart = "Start date is required";
    if (!periodEnd) e.periodEnd = "End date is required";
    if (periodStart && periodEnd && periodStart > periodEnd) e.periodEnd = "End date must be after start date";
    if (selectedIds.length === 0) e.employees = "Select at least one employee";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addPayrollRun({
      periodStart,
      periodEnd,
      totalAmount,
      notes: notes || null,
      items: selectedIds.map((id) => {
        const item = items[id];
        return {
          employeeId: item.employeeId,
          grossPay: item.grossPay,
          allowances: item.allowances,
          bonus: item.bonus,
          deductions: item.deductions,
          taxAmount: item.taxAmount,
          loanDeduction: item.loanDeduction,
          overtimePay: item.overtimePay,
          netPay: getNetPay(item),
        };
      }),
    });
    setSubmitting(false);
    if (result) router.push("/payroll/runs");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Payroll</span>
        <span>/</span>
        <button onClick={() => router.push("/payroll/runs")} className="hover:text-foreground">Payroll Runs</button>
        <span>/</span>
        <span className="text-foreground">New Run</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/payroll/runs")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Payroll Run</h1>
          <p className="text-muted-foreground mt-1">Create a new payroll processing run</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Period Details</CardTitle>
          <CardDescription>Define the payroll period</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodStart">Period Start *</Label>
              <Input id="periodStart" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
              {errors.periodStart && <p className="text-sm text-destructive">{errors.periodStart}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodEnd">Period End *</Label>
              <Input id="periodEnd" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
              {errors.periodEnd && <p className="text-sm text-destructive">{errors.periodEnd}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Employees</CardTitle>
              <CardDescription>Choose employees for this payroll run</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === employees.length && employees.length > 0}
                      onChange={toggleAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Base Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(emp.id)}
                          onChange={() => toggleEmployee(emp)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{emp.firstName} {emp.lastName}</TableCell>
                      <TableCell>{emp.departmentName}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(emp.baseSalary)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {errors.employees && <p className="text-sm text-destructive mt-2">{errors.employees}</p>}
        </CardContent>
      </Card>

      {selectedEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payroll Items</CardTitle>
            <CardDescription>Configure pay details for each selected employee</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Loan</TableHead>
                    <TableHead>Net Pay</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedEmployees.map((emp) => {
                    const item = items[emp.id];
                    if (!item) return null;
                    return (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium whitespace-nowrap">{emp.firstName} {emp.lastName}</TableCell>
                        <TableCell>
                          <Input type="number" min={0} value={item.grossPay || ""} onChange={(e) => updateItem(emp.id, "grossPay", parseFloat(e.target.value) || 0)} className="w-[110px]" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={0} value={item.allowances || ""} onChange={(e) => updateItem(emp.id, "allowances", parseFloat(e.target.value) || 0)} className="w-[110px]" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={0} value={item.bonus || ""} onChange={(e) => updateItem(emp.id, "bonus", parseFloat(e.target.value) || 0)} className="w-[110px]" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={0} value={item.overtimePay || ""} onChange={(e) => updateItem(emp.id, "overtimePay", parseFloat(e.target.value) || 0)} className="w-[110px]" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={0} value={item.deductions || ""} onChange={(e) => updateItem(emp.id, "deductions", parseFloat(e.target.value) || 0)} className="w-[110px]" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={0} value={item.taxAmount || ""} onChange={(e) => updateItem(emp.id, "taxAmount", parseFloat(e.target.value) || 0)} className="w-[110px]" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={0} value={item.loanDeduction || ""} onChange={(e) => updateItem(emp.id, "loanDeduction", parseFloat(e.target.value) || 0)} className="w-[110px]" />
                        </TableCell>
                        <TableCell className="font-bold text-green-600 whitespace-nowrap">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(getNetPay(item))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Net Pay</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(totalAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/payroll/runs")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Payroll Run"}
        </Button>
      </div>
    </div>
  );
}
