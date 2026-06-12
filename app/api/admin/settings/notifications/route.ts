import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { settingsGetHandler, settingsPatchHandler } from "@/src/lib/admin-settings-route";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/src/services/platform-settings.service";
import { sendMail } from "@/src/lib/mail";

export async function GET() {
  return settingsGetHandler(getNotificationSettings);
}

export async function PATCH(req: Request) {
  return settingsPatchHandler(req, updateNotificationSettings);
}

export async function POST(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { to } = (await req.json()) as { to?: string };
  if (!to) {
    return NextResponse.json({ error: "Recipient email required" }, { status: 400 });
  }

  const settings = getNotificationSettings();
  await sendMail({
    to,
    subject: "Uifry platform — test email",
    html: `<p>SMTP settings are working. Sent from <strong>${settings.fromName}</strong>.</p>`,
    text: `SMTP settings are working. Sent from ${settings.fromName}.`,
  });

  return NextResponse.json({ ok: true });
}
