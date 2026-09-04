import React from "react";

import { cn } from "../../utils/cn";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-panel rounded-lg text-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";
