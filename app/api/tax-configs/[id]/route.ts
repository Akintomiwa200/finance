import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const config = await db.taxConfiguration.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!config) return NextResponse.json({ error: "Tax configuration not found" }, { status: 404 });

  return NextResponse.json({
    taxConfig: {
      ...config,
      rate: Number(config.rate),
      threshold: config.threshold ? Number(config.threshold) : null,
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const existing = await db.taxConfiguration.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Tax configuration not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.rate !== undefined) data.rate = body.rate;
  if (body.threshold !== undefined) data.threshold = body.threshold || null;
  if (body.isActive !== undefined) data.isActive = body.isActive;

  const config = await db.taxConfiguration.update({
    where: { id },
    data,
  });

  return NextResponse.json({
    taxConfig: {
      ...config,
      rate: Number(config.rate),
      threshold: config.threshold ? Number(config.threshold) : null,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.taxConfiguration.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Tax configuration not found" }, { status: 404 });

  await db.taxConfiguration.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
