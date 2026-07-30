import { NextResponse } from "next/server";
import { subscribeNewsletter } from "@/src/services/marketing.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }
    const subscriber = await subscribeNewsletter(body.email.trim().toLowerCase());
    return NextResponse.json({ success: true, data: subscriber }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to subscribe";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
