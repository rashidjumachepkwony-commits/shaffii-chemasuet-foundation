import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface FormFieldProps {
  label?: string;
  name?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  helpText?: string;
  className?: string;
}

export function FormField({
  label,
  name,
  error,
  required = false,
  children,
  helpText,
  className,
}: FormFieldProps) {
  const fieldId = name ? `${name}-field` : undefined;
  return (
    <div className={cn("mb-5", className)}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      {children}
      {helpText && (
        <p className="mt-1 text-sm text-neutral-500">{helpText}</p>
      )}
      {error && (
        <p
          className="mt-1 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}
