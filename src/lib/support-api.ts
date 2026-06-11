import { ensureSupportBootstrap } from "@/src/lib/support-bootstrap";

/** Ensure demo support data is mapped to real Prisma org IDs before handling requests. */
export async function prepareSupportData() {
  await ensureSupportBootstrap();
}
