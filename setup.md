# Finance as a Service (FaaS) — Full-Stack Next.js Platform

## Overview

A complete **Finance as a Service** platform covering every role and department involved in company finance, from budgeting & procurement through to employee salary payment. Built on Next.js 16 App Router as a full-stack application with PostgreSQL (via Prisma ORM), Tailwind CSS v4, and TypeScript.

## Features by Role & Department

| Role / Department        | Responsibilities                                              |
| ------------------------ | ------------------------------------------------------------- |
| **Finance Admin**        | Full system access, configuration, audit logs                 |
| **Finance Manager**      | Approvals, budget oversight, financial reporting              |
| **Accountant (AP)**      | Accounts Payable — vendor invoices, payment runs              |
| **Accountant (AR)**      | Accounts Receivable — customer invoices, collections          |
| **Payroll Officer**      | Salary computation, deductions, payslip generation            |
| **Budget Analyst**       | Budget creation, forecasting, variance analysis               |
| **Department Head**      | Department budget requests, expense approvals                 |
| **Employee**             | Submit expenses, view payslips, access self-service portal    |
| **Auditor**              | Read-only access to all financial records                     |
| **Tax Specialist**       | Tax computations, filings, reports                            |

## Salary Payment Flow

```
Employee submits timesheet / attendance
        │
        ▼
Department Head approves timesheet
        │
        ▼
Payroll Officer computes salary (base + allowances - deductions - tax)
        │
        ▼
Finance Manager approves payroll run
        │
        ▼
Finance Admin releases payment (bank file / API)
        │
        ▼
Payment gateway processes → Employee receives salary
        │
        ▼
Payslip generated & sent to employee portal / email
        │
        ▼
Accountant reconciles payroll journal entries
```

---

## Packages & Libraries

### Core Framework

```bash
pnpm add next react react-dom
pnpm add -D typescript @types/node @types/react @types/react-dom
```

### Database & ORM

```bash
pnpm add @prisma/client
pnpm add -D prisma
pnpm add @neondatabase/serverless        # PostgreSQL (serverless, free tier)
# or
pnpm add pg                              # PostgreSQL (traditional)
pnpm add -D @types/pg
```

### Authentication & Authorization

