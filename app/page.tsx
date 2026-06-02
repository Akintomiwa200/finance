import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-32 px-8">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Finance <span className="text-brand-600">as a Service</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Enterprise-grade financial management platform covering budgeting,
            expenses, payroll, invoicing, and salary disbursement — across every
            role and department.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-600 px-6 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium hover:bg-muted transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 w-full max-w-3xl">
          {[
            { label: "Budget Mgmt", value: "Planning" },
            { label: "Expenses", value: "Tracking" },
            { label: "Payroll", value: "Automation" },
            { label: "Reports", value: "Analytics" },
          ].map((item) => (
            <div
              key={item.label}
              className="card text-center"
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {item.label}
              </div>
              <div className="text-lg font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
