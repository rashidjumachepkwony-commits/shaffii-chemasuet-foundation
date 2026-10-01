import * as React from "react";
import { cn } from "@/lib/utils";
import { Toast, type ToastProps, type ToastVariant } from "./Toast";

interface ToastContextValue {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, "id">) => string;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

let toastIdCounter = 0;

export function useToastApi() {
  const { addToast } = useToast();
  const show = (
    message: string,
    variant: ToastVariant = "default",
    options?: Omit<ToastProps, "id" | "message" | "variant">
  ) => {
    return addToast({ message, variant, ...options });
  };
  return {
    success: (message: string, options?: Omit<ToastProps, "id" | "message" | "variant">) =>
      show(message, "success", options),
    error: (message: string, options?: Omit<ToastProps, "id" | "message" | "variant">) =>
      show(message, "error", options),
    warning: (message: string, options?: Omit<ToastProps, "id" | "message" | "variant">) =>
      show(message, "warning", options),
    info: (message: string, options?: Omit<ToastProps, "id" | "message" | "variant">) =>
      show(message, "info", options),
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToastProps, "id">) => {
      const id = `toast-${toastIdCounter++}`;
      const newToast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    toasts.forEach((toast) => {
      const timer = setTimeout(() => removeToast(toast.id), toast.duration ?? 5000);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
