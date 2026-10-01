import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  cn(
    "w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm",
    "transition-colors placeholder:text-neutral-400",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-foundation-500 disabled:cursor-not-allowed disabled:opacity-60",
    "resize-y min-h-[80px]"
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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextareaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
