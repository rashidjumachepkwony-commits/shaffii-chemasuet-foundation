import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  cn(
    "w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm",
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-foundation-500 disabled:cursor-not-allowed disabled:opacity-60",
    "appearance-none"
  ),
  {
    variants: {
      variant: {
        default: "border-neutral-300",
        error: "border-red-500 focus-visible:ring-red-500",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <select
        className={cn(selectVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Select.displayName = "Select";

export { Select, selectVariants };
