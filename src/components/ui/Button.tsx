import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center rounded-xl text-sm font-semibold",
    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-gold-500 text-neutral-900 shadow-md hover:bg-gold-400 hover:shadow-lg",
        secondary:
          "bg-foundation-700 text-white hover:bg-foundation-800 shadow-md hover:shadow-lg",
        outline:
          "border-2 border-foundation-200 bg-transparent hover:bg-foundation-50 hover:text-foundation-700",
        ghost:
          "bg-transparent hover:bg-neutral-100 text-neutral-700",
        danger:
          "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg",
      },
      size: {
        sm: "h-9 px-4 py-2",
        md: "h-11 px-6 py-3",
        lg: "h-12 px-8 py-4 text-base",
      },
      rounded: {
        default: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
