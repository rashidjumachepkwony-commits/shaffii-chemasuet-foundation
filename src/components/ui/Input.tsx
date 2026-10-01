import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  cn(
    "w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm",
    "transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-foundation-50 file:px-4 file:py-2 file:text-sm file:font-medium",
    "file:text-foundation-700 hover:file:bg-foundation-100",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-foundation-500 disabled:cursor-not-allowed disabled:opacity-60",
    "placeholder:text-neutral-400"
  ),
  {
    variants: {
      variant: {
        default: "border-neutral-300",
        error: "border-red-500 focus-visible:ring-red-500",
        success: "border-emerald-500 focus-visible:ring-emerald-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof inputVariants> {
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type = "text", icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
          <input
            type={type}
            className={cn(
              inputVariants({ variant, className }),
              "pl-10"
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
