import type { LiveFixChatMessage, LiveFixSession, SupportComment, SupportTicket } from "@/src/types/admin";
import { EMAIL_BRAND } from "@/src/lib/email-brand";
import {
  getEmployeeContact,
  getOrganizationContacts,
  notifyOrganization,
  notifyPlatformTeam,
  notifyRecipient,
  notifyRecipients,
} from "@/src/services/notify.service";

const WELCOME_CHECKLIST = [
  "Set up your chart of accounts and fiscal year",
  "Invite your team and assign roles",
  "Connect bank accounts and payment methods",
  "Enable modules for payroll, invoices, and reports",
  "Turn on email alerts in Settings → Notifications",
];

/** Admin created an account for this person — send login details */
export async function onAccountCreated(input: {
  userId: string;
  email: string;
  name: string;
  organizationName: string;
  role: string;
  createdByName?: string;
  initialPassword?: string;
}) {
  const firstName = input.name.split(" ")[0] || input.name;
  const roleLabel = input.role.replace(/_/g, " ").toLowerCase();

  const details: { label: string; value: string; highlight?: boolean }[] = [
    { label: "Email", value: input.email, highlight: true },
    { label: "Organization", value: input.organizationName },
    { label: "Role", value: roleLabel },
  ];

  if (input.initialPassword) {
    details.push({ label: "Temporary password", value: input.initialPassword });
  }

  await notifyRecipient({
    recipient: { userId: input.userId, email: input.email, name: input.name },
    title: "Your account is ready",
    message: `An account was created for you at ${input.organizationName}.`,
    type: "SUCCESS",
    actionPath: "/login",
    actionLabel: "Sign in",
    secondaryActionPath: "/settings/preferences/security",
    secondaryActionLabel: "Change password",
    emailSubject: `Your ${EMAIL_BRAND.name} account — ${input.organizationName}`,
    emailTemplate: "welcome",
    emailData: {
      title: `Welcome, ${firstName}!`,
      subtitle: input.createdByName
        ? `${input.createdByName} created your account on ${input.organizationName}.`
        : `Your account on ${input.organizationName} is ready.`,
      body: input.initialPassword
        ? "Sign in with the email and temporary password below. Change your password after your first login."
        : "Sign in with your email and the password your administrator shared with you.",
      heroIcon: "welcome",
      badge: { label: "Account created", tone: "success" },
      details,
      checklist: [
        "Sign in at the link below",
        "Complete your profile",
        "Explore your dashboard and assigned modules",
        input.initialPassword ? "Update your password in Settings → Security" : "Contact your admin if you need login help",
      ],
      actionLabel: "Sign in now",
      secondaryActionLabel: "Security settings",
    },
  });
}

export async function onUserRegistered(input: {
  userId: string;
  email: string;
  name: string;
  organizationName: string;
}) {
  await notifyRecipient({
    recipient: { userId: input.userId, email: input.email, name: input.name },
    title: `Welcome to ${EMAIL_BRAND.name}`,
    message: `Your organization "${input.organizationName}" is ready.`,
    type: "SUCCESS",
    actionPath: "/dashboard",
    actionLabel: "Go to dashboard",
    secondaryActionPath: "/settings/notifications/email",
    secondaryActionLabel: "Notification settings",
    emailSubject: `Welcome to ${EMAIL_BRAND.name} — ${input.organizationName}`,
    emailTemplate: "welcome",
    emailData: {
      title: `Welcome, ${input.name.split(" ")[0]}!`,
      subtitle: `We're glad to have you and ${input.organizationName} on board.`,
      body: `${EMAIL_BRAND.name} helps your team manage finance, payroll, billing, and reporting in one place.`,
      heroIcon: "welcome",
      checklist: WELCOME_CHECKLIST,
      actionLabel: "Open dashboard",
      secondaryActionLabel: "Configure notifications",
    },
  });
}

