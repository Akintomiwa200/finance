# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-02

### Added

- Next.js 16 App Router project with TypeScript and Tailwind CSS v4
- Database schema with 16 models (Organization, Department, Employee, PayrollRun, PayrollItem, ExpenseReport, ExpenseItem, CustomerInvoice, CustomerInvoiceItem, VendorInvoice, Budget, BudgetLineItem, EmployeeLoan, ApprovalRequest, ApprovalStep, TaxConfiguration, AuditLog, Notification)
- Prisma ORM with PostgreSQL support and seed script
- Authentication system with NextAuth v5 (credentials provider)
- Role-based access control (Admin, Finance Manager, Accountant, Payroll Officer, Budget Analyst, Department Head, Employee, Auditor, Tax Specialist)
- Dashboard with summary KPIs and recent transactions
- Employee management CRUD API and service layer
- Payroll management with tax computation and payslip generation
- Expense reporting with multi-stage approval workflow
- Customer and vendor invoice management
- Budget planning with line-item tracking and variance analysis
- Approval workflow engine with configurable steps
- Financial reporting service with dashboard summaries and payroll trends
- Audit logging for all financial actions
- Notification system for in-app alerts
- Tax configuration and computation (PAYE, pension, NHF)
- Reusable UI component library (Button, Input, Card, Badge, Select, Table, Dialog, Toast)
- Layout system with sidebar navigation and app shell
- Zustand state stores for auth, UI, and finance state
- Custom React hooks (useAuth, useMediaQuery, useDebounce, usePagination)
- Comprehensive global CSS with finance-specific design tokens and dark mode
- Setup guide (`setup.md`) with all packages and libraries
- Security policy, code of conduct, and contributing guidelines
