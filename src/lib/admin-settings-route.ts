import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";

export async function settingsGetHandler<T>(getter: () => T) {
  const { error } = await requireSuperAdmin();
  if (error) return error;
  return NextResponse.json(getter());
}

export async function settingsPatchHandler<T extends object>(
  req: Request,
  updater: (patch: Partial<T>) => T,
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;
  const body = (await req.json()) as Partial<T>;
  return NextResponse.json(updater(body));
}
