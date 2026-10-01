import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "soft" | "solid";
  color?: "neutral" | "blue" | "green" | "amber" | "red" | "purple" | "gold";
  size?: "sm" | "md" | "lg";
}

const badgeColorClasses: Record<string, Record<string, string>> = {
  neutral: {
    soft: "bg-neutral-100 text-neutral-800",
    solid: "bg-neutral-600 text-white",
    outline: "border-neutral-600 text-neutral-700",
  },
  blue: {
    soft: "bg-blue-100 text-blue-800",
    solid: "bg-blue-600 text-white",
    outline: "border-blue-600 text-blue-700",
  },
  green: {
    soft: "bg-emerald-100 text-emerald-800",
    solid: "bg-emerald-600 text-white",
    outline: "border-emerald-600 text-emerald-700",
  },
  amber: {
    soft: "bg-amber-100 text-amber-800",
    solid: "bg-amber-600 text-white",
    outline: "border-amber-600 text-amber-700",
  },
  red: {
    soft: "bg-red-100 text-red-800",
    solid: "bg-red-600 text-white",
    outline: "border-red-600 text-red-700",
  },
  purple: {
    soft: "bg-purple-100 text-purple-800",
    solid: "bg-purple-600 text-white",
    outline: "border-purple-600 text-purple-700",
  },
  gold: {
    soft: "bg-gold-100 text-neutral-800",
    solid: "bg-gold-500 text-neutral-900",
    outline: "border-gold-500 text-neutral-700",
  },
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "soft", color = "neutral", size = "md", ...props }, ref) => {
    const baseClasses = "inline-flex items-center rounded-full font-medium";
    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
      lg: "px-4 py-1.5 text-base",
    };
    const colorClass = badgeColorClasses[color][variant === "default" ? "soft" : variant];
    const borderClass = variant === "outline" ? `border` : "";

    return (
      <div
        className={cn(
          baseClasses,
          sizeClasses[size],
          colorClass,
          borderClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
