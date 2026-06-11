import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminDepartments } from "@/src/services/admin.service";
import { db } from "@/src/lib/db";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { createAuditLog } from "@/src/services/audit.service";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const departments = await getAdminDepartments();
  return NextResponse.json(departments);
}

export async function POST(req: Request) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { name, code, organizationId, head, description } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 },
      );
    }

    let resolvedOrganizationId = organizationId as string | undefined;
    if (resolvedOrganizationId) {
      const org = await db.organization.findUnique({
        where: { id: resolvedOrganizationId },
      });
      if (!org) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
      }
    } else {
      const platformOrg =
        (await db.organization.findFirst({ where: { isPlatform: true } })) ??
        (await db.organization.findFirst({ orderBy: { createdAt: "asc" } }));
      if (!platformOrg) {
        return NextResponse.json(
          { error: "No organization available to attach department" },
          { status: 400 },
        );
      }
      resolvedOrganizationId = platformOrg.id;
    }

    const existing = await db.department.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { error: "Department code already exists" },
        { status: 409 },
      );
    }

    const department = await db.department.create({
      data: {
        name,
        code: code.toUpperCase(),
        organizationId: resolvedOrganizationId,
        head: head || null,
        description: description || null,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entity: "department",
      entityId: department.id,
      userId: session!.user.id,
      userName: session!.user.name ?? "Super Admin",
      organizationId: resolvedOrganizationId,
      details: { name, code },
    });

    pushRealtimeEvent({
      event: "create",
      entity: "department",
      data: { id: department.id, name: department.name },
      userId: session!.user.id,
    });

    return NextResponse.json({
      id: department.id,
      name: department.name,
      code: department.code,
      organizationId: department.organizationId,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 },
    );
  }
}
