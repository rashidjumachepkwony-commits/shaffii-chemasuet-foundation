import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", ...props }, ref) => {
    const variantClasses = {
      default: "bg-white border border-neutral-200",
      elevated: "bg-white shadow-lg border border-neutral-100",
      bordered: "bg-white border-2 border-neutral-200",
    };
    const paddingClasses = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };
    return (
      <div
        className={cn(
          "rounded-2xl transition-shadow",
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
