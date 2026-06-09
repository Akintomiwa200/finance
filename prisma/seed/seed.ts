import { PrismaClient, TransactionType, TransactionStatus } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  const org = await db.organization.findFirst();
  if (!org) {
    console.log("No organization found. Register an org first.");
    return;
  }

  console.log(`Seeding transactions for organization: ${org.name} (${org.id})`);

  const existingCount = await db.transaction.count({ where: { organizationId: org.id } });
  if (existingCount > 0) {
    console.log(`Already have ${existingCount} transactions. Skipping seed.`);
    return;
  }

  type TxInput = {
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    status: TransactionStatus;
    date: Date;
    account?: string;
    merchant?: string;
    reference?: string;
  };

  const raw: TxInput[] = [
    { title: "Grocery Store", amount: -86.5, type: TransactionType.EXPENSE, category: "Food", status: TransactionStatus.COMPLETED, date: new Date("2026-06-09T14:30:00"), account: "Checking" },
    { title: "Freelance Payment", amount: 1200, type: TransactionType.INCOME, category: "Income", status: TransactionStatus.COMPLETED, date: new Date("2026-06-09T11:00:00"), account: "Checking" },
    { title: "Electric Bill", amount: -145, type: TransactionType.EXPENSE, category: "Utilities", status: TransactionStatus.PENDING, date: new Date("2026-06-08T00:00:00"), account: "Checking" },
    { title: "Transfer to Savings", amount: -500, type: TransactionType.TRANSFER, category: "Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-06-07T00:00:00"), account: "Savings", merchant: "Savings Account" },
    { title: "Salary Deposit", amount: 8500, type: TransactionType.INCOME, category: "Salary", status: TransactionStatus.COMPLETED, date: new Date("2026-06-01T00:00:00"), account: "Checking", reference: "SAL-2026-06" },
    { title: "Netflix Subscription", amount: -15.99, type: TransactionType.EXPENSE, category: "Entertainment", status: TransactionStatus.COMPLETED, date: new Date("2026-06-05T00:00:00"), account: "Credit Card" },
    { title: "Uber Rides", amount: -32.5, type: TransactionType.EXPENSE, category: "Transport", status: TransactionStatus.COMPLETED, date: new Date("2026-06-04T00:00:00"), account: "Credit Card" },
    { title: "Amazon Order", amount: -89.99, type: TransactionType.EXPENSE, category: "Shopping", status: TransactionStatus.COMPLETED, date: new Date("2026-06-03T00:00:00"), account: "Credit Card" },
    { title: "Rent Payment", amount: -1800, type: TransactionType.EXPENSE, category: "Housing", status: TransactionStatus.COMPLETED, date: new Date("2026-06-01T00:00:00"), account: "Checking", reference: "RENT-JUN" },
    { title: "Dividend Payout", amount: 340, type: TransactionType.INCOME, category: "Investment", status: TransactionStatus.COMPLETED, date: new Date("2026-06-02T00:00:00"), account: "Investment" },
    { title: "Phone Bill", amount: -85, type: TransactionType.EXPENSE, category: "Utilities", status: TransactionStatus.COMPLETED, date: new Date("2026-06-06T00:00:00"), account: "Checking", merchant: "Verizon" },
    { title: "Client Payment", amount: 3200, type: TransactionType.INCOME, category: "Income", status: TransactionStatus.COMPLETED, date: new Date("2026-06-08T00:00:00"), account: "Checking", reference: "INV-2026-042" },
    { title: "Gas Station", amount: -48, type: TransactionType.EXPENSE, category: "Transport", status: TransactionStatus.COMPLETED, date: new Date("2026-06-07T00:00:00"), account: "Credit Card" },
    { title: "Dinner at Italian Place", amount: -67.8, type: TransactionType.EXPENSE, category: "Food", status: TransactionStatus.COMPLETED, date: new Date("2026-06-06T00:00:00"), account: "Checking" },
    { title: "Gym Membership", amount: -49.99, type: TransactionType.EXPENSE, category: "Health", status: TransactionStatus.COMPLETED, date: new Date("2026-06-02T00:00:00"), account: "Checking", merchant: "FitLife Gym" },
    { title: "Freelance Project", amount: 2400, type: TransactionType.INCOME, category: "Income", status: TransactionStatus.COMPLETED, date: new Date("2026-05-28T00:00:00"), account: "Checking", reference: "PROJ-2026-05" },
    { title: "Internet Bill", amount: -79.99, type: TransactionType.EXPENSE, category: "Utilities", status: TransactionStatus.COMPLETED, date: new Date("2026-05-25T00:00:00"), account: "Checking", merchant: "Comcast" },
    { title: "Transfer to Investment", amount: -1000, type: TransactionType.TRANSFER, category: "Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-05-20T00:00:00"), account: "Investment", merchant: "Vanguard" },
    { title: "Coffee Shop", amount: -5.5, type: TransactionType.EXPENSE, category: "Food", status: TransactionStatus.COMPLETED, date: new Date("2026-05-22T00:00:00"), account: "Checking" },
    { title: "Refund from Store", amount: 45, type: TransactionType.INCOME, category: "Refund", status: TransactionStatus.COMPLETED, date: new Date("2026-05-21T00:00:00"), account: "Credit Card" },
    { title: "SWIFT Transfer — Alibaba", amount: -12500, type: TransactionType.INTERNATIONAL_TRANSFER, category: "International Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-05-15T00:00:00"), account: "USD Business", reference: "SWIFT-ICBCSH-20260515", merchant: "Alibaba Group" },
    { title: "SWIFT — AWS Services", amount: -4230, type: TransactionType.INTERNATIONAL_TRANSFER, category: "International Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-05-10T00:00:00"), account: "USD Business", reference: "SWIFT-BOFAUS-20260510", merchant: "Amazon Web Services" },
    { title: "SWIFT — Shopify Revenue", amount: 8900, type: TransactionType.INTERNATIONAL_TRANSFER, category: "International Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-05-08T00:00:00"), account: "CAD Business", reference: "SWIFT-ROYCCAT-20260508", merchant: "Shopify Inc." },
    { title: "SWIFT — Western Union", amount: -3200, type: TransactionType.INTERNATIONAL_TRANSFER, category: "International Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-04-28T00:00:00"), account: "EUR Business", reference: "SWIFT-WUIBE2-20260428", merchant: "Western Union" },
    { title: "Local Transfer to Damilola Ogunlesi", amount: -25000, type: TransactionType.TRANSFER, category: "Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-05-12T00:00:00"), account: "Checking", reference: "NIBSS-1234567890", merchant: "Damilola Ogunlesi" },
    { title: "Local Transfer to Chioma Ezekwe", amount: -15000, type: TransactionType.TRANSFER, category: "Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-05-05T00:00:00"), account: "Checking", reference: "NIBSS-9876543210", merchant: "Chioma Ezekwe" },
    { title: "International Transfer to James Mitchell", amount: -780000, type: TransactionType.INTERNATIONAL_TRANSFER, category: "International Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-04-20T00:00:00"), account: "GBP Business", reference: "SWIFT-BARCGB22-20260420", merchant: "James Mitchell" },
    { title: "International Transfer to Li Wei", amount: -450000, type: TransactionType.INTERNATIONAL_TRANSFER, category: "International Transfer", status: TransactionStatus.COMPLETED, date: new Date("2026-04-15T00:00:00"), account: "USD Business", reference: "SWIFT-ICBKCNBJ-20260415", merchant: "Li Wei" },
    { title: "Car Insurance", amount: -320, type: TransactionType.EXPENSE, category: "Transport", status: TransactionStatus.COMPLETED, date: new Date("2026-05-18T00:00:00"), account: "Checking" },
    { title: "Freelance Bonus", amount: 500, type: TransactionType.INCOME, category: "Income", status: TransactionStatus.COMPLETED, date: new Date("2026-05-30T00:00:00"), account: "Checking", reference: "BONUS-MAY" },
  ];

  for (const t of raw) {
    await db.transaction.create({
      data: {
        ...t,
        organizationId: org.id,
      },
    });
  }

  console.log(`Seeded ${raw.length} transactions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