export async function onSupportTicketCreated(
  ticket: SupportTicket,
  creator?: { userId?: string; email?: string; name?: string },
) {
  await notifyPlatformTeam({
    title: `New support ticket: ${ticket.title}`,
    message: ticket.description,
    type: "MESSAGE",
    referenceId: ticket.id,
    actionPath: `/admin/support/${ticket.id}`,
    actionLabel: "Open ticket",
    emailSubject: `[Support] ${ticket.title}`,
    emailTemplate: "support-ticket",
    emailData: {
      title: "New support ticket",
      subtitle: `${ticket.organizationName} needs help`,
      body: ticket.description,
      heroIcon: "support",
      badge: { label: ticket.priority, tone: ticket.priority === "URGENT" ? "danger" : "info" },
      details: [
        { label: "Ticket", value: ticket.title, highlight: true },
        { label: "Company", value: ticket.organizationName },
        { label: "Priority", value: ticket.priority },
        { label: "Status", value: ticket.status.replace(/_/g, " ") },
        { label: "From", value: ticket.createdByName ?? "Customer" },
      ],
      actionLabel: "Review ticket",
    },
  });

  if (creator?.email) {
    await notifyRecipient({
      recipient: { userId: creator.userId, email: creator.email, name: creator.name },
      title: "Support ticket received",
      message: `We received your ticket "${ticket.title}".`,
      type: "SUCCESS",
      referenceId: ticket.id,
      actionPath: `/support/${ticket.id}`,
      actionLabel: "View ticket",
      emailTemplate: "support-ticket",
      emailData: {
        title: "We got your request",
        subtitle: "Our support team will respond shortly.",
        body: `Your ticket "${ticket.title}" has been logged. You'll receive email updates when we reply.`,
        badge: { label: "Received", tone: "success" },
        details: [
          { label: "Subject", value: ticket.title },
          { label: "Priority", value: ticket.priority },
          { label: "Reference", value: ticket.id },
        ],
        actionLabel: "Track ticket",
      },
    });
  }
}

export async function onSupportTicketUpdated(ticket: SupportTicket) {
  const contacts = await getOrganizationContactsForTicket(ticket, ticket.createdByEmail);
  await notifyRecipients(contacts, {
    title: `Ticket updated: ${ticket.title}`,
    message: `Status: ${ticket.status.replace(/_/g, " ").toLowerCase()}`,
    type: "INFO",
    referenceId: ticket.id,
    actionPath: `/support/${ticket.id}`,
    actionLabel: "View ticket",
    emailTemplate: "support-ticket",
    emailData: {
      title: "Ticket status updated",
      subtitle: ticket.title,
      badge: { label: ticket.status.replace(/_/g, " "), tone: "info" },
      details: [
        { label: "Status", value: ticket.status.replace(/_/g, " "), highlight: true },
        ...(ticket.assignedToName ? [{ label: "Assigned to", value: ticket.assignedToName }] : []),
        { label: "Priority", value: ticket.priority },
      ],
      actionLabel: "View ticket",
    },
  });
}

export async function onSupportCommentAdded(
  ticket: SupportTicket,
  comment: SupportComment,
  author?: { userId?: string; email?: string; name?: string },
) {
  if (comment.isStaff) {
    const contacts = await getOrganizationContactsForTicket(ticket, ticket.createdByEmail);
    await notifyRecipients(contacts, {
      title: `Reply on: ${ticket.title}`,
      message: comment.content,
      type: "MESSAGE",
      referenceId: ticket.id,
      actionPath: `/support/${ticket.id}`,
      actionLabel: "Read reply",
      emailSubject: `[Support reply] ${ticket.title}`,
      emailTemplate: "support-reply",
      emailData: {
        title: "New reply from support",
        subtitle: ticket.title,
        quote: comment.content,
        quoteAuthor: comment.authorName ?? "Support Team",
        body: "Open your ticket to continue the conversation.",
        actionLabel: "Read full thread",
      },
    });
    return;
  }

  await notifyPlatformTeam({
    title: `Customer replied: ${ticket.title}`,
    message: comment.content,
    type: "MESSAGE",
    referenceId: ticket.id,
    actionPath: `/admin/support/${ticket.id}`,
    actionLabel: "Open ticket",
    emailSubject: `[Support] Customer reply — ${ticket.title}`,
    emailTemplate: "support-reply",
    emailData: {
      title: "Customer replied",
      subtitle: `${ticket.organizationName} · ${ticket.title}`,
      quote: comment.content,
      quoteAuthor: comment.authorName ?? "Customer",
      actionLabel: "Respond now",
    },
  });

  if (author?.email) {
    await notifyRecipient({
      recipient: { userId: author.userId, email: author.email, name: author.name },
      title: "Comment posted",
      message: `Your message was added to "${ticket.title}".`,
      type: "SUCCESS",
      referenceId: ticket.id,
      actionPath: `/support/${ticket.id}`,
      emailTemplate: "notification",
      emailData: {
        title: "Message sent",
        subtitle: ticket.title,
        badge: { label: "Delivered", tone: "success" },
      },
    });
  }
}

