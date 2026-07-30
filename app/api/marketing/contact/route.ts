import { NextResponse } from "next/server";
import { submitContactForm } from "@/src/services/marketing.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const submission = await submitContactForm({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      message: body.message,
    });
    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit contact form";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
