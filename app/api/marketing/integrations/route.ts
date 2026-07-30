import { NextResponse } from "next/server";
import { listIntegrations } from "@/src/services/marketing.service";

export async function GET() {
  try {
    const integrations = await listIntegrations();
    return NextResponse.json({ success: true, data: integrations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load integrations";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
