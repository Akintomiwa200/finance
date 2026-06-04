"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const bills = [
  { name: "Rent", amount: "$1,500", due: "Jan 28", status: "upcoming" },
  { name: "Car Insurance", amount: "$180", due: "Feb 5", status: "upcoming" },
  { name: "Internet Bill", amount: "$60", due: "Jan 25", status: "due-soon" },
];

export function UpcomingBills() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bills.map((bill, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
            <div>
              <p className="text-sm font-medium">{bill.name}</p>
              <p className="text-xs text-muted-foreground">Due: {bill.due}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{bill.amount}</span>
              <Badge
                variant="outline"
                className={
                  bill.status === "due-soon"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }
              >
                {bill.status === "due-soon" ? "Due Soon" : "Upcoming"}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
