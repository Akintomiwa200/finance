import { NextResponse } from "next/server";
import { getIntegrationBySlug } from "@/src/services/marketing.service";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const integration = await getIntegrationBySlug(slug);
    if (!integration) {
      return NextResponse.json({ success: false, error: "Integration not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: integration });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load integration";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
