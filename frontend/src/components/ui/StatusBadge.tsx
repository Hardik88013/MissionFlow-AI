import React from "react";
import { cn } from "../../utils/cn";

export type StatusType = "success" | "warning" | "danger" | "info";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  label: string;
}

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, label, ...props }, ref) => {
    const statusStyles: Record<StatusType, string> = {
      success: "text-success bg-success/10 border-success/20",
      warning: "text-warning bg-warning/10 border-warning/20",
      danger: "text-danger bg-danger/10 border-danger/20",
      info: "text-info bg-info/10 border-info/20",
    };

    const dotStyles: Record<StatusType, string> = {
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-danger",
      info: "bg-info",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
          statusStyles[status],
          className
        )}
        {...props}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[status])} />
        {label}
      </div>
    );
  }
);
StatusBadge.displayName = "StatusBadge";
