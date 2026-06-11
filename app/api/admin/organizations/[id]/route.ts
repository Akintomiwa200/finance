import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminOrganization } from "@/src/services/admin.service";
import { db } from "@/src/lib/db";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { createAuditLog } from "@/src/services/audit.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const org = await getAdminOrganization(id);

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  return NextResponse.json(org);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();
    const org = await db.organization.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        logo: body.logo,
        isActive: body.isActive,
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entity: "organization",
      entityId: id,
      userId: session!.user.id,
      userName: session!.user.name ?? "Super Admin",
      organizationId: id,
      details: body,
    });

    pushRealtimeEvent({
      event: "update",
      entity: "organization",
      data: { id, name: org.name },
      userId: session!.user.id,
    });

    return NextResponse.json(org);
  } catch {
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}
