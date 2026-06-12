import { Role } from "../../generated/prisma/enums";
import { db } from "@/src/lib/db";
import { getBillingPlan } from "@/src/services/billing-plans.service";
import { getOrganizationPlanId } from "@/src/services/org-subscription.service";
import type {
  AdminOrganization,
  AdminEmployee,
  AdminDepartment,
  AdminStats,
  AdminAuditLog,
} from "@/src/types/admin";

const tenantOrgWhere = { isPlatform: false } as const;

/** People who use the product at a tenant company — never the platform owner */
const tenantUserEmployeeWhere = {
  role: { not: Role.SUPER_ADMIN },
};

const tenantUserWhere = {
  organization: { isPlatform: false },
  ...tenantUserEmployeeWhere,
} as const;

/** Internal staff + platform owner accounts */
const platformTeamWhere = {
  OR: [
    { organization: { isPlatform: true } },
    { role: Role.SUPER_ADMIN },
  ],
};

const tenantUserCountSelect = {
  where: tenantUserEmployeeWhere,
};

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalOrganizations,
    activeOrganizations,
    tenantUserCount,
    platformTeamCount,
    totalDepartments,
    totalTransactions,
    recentSignups,
  ] = await Promise.all([
    db.organization.count({ where: tenantOrgWhere }),
    db.organization.count({ where: { ...tenantOrgWhere, isActive: true } }),
    db.employee.count({ where: tenantUserWhere }),
    db.employee.count({ where: platformTeamWhere }),
    db.department.count(),
    db.transaction.count(),
    db.organization.count({
      where: {
        ...tenantOrgWhere,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    totalOrganizations,
    activeOrganizations,
    tenantUserCount,
    platformTeamCount,
    totalEmployees: tenantUserCount,
    totalDepartments,
    totalTransactions,
    recentSignups,
    revenueEstimate: activeOrganizations * 125000,
    growthRate: recentSignups > 0 ? Math.round((recentSignups / Math.max(totalOrganizations, 1)) * 100) : 0,
  };
}

export async function getAdminOrganizations(): Promise<AdminOrganization[]> {
  const orgs = await db.organization.findMany({
    where: tenantOrgWhere,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { employees: tenantUserCountSelect, departments: true } },
    },
  });

  return orgs.map((org) => {
    const plan = getBillingPlan(getOrganizationPlanId(org.id));
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      logo: org.logo,
      email: org.email,
      phone: org.phone,
      isPlatform: org.isPlatform,
      isActive: org.isActive,
      employeeCount: org._count.employees,
      departmentCount: org._count.departments,
      plan: plan?.name ?? "Starter",
      createdAt: org.createdAt.toISOString(),
    };
  });
}

export async function getAdminOrganization(id: string) {
  return db.organization.findUnique({
    where: { id },
    include: {
      departments: {
        include: { _count: { select: { employees: tenantUserCountSelect } } },
      },
      employees: {
        where: tenantUserEmployeeWhere,
        take: 50,
        orderBy: { createdAt: "desc" },
        include: { department: true },
      },
      _count: {
        select: {
          employees: tenantUserCountSelect,
          departments: true,
          transactions: true,
        },
      },
    },
  });
}

const platformEmployeeWhere = {
  organization: { isPlatform: true },
} as const;

export async function getAdminPlatformTeam(): Promise<AdminEmployee[]> {
  const employees = await db.employee.findMany({
    where: platformTeamWhere,
    orderBy: { createdAt: "desc" },
    include: {
      organization: { select: { name: true } },
      department: { select: { name: true } },
    },
  });

  return employees.map((emp) => ({
    id: emp.id,
    employeeCode: emp.employeeCode,
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    role: emp.role,
    isActive: emp.isActive,
    organizationId: emp.organizationId,
    organizationName: emp.organization.name,
    departmentName: emp.department?.name ?? null,
    createdAt: emp.createdAt.toISOString(),
  }));
}

export async function getAdminEmployees(): Promise<AdminEmployee[]> {
  const employees = await db.employee.findMany({
    where: platformEmployeeWhere,
    orderBy: { createdAt: "desc" },
    include: {
      organization: { select: { name: true } },
      department: { select: { name: true } },
    },
  });

  return employees.map((emp) => ({
    id: emp.id,
    employeeCode: emp.employeeCode,
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    role: emp.role,
    isActive: emp.isActive,
    organizationId: emp.organizationId,
    organizationName: emp.organization.name,
    departmentName: emp.department?.name ?? null,
    createdAt: emp.createdAt.toISOString(),
  }));
}

export async function getAdminEmployee(id: string) {
  return db.employee.findFirst({
    where: {
      id,
      ...platformEmployeeWhere,
    },
    include: {
      organization: true,
      department: true,
    },
  });
}

export async function getAdminDepartments(): Promise<AdminDepartment[]> {
  const departments = await db.department.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      organization: { select: { name: true } },
      _count: { select: { employees: tenantUserCountSelect } },
    },
  });

  return departments.map((dept) => ({
    id: dept.id,
    name: dept.name,
    code: dept.code,
    organizationId: dept.organizationId,
    organizationName: dept.organization.name,
    employeeCount: dept._count.employees,
    head: dept.head,
    createdAt: dept.createdAt.toISOString(),
  }));
}

export async function getAdminDepartment(id: string) {
  return db.department.findUnique({
    where: { id },
    include: {
      organization: true,
      employees: {
        where: tenantUserEmployeeWhere,
        take: 50,
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { employees: tenantUserCountSelect } },
    },
  });
}

export async function getAdminAuditLogs(limit = 100): Promise<AdminAuditLog[]> {
  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      organization: { select: { name: true } },
    },
  });

  return logs.map((log) => ({
    id: log.id,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    userName: log.userName,
    organizationName: log.organization?.name ?? null,
    createdAt: log.createdAt.toISOString(),
  }));
}

export async function getAdminAuditLog(id: string) {
  return db.auditLog.findUnique({
    where: { id },
    include: { organization: true },
  });
}
