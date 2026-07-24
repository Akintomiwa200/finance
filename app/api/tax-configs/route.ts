import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };

  const [configs, total] = await Promise.all([
    db.taxConfiguration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.taxConfiguration.count({ where }),
  ]);

  const mapped = configs.map((c) => ({
    ...c,
    rate: Number(c.rate),
    threshold: c.threshold ? Number(c.threshold) : null,
  }));

  return NextResponse.json({ taxConfigs: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  const config = await db.taxConfiguration.create({
    data: {
      name: body.name,
      rate: body.rate,
      threshold: body.threshold || null,
      isActive: body.isActive !== false,
      organizationId: session.user.organizationId,
    },
  });

  return NextResponse.json({
    taxConfig: {
      ...config,
      rate: Number(config.rate),
      threshold: config.threshold ? Number(config.threshold) : null,
    },
  }, { status: 201 });
}
