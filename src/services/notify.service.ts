import { Role } from "../../generated/prisma/enums";
import { db } from "@/src/lib/db";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { getAppUrl } from "@/src/lib/mail";
import { sendTemplatedEmail } from "@/src/services/email.service";
import { createNotification } from "@/src/services/notification.service";
import type { EmailTemplateData, EmailTemplateKind } from "@/src/lib/email-templates";
import type { AppNotification } from "@/src/types/notification";

export interface NotifyRecipient {
  userId?: string;
  email: string;
  name?: string;
}

function severityFromType(type?: string): AppNotification["type"] {
  switch ((type ?? "INFO").toUpperCase()) {
    case "SUCCESS":
      return "SUCCESS";
    case "WARNING":
      return "WARNING";
    case "ERROR":
      return "ERROR";
    default:
      return "INFO";
  }
}

function categoryFromType(type?: string): AppNotification["category"] {
  const upper = (type ?? "").toUpperCase();
  if (upper === "ERROR") return "system_errors";
  if (upper === "MESSAGE") return "messages";
  return "events";
}

function toAppNotification(
  record: { id: string; title: string; message: string; type: string; isRead: boolean; createdAt: Date; referenceId: string | null },
): AppNotification {
  return {
    id: record.id,
    title: record.title,
    message: record.message,
    category: categoryFromType(record.type),
    type: severityFromType(record.type),
    isRead: record.isRead,
    createdAt: record.createdAt.toISOString(),
    referenceId: record.referenceId ?? undefined,
  };
}

/** In-app notification + realtime push + branded email */
export async function notifyRecipient(input: {
  recipient: NotifyRecipient;
  title: string;
  message: string;
  type?: string;
  referenceId?: string;
  actionPath?: string;
  actionLabel?: string;
  secondaryActionPath?: string;
  secondaryActionLabel?: string;
  emailSubject?: string;
  emailTemplate?: EmailTemplateKind;
  emailData?: Partial<EmailTemplateData>;
}) {
  const {
    recipient,
    title,
    message,
    type,
    referenceId,
    actionPath,
    actionLabel,
    secondaryActionPath,
    secondaryActionLabel,
    emailSubject,
    emailTemplate = "notification",
    emailData,
  } = input;

  const actionUrl = actionPath ? `${getAppUrl()}${actionPath}` : undefined;
  const secondaryActionUrl = secondaryActionPath ? `${getAppUrl()}${secondaryActionPath}` : undefined;

  if (recipient.userId) {
    const record = await createNotification({
      userId: recipient.userId,
      title,
      message,
      type,
      referenceId,
    });

    pushRealtimeEvent({
      event: "notification",
      entity: "notification",
      data: toAppNotification(record),
      userId: recipient.userId,
    });
  }

  const templateData: EmailTemplateData = {
    recipientName: recipient.name,
    title: emailData?.title ?? title,
    subtitle: emailData?.subtitle,
    body: emailData?.body ?? message,
    preheader: emailData?.preheader ?? title,
    heroIcon: emailData?.heroIcon,
    badge: emailData?.badge,
    details: emailData?.details,
    lineItems: emailData?.lineItems,
    subtotal: emailData?.subtotal,
    discount: emailData?.discount,
    tax: emailData?.tax,
    total: emailData?.total,
    stats: emailData?.stats,
    quote: emailData?.quote,
    quoteAuthor: emailData?.quoteAuthor,
    checklist: emailData?.checklist,
    promoText: emailData?.promoText,
    promoCode: emailData?.promoCode,
    actionLabel: emailData?.actionLabel ?? actionLabel,
    actionUrl: emailData?.actionUrl ?? actionUrl,
    secondaryActionLabel: emailData?.secondaryActionLabel ?? secondaryActionLabel,
    secondaryActionUrl: emailData?.secondaryActionUrl ?? secondaryActionUrl,
    footerNote: emailData?.footerNote,
  };

  void sendTemplatedEmail({
    to: recipient.email,
    subject: emailSubject ?? title,
    template: emailTemplate,
    data: templateData,
  }).catch((err) => console.error("[notify] email failed", err));
}

export async function notifyRecipients(
  recipients: NotifyRecipient[],
  input: Omit<Parameters<typeof notifyRecipient>[0], "recipient">,
) {
  const seen = new Set<string>();
  for (const recipient of recipients) {
    const key = `${recipient.userId ?? ""}:${recipient.email.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    await notifyRecipient({ ...input, recipient });
  }
}

export async function getEmployeeContact(userId: string): Promise<NotifyRecipient | null> {
  const employee = await db.employee.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
  });
  if (!employee?.isActive) return null;
  return {
    userId: employee.id,
    email: employee.email,
    name: `${employee.firstName} ${employee.lastName}`.trim(),
  };
}

export async function getPlatformTeamContacts(): Promise<NotifyRecipient[]> {
  const members = await db.employee.findMany({
    where: {
      isActive: true,
      OR: [{ organization: { isPlatform: true } }, { role: Role.SUPER_ADMIN }],
    },
    select: { id: true, email: true, firstName: true, lastName: true },
    orderBy: { createdAt: "asc" },
  });

  return members.map((m) => ({
    userId: m.id,
    email: m.email,
    name: `${m.firstName} ${m.lastName}`.trim(),
  }));
}

export async function getOrganizationContacts(
  organizationId: string,
  options?: { adminsOnly?: boolean },
): Promise<NotifyRecipient[]> {
  const members = await db.employee.findMany({
    where: {
      organizationId,
      isActive: true,
      role: options?.adminsOnly
        ? { in: [Role.ADMIN, Role.FINANCE_MANAGER, Role.DEPARTMENT_HEAD] }
        : { not: Role.SUPER_ADMIN },
    },
    select: { id: true, email: true, firstName: true, lastName: true },
    orderBy: { createdAt: "asc" },
  });

  return members.map((m) => ({
    userId: m.id,
    email: m.email,
    name: `${m.firstName} ${m.lastName}`.trim(),
  }));
}

export async function notifyPlatformTeam(
  input: Omit<Parameters<typeof notifyRecipient>[0], "recipient">,
) {
  const recipients = await getPlatformTeamContacts();
  await notifyRecipients(recipients, input);
}

export async function notifyOrganization(
  organizationId: string,
  input: Omit<Parameters<typeof notifyRecipient>[0], "recipient"> & { adminsOnly?: boolean },
) {
  const { adminsOnly, ...rest } = input;
  const recipients = await getOrganizationContacts(organizationId, { adminsOnly });
  await notifyRecipients(recipients, rest);
}
