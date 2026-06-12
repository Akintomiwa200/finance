import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { settingsGetHandler, settingsPatchHandler } from "@/src/lib/admin-settings-route";
import {
  getIntegrationSettings,
  updateIntegrationSettings,
} from "@/src/services/platform-settings.service";

export async function GET() {
  return settingsGetHandler(getIntegrationSettings);
}

export async function PATCH(req: Request) {
  return settingsPatchHandler(req, updateIntegrationSettings);
}

export async function POST(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { service } = (await req.json()) as { service?: string };
  if (!service) {
    return NextResponse.json({ error: "Service name required" }, { status: 400 });
  }

  const settings = getIntegrationSettings();
  const enabled =
    (service === "Stripe" && settings.stripeEnabled) ||
    (service === "SendGrid" && settings.sendgridEnabled) ||
    (service === "Slack" && settings.slackEnabled) ||
    (service === "GitHub" && settings.githubEnabled) ||
    (service === "Jira" && settings.jiraEnabled);

  if (!enabled) {
    return NextResponse.json({ error: `${service} is not enabled` }, { status: 400 });
  }

  return NextResponse.json({ ok: true, service, message: "Connection verified" });
}
