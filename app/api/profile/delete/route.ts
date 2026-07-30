import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const employeeId = session.user.id;

    await db.$transaction([
      db.expenseItem.deleteMany({ where: { expenseReport: { employeeId } } }),
      db.expenseReport.deleteMany({ where: { employeeId } }),
      db.reimbursement.deleteMany({ where: { employeeId } }),
      db.payrollItem.deleteMany({ where: { employeeId } }),
      db.approvalStep.deleteMany({ where: { request: { requesterId: employeeId } } }),
      db.approvalRequest.deleteMany({ where: { requesterId: employeeId } }),
      db.employee.delete({ where: { id: employeeId } }),
    ]);

    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
