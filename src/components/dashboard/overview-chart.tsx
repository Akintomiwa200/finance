"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", income: 22000, expenses: 18000 },
  { month: "Feb", income: 24000, expenses: 19000 },
  { month: "Mar", income: 21000, expenses: 20000 },
  { month: "Apr", income: 26000, expenses: 21000 },
  { month: "May", income: 28000, expenses: 22000 },
  { month: "Jun", income: 25000, expenses: 19500 },
  { month: "Jul", income: 29000, expenses: 23000 },
  { month: "Aug", income: 31000, expenses: 24000 },
  { month: "Sep", income: 27500, expenses: 21500 },
  { month: "Oct", income: 30000, expenses: 23500 },
  { month: "Nov", income: 32000, expenses: 25000 },
  { month: "Dec", income: 35000, expenses: 27000 },
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, ""]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#colorIncome)"
          name="Income"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#colorExpenses)"
          name="Expenses"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