```bash
pnpm add next-auth@beta                  # NextAuth v5 (Auth.js)
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

### UI & Styling

```bash
pnpm add tailwindcss @tailwindcss/postcss postcss   # Already included
pnpm add class-variance-authority                   # CVA for component variants
pnpm add clsx tailwind-merge                        # Class merging utilities
pnpm add lucide-react                               # Icons
pnpm add @radix-ui/react-dialog                     # Modal
pnpm add @radix-ui/react-dropdown-menu              # Dropdown
pnpm add @radix-ui/react-select                     # Select
pnpm add @radix-ui/react-tabs                       # Tabs
pnpm add @radix-ui/react-tooltip                    # Tooltip
pnpm add @radix-ui/react-popover                    # Popover
pnpm add @radix-ui/react-checkbox                   # Checkbox
pnpm add @radix-ui/react-radio-group                # Radio group
pnpm add @radix-ui/react-switch                     # Toggle switch
pnpm add @radix-ui/react-separator                  # Separator
pnpm add @radix-ui/react-slot                       # Slot (as-child)
pnpm add @radix-ui/react-toast                      # Toast notifications
```

### Forms & Validation

```bash
pnpm add react-hook-form @hookform/resolvers
pnpm add zod                                        # Schema validation
pnpm add date-fns                                   # Date manipulation
```

### Data Tables

```bash
pnpm add @tanstack/react-table                      # Headless table
```

### Charts & Visualization

```bash
pnpm add recharts                                   # React charting library
```

### PDF & Document Generation

```bash
pnpm add @react-pdf/renderer                        # PDF generation (payslips, invoices)
# or
pnpm add puppeteer                                  # Server-side PDF (if needed)
```

### File Upload

```bash
pnpm add uploadthing                                # File upload (free tier available)
# or
pnpm add formidable
pnpm add -D @types/formidable
```

### Email & Notifications

```bash
pnpm add resend                                     # Email service (free tier: 100/day)
pnpm add @react-email/components                    # Email templates
```

### State Management

```bash
pnpm add zustand                                    # Lightweight state management
```

### Payment / Payroll Integration

```bash
pnpm add stripe                                     # Payment processing
# or                                                   (for salary disbursement)
pnpm add @paystack/inline-js                        # African market payment
```

### Utilities

```bash
pnpm add uuid                                       # Generate unique IDs
pnpm add -D @types/uuid
pnpm add nanoid                                     # Short ID generation
pnpm add slugify                                    # URL slugs
pnpm add exceljs                                    # Excel export (reports)
pnpm add csv-parse                                  # CSV import
pnpm add papaparse                                  # CSV parsing
```

### Dev Tools

```bash
pnpm add -D eslint prettier eslint-config-prettier
pnpm add -D husky lint-staged                       # Git hooks
pnpm add -D @typescript-eslint/eslint-plugin
pnpm add -D @typescript-eslint/parser
```

---

## Database Schema Overview

Tables (managed via Prisma):

```
organizations
├── departments
│   └── employees
│       ├── timesheets
│       ├── expense_reports
│       │   └── expense_items
│       ├── payslips
│       └── loan_repayments
├── payroll_runs
│   └── payroll_items
├── budget_categories
├── budgets
│   └── budget_line_items
├── vendor_invoices (AP)
├── customer_invoices (AR)
│   └── invoice_items
├── approval_requests
│   └── approval_steps
├── tax_configurations
├── audit_logs
├── notifications
└── roles & permissions
```

---

## Project Structure

```
finance/
├── app/                               # Next.js App Router (pages & API)
│   ├── (auth)/                        # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/                   # Dashboard route group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── employees/
│   │   │   └── page.tsx
│   │   ├── payroll/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── expenses/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── invoices/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── budget/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   ├── approvals/
│   │   │   └── page.tsx
│   │   ├── departments/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                           # API route handlers
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   ├── employees/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── payroll/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── expenses/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── invoices/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── budget/
│   │   │   └── route.ts
│   │   ├── reports/
│   │   │   └── route.ts
│   │   ├── departments/
│   │   │   └── route.ts
│   │   └── uploads/
│   │       └── route.ts
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Home / landing page
│   └── globals.css                    # Global styles
├── src/
│   ├── components/                    # Shared UI components
│   │   ├── ui/                        # Base UI primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── separator.tsx
│   │   ├── forms/                     # Form components
│   │   │   ├── login-form.tsx
│   │   │   ├── employee-form.tsx
│   │   │   ├── expense-form.tsx
│   │   │   ├── payroll-form.tsx
│   │   │   ├── invoice-form.tsx
│   │   │   └── budget-form.tsx
│   │   ├── layout/                    # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── main-layout.tsx
│   │   │   ├── auth-layout.tsx
│   │   │   └── app-shell.tsx
│   │   └── charts/                    # Chart components
│   │       ├── bar-chart.tsx
│   │       ├── line-chart.tsx
│   │       ├── pie-chart.tsx
│   │       └── financial-card.tsx
│   ├── lib/                           # Utility libraries
│   │   ├── utils.ts                   # General utilities (cn, formatCurrency, etc.)
│   │   ├── db.ts                      # Prisma client singleton
│   │   ├── auth.ts                    # Auth configuration (NextAuth)
│   │   └── validations/               # Zod schemas
│   │       ├── employee.ts
│   │       ├── payroll.ts
│   │       ├── expense.ts
│   │       ├── invoice.ts
│   │       └── budget.ts
│   ├── services/                      # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── employee.service.ts
│   │   ├── payroll.service.ts
│   │   ├── expense.service.ts
│   │   ├── invoice.service.ts
│   │   ├── budget.service.ts
│   │   ├── approval.service.ts
│   │   ├── report.service.ts
│   │   ├── notification.service.ts
│   │   ├── tax.service.ts
│   │   └── audit.service.ts
│   ├── types/                         # TypeScript type definitions
│   │   ├── index.ts                   # Re-exports
│   │   ├── employee.ts
│   │   ├── payroll.ts
│   │   ├── expense.ts
│   │   ├── invoice.ts
│   │   ├── budget.ts
│   │   ├── department.ts
│   │   ├── auth.ts
│   │   └── common.ts                  # Shared types (pagination, API response, etc.)
│   ├── store/                         # Zustand state stores
│   │   ├── auth-store.ts
│   │   ├── ui-store.ts
│   │   └── finance-store.ts
│   ├── hooks/                         # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-media-query.ts
│   │   ├── use-debounce.ts
│   │   └── use-pagination.ts
│   └── middleware.ts                  # Next.js middleware (auth guards)
├── prisma/
│   ├── schema.prisma                  # Database schema
│   ├── migrations/                    # Auto-generated migrations
│   └── seed.ts                        # Seed data
├── public/
│   ├── images/
│   └── icons/
├── emails/                            # React Email templates
│   ├── payslip-email.tsx
│   ├── invoice-email.tsx
│   └── approval-email.tsx
├── .env                               # Environment variables
├── .env.example                       # Example env template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

---

## Environment Variables

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"

# Auth (NextAuth)
AUTH_SECRET="your-secret-key-change-in-production"
AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"

# File Upload (UploadThing)
UPLOADTHING_SECRET="sk_xxxxx"
UPLOADTHING_APP_ID="app_xxxxx"

# Payment / Payroll (Stripe)
STRIPE_SECRET_KEY="sk_xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_xxxxx"
```

---

## Getting Started

```bash
# 1. Clone & install
git clone <repo> finance
cd finance
pnpm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your credentials

# 3. Set up database
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed

# 4. Run development server
pnpm dev
```

---

## License

Free & open source. All libraries listed above have free tiers / open-source licenses suitable for personal, educational, and commercial use.
