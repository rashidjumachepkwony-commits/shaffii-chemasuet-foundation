import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error" | "neutral";
  title?: string;
  closable?: boolean;
}

const alertVariants = {
  info: "bg-blue-50 border-blue-200 text-blue-900",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  error: "bg-red-50 border-red-200 text-red-900",
  neutral: "bg-neutral-50 border-neutral-200 text-neutral-900",
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, children, closable = false, ...props }, ref) => {
    const [visible, setVisible] = React.useState(true);
    if (!visible) return null;

    return (
      <div
        className={cn(
          "relative rounded-xl border p-4 text-sm",
          alertVariants[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {title && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        {children}
        {closable && (
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 rounded-md p-1 opacity-60 hover:opacity-100"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
