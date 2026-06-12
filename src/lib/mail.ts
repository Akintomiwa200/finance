import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

let transporter: nodemailer.Transporter | null = null;

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST?.trim());
}

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host) {
    transporter = nodemailer.createTransport({ jsonTransport: true });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });

  return transporter;
}

export function getMailFrom(): string {
  return (
    process.env.MAIL_FROM?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "Uifry <noreply@localhost>"
  );
}

export function getAppUrl(): string {
  return (process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export async function sendMail(message: Mail.Options): Promise<void> {
  const transport = getTransporter();
  const from = message.from ?? getMailFrom();

  if (!isMailConfigured()) {
    console.info("[mail:dev]", {
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
    return;
  }

  await transport.sendMail({ ...message, from });
}
