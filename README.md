# Finance as a Service (FaaS)

Enterprise-grade financial management platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Prisma ORM**. Covers the full finance lifecycle — budgeting, expenses, procurement, invoicing, payroll, and salary disbursement — across every role and department in a company.

---

## Features

- **Role-based access** — Admin, Finance Manager, Accountant (AP/AR), Payroll Officer, Budget Analyst, Department Head, Employee, Auditor, Tax Specialist
- **Payroll management** — salary computation, PAYE tax, pension deductions, payslip generation
- **Expense tracking** — employee expense reports with multi-level approval
- **Invoicing** — customer invoices (AR) and vendor invoices (AP)
- **Budget planning** — fiscal year budgets with line-item tracking and variance analysis
- **Approval workflows** — configurable multi-step approval chains
- **Financial reports** — dashboard summaries, payroll trends, department expense analysis
- **Audit trail** — immutable log of all financial actions
- **Salary payment flow** — timesheet → approval → computation → payment → reconciliation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | NextAuth v5 (Auth.js) |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Charts | Recharts |
| Icons | Lucide React |
| UI | Radix UI primitives |
| Email | Resend |
| Payment | Stripe |

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** 9+
- **PostgreSQL** 14+ (or Neon serverless)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url> finance
cd finance

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# 4. Generate Prisma client and push schema
pnpm prisma generate
pnpm prisma db push

# 5. Seed the database with sample data
pnpm prisma db seed

# 6. Start the development server
pnpm dev
```

### Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@acmecorp.com | password123 |
| Finance Manager | manager@acmecorp.com | password123 |
| Payroll Officer | payroll@acmecorp.com | password123 |
| Employee | john@acmecorp.com | password123 |

---

## Project Structure

```
finance/
├── app/                    # App Router pages & API routes
│   ├── (auth)/             # Login & registration
│   ├── (dashboard)/        # Dashboard modules
│   └── api/                # REST API endpoints
├── src/
│   ├── components/         # UI, layout, chart components
│   ├── lib/                # Prisma client, auth config, utils, validations
│   ├── services/           # Business logic layer
│   ├── types/              # TypeScript definitions
│   ├── store/              # Zustand state stores
│   ├── hooks/              # Custom React hooks
│   └── middleware.ts       # Next.js auth middleware
├── prisma/
│   ├── schema.prisma       # Database schema (16 models)
│   └── seed.ts             # Seed script
├── public/
├── setup.md                # Detailed setup guide with all packages
└── ...
```

---

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | Authentication |
| `/api/auth/register` | POST | User registration |
| `/api/employees` | GET/POST | List / Create employees |
| `/api/employees/[id]` | GET/PATCH/DELETE | Employee CRUD |

---

## Salary Payment Flow

```
Employee submits timesheet
        │
        ▼
Department Head approves
        │
        ▼
Payroll Officer computes salary
        │
        ▼
Finance Manager approves payroll run
        │
        ▼
Finance Admin releases payment
        │
        ▼
Employee receives salary + payslip
        │
        ▼
Accountant reconciles journal entries
```

---

## License

[MIT](LICENSE)

---

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
