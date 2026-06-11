import { Badge } from "@/src/components/ui/badge";

type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "suspended"
  | "system"
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "draft"
  | "approved"
  | "rejected"
  | "healthy"
  | "warning"
  | "critical";

const statusMap: Record<StatusType, { variant: "success" | "warning" | "danger" | "info" | "default" | "secondary"; label: string }> = {
  active: { variant: "success", label: "Active" },
  inactive: { variant: "default", label: "Inactive" },
  pending: { variant: "warning", label: "Pending" },
  suspended: { variant: "danger", label: "Suspended" },
  system: { variant: "info", label: "System" },
  open: { variant: "info", label: "Open" },
  in_progress: { variant: "warning", label: "In Progress" },
  resolved: { variant: "success", label: "Resolved" },
  closed: { variant: "default", label: "Closed" },
  draft: { variant: "secondary", label: "Draft" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "danger", label: "Rejected" },
  healthy: { variant: "success", label: "Healthy" },
  warning: { variant: "warning", label: "Warning" },
  critical: { variant: "danger", label: "Critical" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_") as StatusType;
  const config = statusMap[normalized] ?? {
    variant: "default" as const,
    label: status,
  };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
