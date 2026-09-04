import React from "react";

import { cn } from "../../utils/cn";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
  ({ className, title, subtitle, centered = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-8 flex flex-col gap-2", centered && "items-center text-center", className)}
        {...props}
      >
        <h2 className="text-h2 text-foreground">{title}</h2>
        {subtitle && <p className="text-body-large max-w-[42rem]">{subtitle}</p>}
      </div>
    );
  }
);
SectionHeading.displayName = "SectionHeading";
