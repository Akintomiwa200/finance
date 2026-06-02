import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { getEmployees, createEmployee } from "@/src/services/employee.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employees = await getEmployees(session.user.organizationId);
  return NextResponse.json({ data: employees });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const employee = await createEmployee({
      ...body,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json({ data: employee }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create employee";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
