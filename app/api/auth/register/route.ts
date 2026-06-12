import { NextResponse } from "next/server";
import { registerUser } from "@/src/services/auth.service";
import { onUserRegistered } from "@/src/services/notification-events.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerUser(body);

    void onUserRegistered({
      userId: user.id,
      email: user.email,
      name: user.name,
      organizationName: body.organizationName,
    }).catch((err) => console.error("[notify] welcome email", err));

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
