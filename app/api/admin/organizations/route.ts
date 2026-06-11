import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminOrganizations } from "@/src/services/admin.service";
import { db } from "@/src/lib/db";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { createAuditLog } from "@/src/services/audit.service";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const organizations = await getAdminOrganizations();
  return NextResponse.json(organizations);
}

export async function POST(req: Request) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { name, slug, email, phone, logo } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const existing = await db.organization.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const org = await db.organization.create({
      data: { name, slug, email, phone },
    });

    await db.department.create({
      data: {
        name: "Administration",
        code: `${slug.toUpperCase().slice(0, 4)}-ADM`,
        organizationId: org.id,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entity: "organization",
      entityId: org.id,
      userId: session!.user.id,
      userName: session!.user.name ?? "Super Admin",
      details: { name, slug },
    });

    pushRealtimeEvent({
      event: "create",
      entity: "organization",
      data: { id: org.id, name: org.name },
      userId: session!.user.id,
    });

    return NextResponse.json({
      id: org.id,
      name: org.name,
      slug: org.slug,
      logo: org.logo,
      email: org.email,
      isActive: org.isActive,
      createdAt: org.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}
