import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const org = await db.organization.upsert({
    where: { slug: "acme-corp" },
    update: {},
    create: {
      name: "Acme Corp",
      slug: "acme-corp",
      email: "finance@acmecorp.com",
      phone: "+234-800-000-0000",
    },
  });

  const departments = await Promise.all([
    db.department.upsert({
      where: { code: "ADMIN" },
      update: {},
      create: {
        name: "Administration",
        code: "ADMIN",
        costCenter: "CC-001",
        organizationId: org.id,
      },
    }),
    db.department.upsert({
      where: { code: "FIN" },
      update: {},
      create: {
        name: "Finance",
        code: "FIN",
        costCenter: "CC-002",
        organizationId: org.id,
      },
    }),
    db.department.upsert({
      where: { code: "HR" },
      update: {},
      create: {
        name: "Human Resources",
        code: "HR",
        costCenter: "CC-003",
        organizationId: org.id,
      },
    }),
    db.department.upsert({
      where: { code: "ENG" },
      update: {},
      create: {
        name: "Engineering",
        code: "ENG",
        costCenter: "CC-004",
        organizationId: org.id,
      },
    }),
    db.department.upsert({
      where: { code: "SALES" },
      update: {},
      create: {
        name: "Sales & Marketing",
        code: "SALES",
        costCenter: "CC-005",
        organizationId: org.id,
      },
    }),
  ]);

  const passwordHash = await hash("password123", 12);

  const admin = await db.employee.upsert({
    where: { email: "admin@acmecorp.com" },
    update: {},
    create: {
      employeeCode: "ADMIN001",
      firstName: "Admin",
      lastName: "User",
      email: "admin@acmecorp.com",
      passwordHash,
      position: "Finance Administrator",
      baseSalary: 5000000,
      role: "ADMIN",
      departmentId: departments[1].id,
      organizationId: org.id,
      isActive: true,
    },
  });

  const financeManager = await db.employee.upsert({
    where: { email: "manager@acmecorp.com" },
    update: {},
    create: {
      employeeCode: "FIN001",
      firstName: "Jane",
      lastName: "Manager",
      email: "manager@acmecorp.com",
      passwordHash,
      position: "Finance Manager",
      baseSalary: 4000000,
      role: "FINANCE_MANAGER",
      departmentId: departments[1].id,
      organizationId: org.id,
      isActive: true,
    },
  });

  const payrollOfficer = await db.employee.upsert({
    where: { email: "payroll@acmecorp.com" },
    update: {},
    create: {
      employeeCode: "FIN002",
      firstName: "Paul",
      lastName: "Roller",
      email: "payroll@acmecorp.com",
      passwordHash,
      position: "Payroll Officer",
      baseSalary: 2500000,
      role: "PAYROLL_OFFICER",
      departmentId: departments[1].id,
      organizationId: org.id,
      isActive: true,
    },
  });

  const employees = [
    { code: "EMP00001", first: "John", last: "Doe", email: "john@acmecorp.com", salary: 1500000, deptIdx: 3 },
    { code: "EMP00002", first: "Sarah", last: "Smith", email: "sarah@acmecorp.com", salary: 1800000, deptIdx: 3 },
    { code: "EMP00003", first: "Mike", last: "Johnson", email: "mike@acmecorp.com", salary: 1200000, deptIdx: 4 },
    { code: "EMP00004", first: "Emily", last: "Davis", email: "emily@acmecorp.com", salary: 2000000, deptIdx: 2 },
    { code: "EMP00005", first: "James", last: "Wilson", email: "james@acmecorp.com", salary: 900000, deptIdx: 0 },
  ];

  for (const emp of employees) {
    await db.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        employeeCode: emp.code,
        firstName: emp.first,
        lastName: emp.last,
        email: emp.email,
        passwordHash,
        position: "Employee",
        baseSalary: emp.salary,
        role: "EMPLOYEE",
        departmentId: departments[emp.deptIdx].id,
        organizationId: org.id,
        isActive: true,
      },
    });
  }

  // Tax configuration
  await db.taxConfiguration.upsert({
    where: { id: "payee-tax" },
    update: {},
    create: {
      id: "payee-tax",
      name: "PAYE Tax (Nigeria)",
      rate: 0.01,
      threshold: 300000,
      isActive: true,
      organizationId: org.id,
    },
  });

  // Budget for current fiscal year
  const currentYear = new Date().getFullYear();
  for (const dept of departments) {
    const budget = await db.budget.upsert({
      where: { id: `budget-${dept.code}-${currentYear}` },
      update: {},
      create: {
        id: `budget-${dept.code}-${currentYear}`,
        fiscalYear: currentYear,
        totalAmount: 50000000,
        departmentId: dept.id,
        organizationId: org.id,
        lineItems: {
          create: [
            { category: "Salaries", allocated: 30000000 },
            { category: "Operations", allocated: 10000000 },
            { category: "Equipment", allocated: 5000000 },
            { category: "Training", allocated: 3000000 },
            { category: "Miscellaneous", allocated: 2000000 },
          ],
        },
      },
    });
  }

  console.log("Seed completed successfully");
  console.log(`Organization: ${org.name}`);
  console.log(`Admin login: admin@acmecorp.com / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
