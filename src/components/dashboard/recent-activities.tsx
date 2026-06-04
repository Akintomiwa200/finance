"use client";

const activities = [
  {
    id: 1,
    action: "Payment received from",
    user: "John Doe",
    amount: "$1,200",
    time: "2 hours ago",
    icon: "💳",
  },
  {
    id: 2,
    action: "New subscription to",
    user: "Spotify Premium",
    amount: "$9.99",
    time: "5 hours ago",
    icon: "🎵",
  },
  {
    id: 3,
    action: "Transfer to",
    user: "Savings Account",
    amount: "$500",
    time: "1 day ago",
    icon: "🏦",
  },
  {
    id: 4,
    action: "Bill payment for",
    user: "Electricity",
    amount: "$85",
    time: "2 days ago",
    icon: "⚡",
  },
];

export function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-base shrink-0">
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              {activity.action}{" "}
              <span className="font-medium">{activity.user}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
          <span className="text-sm font-semibold whitespace-nowrap">
            {activity.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
