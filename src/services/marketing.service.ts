import { db } from "@/src/lib/db";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";

const PUBLISHED = "PUBLISHED" as const;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function isMarketingSeeded() {
  const count = await db.marketingBlogPost.count();
  return count > 0;
}

export async function ensureMarketingSeed() {
  if (await isMarketingSeeded()) return;

  const blogPosts = [
    {
      slug: "cash-flow-metrics-smb",
      title: "5 Cash Flow Metrics Every SMB Should Track",
      category: "Finance Tips",
      excerpt:
        "Learn the key indicators that help growing businesses stay liquid and make smarter spending decisions.",
      content:
        "Cash flow is the lifeblood of any small or medium business. Tracking the right metrics early helps you avoid surprises and plan growth with confidence.\n\n**Operating cash flow** shows whether core business activities generate enough cash. **Free cash flow** reveals what remains after capital expenses. **Cash conversion cycle** measures how quickly you turn investments into cash.\n\nAudpay dashboards surface these metrics automatically from your ledger, bank feeds, and invoices — so your team spends less time in spreadsheets and more time acting on insights.",
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=420&fit=crop&q=80",
      publishedAt: new Date("2026-03-12"),
    },
    {
      slug: "close-books-faster",
      title: "How to Close Your Books Faster Each Month",
      category: "Accounting",
      excerpt:
        "A practical checklist for finance teams who want cleaner month-end closes without adding headcount.",
      content:
        "Month-end close does not have to take weeks. Start by reconciling bank accounts daily, automating recurring journal entries, and locking periods once approved.\n\nUse a single source of truth for expenses, invoices, and payroll. Audpay ties every transaction to your chart of accounts and flags unmatched items before close day.\n\nTeams that follow this workflow typically cut close time by 40% within the first quarter.",
      imageUrl:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=640&h=420&fit=crop&q=80",
      publishedAt: new Date("2026-02-28"),
    },
    {
      slug: "real-time-bank-reconciliation",
      title: "Introducing Real-Time Bank Reconciliation",
      category: "Product",
      excerpt:
        "Audpay now matches transactions automatically so your team spends less time on manual reconciliation.",
      content:
        "Manual reconciliation slows finance teams down and introduces errors. Our new real-time matching engine compares bank feed transactions against invoices, bills, and journal entries using configurable rules.\n\nYou can review suggestions in a dedicated reconciliation dashboard, approve matches in bulk, and drill into exceptions instantly.\n\nThis feature is available on Professional and Enterprise plans starting today.",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=420&fit=crop&q=80",
      publishedAt: new Date("2026-02-14"),
    },
  ];

  const jobs = [
    {
      slug: "product-designer",
      title: "Product Designer",
      type: "Full Time",
      location: "San Francisco, CA",
      description:
        "Design intuitive financial workflows for accounting teams. You will own end-to-end product design from research to high-fidelity prototypes.",
      requirements:
        "5+ years product design experience\nPortfolio demonstrating complex B2B SaaS work\nExperience with design systems\nStrong collaboration with engineering",
    },
    {
      slug: "full-stack-engineer",
      title: "Full Stack Engineer",
      type: "Full Time",
      location: "Remote",
      description:
        "Build scalable features across our Next.js frontend and PostgreSQL-backed API. You'll work on ledger, reporting, and integrations.",
      requirements:
        "3+ years TypeScript experience\nComfort with React and Node.js\nExperience with PostgreSQL\nInterest in fintech domain",
    },
    {
      slug: "customer-success-manager",
      title: "Customer Success Manager",
      type: "Part Time",
      location: "Ontario, Canada",
      description:
        "Help customers onboard successfully and achieve value from Audpay. You will run trainings, QBRs, and expansion conversations.",
      requirements:
        "2+ years customer success in SaaS\nStrong communication skills\nAccounting knowledge a plus\nCRM experience preferred",
    },
  ];

  const changelog = [
    {
      version: "v2.8.0",
      title: "Real-time bank reconciliation",
      items: [
        "Automatic transaction matching with smart rules",
        "Improved bank feed reliability and error handling",
        "New reconciliation dashboard for finance teams",
      ],
      publishedAt: new Date("2026-03-10"),
    },
    {
      version: "v2.7.2",
      title: "Reporting improvements",
      items: [
        "Export P&L and balance sheet to Excel and PDF",
        "Custom date ranges saved per report",
        "Faster load times on large datasets",
      ],
      publishedAt: new Date("2026-02-22"),
    },
  ];

  const integrations = [
    {
      slug: "quickbooks",
      name: "QuickBooks",
      category: "Accounting",
      description:
        "Sync invoices, expenses, and chart of accounts in both directions.",
      content:
        "Connect QuickBooks Online to Audpay in minutes. Map accounts, sync customers and vendors, and keep both systems aligned with scheduled or real-time sync.",
    },
    {
      slug: "stripe",
      name: "Stripe",
      category: "Payments",
      description:
        "Reconcile online payments automatically with your ledger entries.",
      content:
        "Import Stripe charges, refunds, and payouts directly into Audpay. Match payments to invoices and post journal entries automatically.",
    },
    {
      slug: "plaid",
      name: "Plaid",
      category: "Banking",
      description:
        "Connect bank accounts securely for real-time transaction feeds.",
      content:
        "Link business bank accounts through Plaid for secure, read-only transaction feeds that power reconciliation and cash reporting.",
    },
    {
      slug: "slack",
      name: "Slack",
      category: "Collaboration",
      description:
        "Get alerts for approvals, overdue invoices, and budget thresholds.",
      content:
        "Send approval requests, payment reminders, and budget alerts to Slack channels your finance team already uses.",
    },
  ];

  await db.marketingBlogPost.createMany({
    data: blogPosts.map((post) => ({ ...post, status: PUBLISHED })),
  });
  await db.marketingJobListing.createMany({
    data: jobs.map((job) => ({ ...job, status: PUBLISHED })),
  });
  await db.marketingChangelogEntry.createMany({
    data: changelog.map((entry) => ({ ...entry, status: PUBLISHED })),
  });
  await db.marketingIntegration.createMany({
    data: integrations.map((item) => ({ ...item, status: PUBLISHED })),
  });

  pushRealtimeEvent({
    event: "create",
    entity: "marketing_seed",
    data: { seeded: true },
  });
}

