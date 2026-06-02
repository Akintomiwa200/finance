import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { getEmployeeById, updateEmployee, deleteEmployee } from "@/src/services/employee.service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employee = await getEmployeeById(id);
  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: employee });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const employee = await updateEmployee(id, body);
    return NextResponse.json({ data: employee });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update employee";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteEmployee(id);
  return NextResponse.json({ success: true });
}
