"use client";

import { create } from "zustand";
import type { Employee, Department } from "@/src/types/employee";

interface EmployeeState {
  employees: Employee[];
  departments: Department[];
  loading: boolean;

  fetchEmployees: () => Promise<void>;
  fetchDepartments: () => Promise<void>;

  getEmployeeById: (id: string) => Employee | undefined;
  getDepartmentById: (id: string) => Department | undefined;

  addEmployee: (data: Record<string, unknown>) => Promise<Employee | null>;
  updateEmployee: (id: string, data: Record<string, unknown>) => Promise<Employee | null>;
  deleteEmployee: (id: string) => Promise<boolean>;

  addDepartment: (data: Record<string, unknown>) => Promise<Department | null>;
  updateDepartment: (id: string, data: Record<string, unknown>) => Promise<Department | null>;
  deleteDepartment: (id: string) => Promise<boolean>;
}

function mapEmployee(raw: Record<string, unknown>): Employee {
  return {
    id: raw.id as string,
    employeeCode: raw.employeeCode as string,
    firstName: raw.firstName as string,
    lastName: raw.lastName as string,
    email: raw.email as string,
    phone: raw.phone as string | null,
    position: raw.position as string | null,
    baseSalary: Number(raw.baseSalary),
    bankName: raw.bankName as string | null,
    bankAccount: raw.bankAccount as string | null,
    bankCode: raw.bankCode as string | null,
    taxId: raw.taxId as string | null,
    hireDate: raw.hireDate as string | null,
    isActive: raw.isActive as boolean,
    role: raw.role as Employee["role"],
    departmentId: raw.departmentId as string,
    departmentName: (raw.departmentName as string) || "",
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapDepartment(raw: Record<string, unknown>): Department {
  return {
    id: raw.id as string,
    name: raw.name as string,
    code: raw.code as string,
    description: raw.description as string | null,
    costCenter: raw.costCenter as string | null,
    budgetAmount: Number(raw.budgetAmount),
    head: raw.head as string | null,
    employeeCount: Number(raw.employeeCount) || 0,
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const useEmployeeStore = create<EmployeeState>()((set, get) => ({
  employees: [],
  departments: [],
  loading: false,

  fetchEmployees: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const json = await res.json();
      const raw = json.data ?? json;
      set({ employees: Array.isArray(raw) ? raw.map(mapEmployee) : [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchDepartments: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/departments");
      if (!res.ok) throw new Error("Failed to fetch departments");
      const json = await res.json();
      const raw = json.departments ?? json.data ?? json;
      set({ departments: Array.isArray(raw) ? raw.map(mapDepartment) : [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getEmployeeById: (id) => get().employees.find((e) => e.id === id),
  getDepartmentById: (id) => get().departments.find((d) => d.id === id),

  addEmployee: async (data) => {
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      const json = await res.json();
      const mapped = mapEmployee(json.data);
      set({ employees: [mapped, ...get().employees] });
      return mapped;
    } catch {
      return null;
    }
  },

  updateEmployee: async (id, data) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      const json = await res.json();
      const mapped = mapEmployee(json.data);
      set({ employees: get().employees.map((e) => (e.id === id ? mapped : e)) });
      return mapped;
    } catch {
      return null;
    }
  },

  deleteEmployee: async (id) => {
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      set({ employees: get().employees.filter((e) => e.id !== id) });
      return true;
    } catch {
      return false;
    }
  },

  addDepartment: async (data) => {
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      const json = await res.json();
      const mapped = mapDepartment(json.department ?? json.data ?? json);
      set({ departments: [mapped, ...get().departments] });
      return mapped;
    } catch {
      return null;
    }
  },

  updateDepartment: async (id, data) => {
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      const json = await res.json();
      const mapped = mapDepartment(json.department ?? json.data ?? json);
      set({ departments: get().departments.map((d) => (d.id === id ? mapped : d)) });
      return mapped;
    } catch {
      return null;
    }
  },

  deleteDepartment: async (id) => {
    try {
      const res = await fetch(`/api/departments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      set({ departments: get().departments.filter((d) => d.id !== id) });
      return true;
    } catch {
      return false;
    }
  },
}));
