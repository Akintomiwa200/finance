"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Shopping", value: 4800, color: "#8B5CF6" },
  { name: "Food & Dining", value: 3200, color: "#60A5FA" },
  { name: "Transport", value: 2400, color: "#F59E0B" },
  { name: "Entertainment", value: 1800, color: "#10B981" },
  { name: "Bills", value: 3500, color: "#EF4444" },
  { name: "Others", value: 2620, color: "#8B5CF6" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export function StatisticsPie() {
  return (
    <div className="space-y-4">
      <div className="relative flex justify-center">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `$${Number(value ?? 0).toLocaleString()}`,
                "",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xl font-bold">${(total / 1000).toFixed(1)}k</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-medium">${item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