export async function listBlogPosts() {
  await ensureMarketingSeed();
  return db.marketingBlogPost.findMany({
    where: { status: PUBLISHED },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  await ensureMarketingSeed();
  return db.marketingBlogPost.findFirst({
    where: { slug, status: PUBLISHED },
  });
}

export async function listJobListings() {
  await ensureMarketingSeed();
  return db.marketingJobListing.findMany({
    where: { status: PUBLISHED },
    orderBy: { createdAt: "desc" },
  });
}

export async function getJobListingBySlug(slug: string) {
  await ensureMarketingSeed();
  return db.marketingJobListing.findFirst({
    where: { slug, status: PUBLISHED },
  });
}

export async function submitJobApplication(input: {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  coverLetter: string;
  resumeUrl?: string;
}) {
  const job = await db.marketingJobListing.findUnique({
    where: { id: input.jobId },
  });
  if (!job || job.status !== PUBLISHED) {
    throw new Error("Job not found");
  }

  const application = await db.marketingJobApplication.create({
    data: input,
  });

  pushRealtimeEvent({
    event: "create",
    entity: "marketing_job_application",
    data: application,
  });

  return application;
}

export async function listChangelogEntries() {
  await ensureMarketingSeed();
  return db.marketingChangelogEntry.findMany({
    where: { status: PUBLISHED },
    orderBy: { publishedAt: "desc" },
  });
}

export async function listIntegrations() {
  await ensureMarketingSeed();
  return db.marketingIntegration.findMany({
    where: { status: PUBLISHED },
    orderBy: { name: "asc" },
  });
}

export async function getIntegrationBySlug(slug: string) {
  await ensureMarketingSeed();
  return db.marketingIntegration.findFirst({
    where: { slug, status: PUBLISHED },
  });
}

export async function submitContactForm(input: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  const submission = await db.marketingContactSubmission.create({
    data: input,
  });

  pushRealtimeEvent({
    event: "create",
    entity: "marketing_contact",
    data: submission,
  });

  return submission;
}

export async function subscribeNewsletter(email: string) {
  const subscriber = await db.marketingNewsletterSubscriber.upsert({
    where: { email },
    create: { email, status: "ACTIVE" },
    update: { status: "ACTIVE" },
  });

  pushRealtimeEvent({
    event: "create",
    entity: "marketing_newsletter",
    data: subscriber,
  });

  return subscriber;
}

export async function getMarketingAdminSummary() {
  await ensureMarketingSeed();
  const [
    blogCount,
    jobCount,
    applicationCount,
    contactCount,
    subscriberCount,
    changelogCount,
    integrationCount,
  ] = await Promise.all([
    db.marketingBlogPost.count(),
    db.marketingJobListing.count({ where: { status: PUBLISHED } }),
    db.marketingJobApplication.count(),
    db.marketingContactSubmission.count(),
    db.marketingNewsletterSubscriber.count(),
    db.marketingChangelogEntry.count(),
    db.marketingIntegration.count(),
  ]);

  return {
    blogCount,
    jobCount,
    applicationCount,
    contactCount,
    subscriberCount,
    changelogCount,
    integrationCount,
  };
}

export async function listJobApplications() {
  return db.marketingJobApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { job: { select: { title: true, slug: true } } },
  });
}

export async function listContactSubmissions() {
  return db.marketingContactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
}
