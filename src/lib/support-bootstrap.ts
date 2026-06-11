import { db } from "@/src/lib/db";
import { remapOrganizationId } from "@/src/services/support.service";

const DEMO_ORGS = [
  { mockId: "org_1", name: "Acme Corp", slug: "acme-corp" },
  { mockId: "org_2", name: "Beta Corp", slug: "beta-corp" },
  { mockId: "org_3", name: "Gamma Ltd", slug: "gamma-ltd" },
] as const;

let bootstrapped = false;
let bootstrapPromise: Promise<void> | null = null;

export async function ensureSupportBootstrap(): Promise<void> {
  if (bootstrapped) return;
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    for (const demo of DEMO_ORGS) {
      let org = await db.organization.findFirst({
        where: {
          OR: [{ name: demo.name }, { slug: demo.slug }],
        },
      });

      if (!org && demo.mockId === "org_1") {
        org = await db.organization.findFirst({
          where: { name: { contains: "Acme", mode: "insensitive" } },
        });
      }

      if (!org && demo.mockId === "org_3") {
        org = await db.organization.create({
          data: {
            name: demo.name,
            slug: demo.slug,
            email: "support@gamma-ltd.example",
            isActive: true,
          },
        });
      }

      if (org) {
        remapOrganizationId(demo.mockId, org.id);
      }
    }

    bootstrapped = true;
  })();

  return bootstrapPromise;
}