export async function onLiveFixSessionCreated(
  session: LiveFixSession,
  requester?: { userId?: string; email?: string; name?: string },
) {
  await notifyPlatformTeam({
    title: `Live fix requested — ${session.sessionCode}`,
    message: `${session.organizationName} requested live support.`,
    type: "MESSAGE",
    referenceId: session.id,
    actionPath: `/admin/support/live-fix/${session.id}`,
    actionLabel: "Join queue",
    emailSubject: `[Live fix] ${session.sessionCode}`,
    emailTemplate: "live-fix",
    emailData: {
      title: "Live fix session queued",
      subtitle: session.organizationName,
      body: `${session.requestedBy ?? "A customer"} is waiting for remote assistance.`,
      badge: { label: session.sessionCode, tone: "warning" },
      details: [
        { label: "Session code", value: session.sessionCode, highlight: true },
        { label: "Company", value: session.organizationName },
        { label: "Requested by", value: session.requestedBy },
      ],
      actionLabel: "Join session",
    },
  });

  if (requester?.email) {
    await notifyRecipient({
      recipient: { userId: requester.userId, email: requester.email, name: requester.name },
      title: "Live fix session queued",
      message: `Session ${session.sessionCode} is in the queue.`,
      type: "SUCCESS",
      referenceId: session.id,
      actionPath: `/support/live/${session.id}`,
      actionLabel: "Open session",
      emailTemplate: "live-fix",
      emailData: {
        title: "You're in the queue",
        subtitle: "A support agent will join shortly",
        body: "Keep this tab open. We'll email you when an agent connects.",
        badge: { label: session.sessionCode, tone: "info" },
        actionLabel: "Open live session",
      },
    });
  }
}

export async function onLiveFixSessionStarted(session: LiveFixSession) {
  if (!session.organizationId) return;
  await notifyOrganization(session.organizationId, {
    title: `Live fix started — ${session.sessionCode}`,
    message: "A support agent has joined your session.",
    type: "SUCCESS",
    referenceId: session.id,
    actionPath: `/support/live/${session.id}`,
    actionLabel: "Join session",
    emailTemplate: "live-fix",
    emailData: {
      title: "Agent connected",
      subtitle: `Session ${session.sessionCode}`,
      body: "Your live support session is active. Click below to join.",
      badge: { label: "Live now", tone: "success" },
      actionLabel: "Join now",
    },
  });
}

export async function onLiveFixSessionEnded(session: LiveFixSession) {
  if (!session.organizationId) return;
  await notifyOrganization(session.organizationId, {
    title: `Live fix ended — ${session.sessionCode}`,
    message: "Your live support session has ended.",
    type: "INFO",
    referenceId: session.id,
    actionPath: "/support",
    actionLabel: "Support home",
    emailTemplate: "live-fix",
    emailData: {
      title: "Session ended",
      subtitle: session.sessionCode,
      body: "Thanks for using live support. Open a ticket if you need more help.",
      badge: { label: "Completed", tone: "neutral" },
      actionLabel: "Back to support",
    },
  });
}

export async function onLiveFixChatMessage(
  session: LiveFixSession,
  message: LiveFixChatMessage,
  sender?: { userId?: string; email?: string },
) {
  if (message.author === "admin") {
    if (!session.organizationId) return;
    await notifyOrganization(session.organizationId, {
      title: `Message from support — ${session.sessionCode}`,
      message: message.content,
      type: "MESSAGE",
      referenceId: session.id,
      actionPath: `/support/live/${session.id}`,
      actionLabel: "Open chat",
      emailTemplate: "support-reply",
      emailData: {
        title: "New message from support",
        subtitle: session.sessionCode,
        quote: message.content,
        quoteAuthor: message.authorName,
        actionLabel: "Reply in chat",
      },
      adminsOnly: false,
    });
    return;
  }

  await notifyPlatformTeam({
    title: `Live fix message — ${session.sessionCode}`,
    message: message.content,
    type: "MESSAGE",
    referenceId: session.id,
    actionPath: `/admin/support/live-fix/${session.id}`,
    actionLabel: "Open session",
    emailTemplate: "support-reply",
    emailData: {
      title: "Customer message",
      subtitle: `${session.organizationName} · ${session.sessionCode}`,
      quote: message.content,
      quoteAuthor: message.authorName,
      actionLabel: "Open live fix",
    },
  });
}

export async function onOrganizationCreated(input: {
  organizationId: string;
  organizationName: string;
  createdByUserId?: string;
}) {
  await notifyPlatformTeam({
    title: `New tenant company: ${input.organizationName}`,
    message: "A new organization was added to the platform.",
    type: "INFO",
    referenceId: input.organizationId,
    actionPath: `/admin/companies/${input.organizationId}`,
    actionLabel: "View company",
    emailTemplate: "organization",
    emailData: {
      title: "New tenant company",
      subtitle: input.organizationName,
      body: "Review billing plan, modules, and onboarding status.",
      badge: { label: "New company", tone: "success" },
      details: [{ label: "Organization", value: input.organizationName, highlight: true }],
      actionLabel: "Open company",
    },
  });

  if (input.createdByUserId) {
    const contact = await getEmployeeContact(input.createdByUserId);
    if (contact) {
      await notifyRecipient({
        recipient: contact,
        title: `Company created: ${input.organizationName}`,
        message: "The tenant organization is ready for configuration.",
        type: "SUCCESS",
        referenceId: input.organizationId,
        actionPath: `/admin/companies/${input.organizationId}`,
        emailTemplate: "organization",
        emailData: {
          title: "Company created successfully",
          subtitle: input.organizationName,
          badge: { label: "Ready", tone: "success" },
          actionLabel: "Configure company",
        },
      });
    }
  }
}

