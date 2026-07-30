import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

const NULL_STRINGS = ["null", "undefined"];

function isNullLike(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val !== "string") return false;
  return NULL_STRINGS.includes(val.trim().toLowerCase()) || val.trim() === "";
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let totalFixed = 0;
  const details: Record<string, number> = {};

  try {
    const employees = await db.employee.findMany({
      select: {
        id: true,
        phone: true,
        jobTitle: true,
        bio: true,
        position: true,
      },
    });

    for (const emp of employees) {
      const data: Record<string, null> = {};
      if (isNullLike(emp.phone)) data.phone = null;
      if (isNullLike(emp.jobTitle)) data.jobTitle = null;
      if (isNullLike(emp.bio)) data.bio = null;
      if (isNullLike(emp.position)) data.position = null;

      if (Object.keys(data).length > 0) {
        await db.employee.update({ where: { id: emp.id }, data });
        totalFixed += Object.keys(data).length;
        details[`Employee#${emp.id}`] = Object.keys(data).length;
      }
    }

    return NextResponse.json({ success: true, totalFixed, details });
  } catch (error) {
    console.error("[CLEANUP_NULL]", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
