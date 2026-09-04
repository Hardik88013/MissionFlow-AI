import React from "react";

import { cn } from "../../utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-surface text-foreground shadow-sm",
          elevated && "bg-surface-elevated shadow-md",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
