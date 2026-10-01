import { cn } from "@/lib/utils";
import { CheckCircle, Info, XCircle } from "lucide-react";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export { useToastApi as useToast, useToastApi } from "./ToastProvider";

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastIcons = {
  default: Info,
  success: CheckCircle,
  error: XCircle,
  warning: Info,
  info: Info,
};

const toastVariantClasses = {
  default: "bg-neutral-900 text-white",
  success: "bg-emerald-900 text-emerald-50",
  error: "bg-red-900 text-red-50",
  warning: "bg-amber-900 text-amber-50",
  info: "bg-blue-900 text-blue-50",
};

export function Toast({
  id,
  title,
  message,
  variant = "default",
  duration = 5000,
  action,
}: ToastProps) {
  const Icon = toastIcons[variant];
  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-xl p-4 shadow-lg",
        toastVariantClasses[variant],
        "animate-in slide-in-from-right-full"
      )}
      role="status"
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="shrink-0 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white/30"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
