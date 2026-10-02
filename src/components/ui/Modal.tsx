import * as React from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-7xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  overlayClassName,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/60",
        "backdrop-blur-sm overflow-y-auto",
        overlayClassName
      )}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          "relative mx-4 my-8 w-full rounded-2xl bg-white p-0 shadow-2xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          sizeClasses[size],
          className
        )}
        onClick={handleOverlayClick}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-neutral-500 mt-1">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
