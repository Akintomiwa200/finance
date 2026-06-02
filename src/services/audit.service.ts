import { db } from "@/src/lib/db";

export async function getAuditLogs(organizationId: string, limit = 100) {
  return db.auditLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function createAuditLog(data: {
  action: string;
  entity: string;
  entityId?: string | null;
  details?: unknown;
  userId?: string | null;
  userName?: string | null;
  organizationId?: string | null;
  ipAddress?: string | null;
}) {
  return db.auditLog.create({
    data: {
      action: data.action,
      entity: data.entity,
      entityId: data.entityId ?? null,
      details: data.details ?? undefined,
      userId: data.userId ?? null,
      userName: data.userName ?? null,
      organizationId: data.organizationId ?? null,
      ipAddress: data.ipAddress ?? null,
    } as never,
  });
}

export async function logAction(
  action: string,
  entity: string,
  entityId: string | undefined,
  userId: string | undefined,
  userName: string | undefined,
  organizationId: string | undefined
) {
  return createAuditLog({
    action,
    entity,
    entityId,
    userId,
    userName,
    organizationId,
  });
}
