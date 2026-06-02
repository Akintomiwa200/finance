import { hash } from "bcryptjs";
import { db } from "@/src/lib/db";

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}) {
  const existing = await db.employee.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await hash(data.password, 12);

  const organization = await db.organization.create({
    data: {
      name: data.organizationName,
      slug: data.organizationName.toLowerCase().replace(/\s+/g, "-"),
    },
  });

  const department = await db.department.create({
    data: {
      name: "Administration",
      code: "ADMIN",
      organizationId: organization.id,
    },
  });

  const employee = await db.employee.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      employeeCode: "ADMIN001",
      passwordHash,
      role: "ADMIN",
      departmentId: department.id,
      organizationId: organization.id,
    },
  });

  return {
    id: employee.id,
    email: employee.email,
    name: `${employee.firstName} ${employee.lastName}`,
    organizationId: organization.id,
  };
}
