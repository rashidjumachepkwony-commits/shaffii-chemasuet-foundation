import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  align = "right",
  className,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const alignClasses = {
    left: "origin-top-left",
    right: "origin-top-right",
  };

  const positionClasses = {
    left: "absolute top-full left-0",
    right: "absolute top-full right-0",
  };

  return (
    <div className={cn("relative inline-block", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger}
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div
          className={cn(
            "absolute z-10 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-neutral-200",
            alignClasses[align],
            positionClasses[align]
          )}
        >
          <div className="py-1">
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                  }
                  setOpen(false);
                }}
                disabled={item.disabled}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-2 text-left text-sm",
                  "hover:bg-neutral-100 disabled:opacity-50",
                  item.danger && "text-red-600 hover:bg-red-50"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
