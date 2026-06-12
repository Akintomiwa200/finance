import { sendMail } from "@/src/lib/mail";
import {
  renderEmailTemplate,
  type EmailTemplateData,
  type EmailTemplateKind,
} from "@/src/lib/email-templates";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  template: EmailTemplateKind;
  data: EmailTemplateData;
}

export interface LegacyEmailPayload {
  to: string | string[];
  subject: string;
  title: string;
  body: string;
  actionLabel?: string;
  actionUrl?: string;
  preheader?: string;
  recipientName?: string;
}

export async function sendTemplatedEmail(input: SendEmailInput): Promise<void> {
  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  const unique = [...new Set(recipients.map((e) => e.trim().toLowerCase()).filter(Boolean))];
  if (unique.length === 0) return;

  for (const email of unique) {
    const rendered = renderEmailTemplate(input.template, input.subject, input.data, email);
    await sendMail({
      to: email,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
    });
  }
}

/** @deprecated Use sendTemplatedEmail */
export async function sendTransactionalEmail(payload: LegacyEmailPayload): Promise<void> {
  await sendTemplatedEmail({
    to: payload.to,
    subject: payload.subject,
    template: "notification",
    data: {
      recipientName: payload.recipientName,
      preheader: payload.preheader,
      title: payload.title,
      body: payload.body,
      actionLabel: payload.actionLabel,
      actionUrl: payload.actionUrl,
    },
  });
}
