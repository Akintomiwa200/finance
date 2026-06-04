"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const transactions = [
  {
    id: 1,
    name: "Netflix Subscription",
    date: "2024-01-15",
    amount: -15.99,
    category: "Entertainment",
    status: "completed",
  },
  {
    id: 2,
    name: "Salary Deposit",
    date: "2024-01-15",
    amount: 5200,
    category: "Income",
    status: "completed",
  },
  {
    id: 3,
    name: "Amazon Purchase",
    date: "2024-01-14",
    amount: -89.99,
    category: "Shopping",
    status: "pending",
  },
  {
    id: 4,
    name: "Uber Ride",
    date: "2024-01-14",
    amount: -24.5,
    category: "Transport",
    status: "completed",
  },
  {
    id: 5,
    name: "Restaurant Bill",
    date: "2024-01-13",
    amount: -45.0,
    category: "Food",
    status: "completed",
  },
];

export function TransactionsTable() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between py-3 border-b last:border-0"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs">
                {transaction.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{transaction.name}</p>
              <p className="text-xs text-muted-foreground">{transaction.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-semibold ${
                transaction.amount > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.amount > 0 ? "+" : ""}
              {transaction.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
            <Badge
              variant="outline"
              className={`text-xs ${
                transaction.status === "completed"
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {transaction.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
