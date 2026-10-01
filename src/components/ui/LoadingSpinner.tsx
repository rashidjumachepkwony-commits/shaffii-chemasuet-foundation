import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        label ? "flex-col gap-2" : "",
        className
      )}
      role="status"
      aria-label={label || "Loading"}
    >
      <Loader2
        className={cn("animate-spin text-foundation-600", sizeClasses[size])}
      />
      {label && <span className="text-sm text-neutral-500">{label}</span>}
    </div>
  );
}

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "rect" | "circle";
  lines?: number;
}

export function Skeleton({ className, variant = "rect", lines = 1 }: SkeletonProps) {
  if (variant === "circle") {
    return (
      <div
        className={cn(
          "rounded-full bg-neutral-200 animate-pulse",
          className
        )}
      />
    );
  }

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-1", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 w-full max-w-[90%] rounded bg-neutral-200 animate-pulse"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded bg-neutral-200 animate-pulse",
        variant === "text" ? "h-4 w-full" : "h-4 w-full",
        className
      )}
    />
  );
}
