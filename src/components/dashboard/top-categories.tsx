"use client";

import { Progress } from "@/components/ui/progress";

const categories = [
  { name: "Shopping", amount: "$4,800", percentage: 35, color: "bg-violet-500" },
  { name: "Food & Dining", amount: "$3,200", percentage: 24, color: "bg-blue-500" },
  { name: "Bills & Utilities", amount: "$2,800", percentage: 21, color: "bg-amber-500" },
  { name: "Entertainment", amount: "$1,600", percentage: 12, color: "bg-emerald-500" },
  { name: "Transport", amount: "$1,100", percentage: 8, color: "bg-rose-500" },
];

export function TopCategories() {
  return (
    <div className="space-y-4">
      {categories.map((category, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{category.name}</span>
            <span className="text-muted-foreground">{category.amount}</span>
          </div>
          <Progress
            value={category.percentage}
            className="h-2"
            indicatorClassName={category.color}
          />
        </div>
      ))}
    </div>
  );
}
