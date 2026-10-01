import * as React from "react";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-neutral-900">
              Something went wrong
            </h2>
            <p className="text-neutral-600">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function NotFound({ message = "Page not found" }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-900">404</h1>
        <p className="mt-2 text-neutral-600">{message}</p>
        <a
          href="/"
          className="mt-4 inline-block rounded-xl bg-foundation-700 px-6 py-3 text-sm font-semibold text-white hover:bg-foundation-800"
        >
          Return to homepage
        </a>
      </div>
    </div>
  );
}

export function Unauthorized() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-neutral-900">403</h1>
        <p className="mt-2 text-neutral-600">
          You are not authorized to access this page.
        </p>
        <a
          href="/"
          className="mt-4 inline-block rounded-xl bg-foundation-700 px-6 py-3 text-sm font-semibold text-white hover:bg-foundation-800"
        >
          Return to homepage
        </a>
      </div>
    </div>
  );
}

export function SectionWrapper({
  children,
  className,
  id,
  spacing = "md",
  innerClassName = "container mx-auto px-4 md:px-6",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  spacing?: "sm" | "md" | "lg";
  innerClassName?: string;
}) {
  const spacingClasses = {
    sm: "py-8",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-24",
  };
  return (
    <section
      id={id}
      className={cn(spacingClasses[spacing], className)}
    >
      <div className={innerClassName}>{children}</div>
    </section>
  );
}