export async function onPaymentSuccess(input: {
  userId: string;
  email: string;
  name?: string;
  amount: string;
  date: string;
  method: string;
  confirmationId: string;
  organizationName?: string;
  actionPath?: string;
}) {
  await notifyRecipient({
    recipient: { userId: input.userId, email: input.email, name: input.name },
    title: "Payment successful",
    message: `Your payment of ${input.amount} was processed.`,
    type: "SUCCESS",
    actionPath: input.actionPath ?? "/admin/billing/invoices",
    emailSubject: `Payment received — ${input.amount}`,
    emailTemplate: "payment-success",
    emailData: {
      title: "Payment successful",
      subtitle: input.organizationName
        ? `Thank you for your payment on behalf of ${input.organizationName}.`
        : "Thank you for your payment.",
      body: `We received ${input.amount} on ${input.date}.`,
      heroIcon: "payment",
      details: [
        { label: "Amount", value: input.amount, highlight: true },
        { label: "Date", value: input.date },
        { label: "Method", value: input.method },
        { label: "Confirmation", value: input.confirmationId },
      ],
      promoText: `Manage billing anytime in ${EMAIL_BRAND.name}`,
      actionLabel: "View transactions",
    },
  });
}

export async function onInvoiceSent(input: {
  userId?: string;
  email: string;
  name?: string;
  invoiceNumber: string;
  customerName: string;
  dueDate: string;
  lineItems: { name: string; quantity: string; amount: string }[];
  subtotal: string;
  tax?: string;
  total: string;
  actionPath: string;
}) {
  await notifyRecipient({
    recipient: { userId: input.userId, email: input.email, name: input.name },
    title: `Invoice ${input.invoiceNumber}`,
    message: `Invoice for ${input.customerName} is ready.`,
    type: "INFO",
    actionPath: input.actionPath,
    emailSubject: `Invoice ${input.invoiceNumber} from ${EMAIL_BRAND.name}`,
    emailTemplate: "invoice",
    emailData: {
      title: `Invoice ${input.invoiceNumber}`,
      subtitle: `Due ${input.dueDate}`,
      body: `Hello ${input.customerName}, please find your invoice details below.`,
      lineItems: input.lineItems,
      subtotal: input.subtotal,
      tax: input.tax,
      total: input.total,
      actionLabel: "View invoice",
      secondaryActionLabel: "Pay now",
    },
  });
}

export async function onApprovalRequested(input: {
  approverUserId: string;
  approverEmail: string;
  approverName?: string;
  requestTitle: string;
  requesterName: string;
  dueDate?: string;
  actionPath: string;
  referenceId: string;
}) {
  await notifyRecipient({
    recipient: {
      userId: input.approverUserId,
      email: input.approverEmail,
      name: input.approverName,
    },
    title: `Approval required: ${input.requestTitle}`,
    message: `${input.requesterName} submitted a request for your approval.`,
    type: "WARNING",
    referenceId: input.referenceId,
    actionPath: input.actionPath,
    emailTemplate: "approval",
    emailData: {
      title: "Approval required",
      subtitle: input.requestTitle,
      body: `${input.requesterName} is waiting for your decision.`,
      badge: { label: "Pending", tone: "warning" },
      details: [
        { label: "Request", value: input.requestTitle, highlight: true },
        { label: "Submitted by", value: input.requesterName },
        ...(input.dueDate ? [{ label: "Due date", value: input.dueDate }] : []),
      ],
      actionLabel: "Review request",
    },
  });
}

export async function onSecurityAlert(input: {
  userId: string;
  email: string;
  name?: string;
  title: string;
  message: string;
  details?: { label: string; value: string }[];
  actionPath?: string;
}) {
  await notifyRecipient({
    recipient: { userId: input.userId, email: input.email, name: input.name },
    title: input.title,
    message: input.message,
    type: "ERROR",
    actionPath: input.actionPath ?? "/settings/preferences/security",
    emailTemplate: "security",
    emailData: {
      title: input.title,
      body: input.message,
      badge: { label: "Security alert", tone: "danger" },
      details: input.details,
      actionLabel: "Review security settings",
    },
  });
}

async function getOrganizationContactsForTicket(
  ticket: SupportTicket,
  creatorEmail?: string | null,
) {
  const orgContacts = await getOrganizationContacts(ticket.organizationId);

  if (creatorEmail) {
    const exists = orgContacts.some((c) => c.email.toLowerCase() === creatorEmail.toLowerCase());
    if (!exists) {
      orgContacts.unshift({ email: creatorEmail });
    }
  }

  return orgContacts;
}
