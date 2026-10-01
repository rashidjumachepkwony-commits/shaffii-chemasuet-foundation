import { cn } from "@/lib/utils";
import {
  Table as TableIcon,
  Columns,
  ArrowUpDown,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  mobileHidden?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  rowKey?: (row: T, index: number) => string;
  className?: string;
  mobileCard?: (row: T) => ReactNode;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  onSort,
  sortKey,
  sortDirection = "asc",
  rowKey,
  className,
  mobileCard,
}: TableProps<T>) {
  const sortedDirection = (key: string) =>
    sortKey === key ? sortDirection : "asc";

  const handleSort = (key: string) => {
    if (onSort) {
      const direction = sortedDirection(key) === "asc" ? "desc" : "asc";
      onSort(key, direction);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) {
    return <TableSkeleton columns={columns} />;
  }

  if (isMobile && mobileCard) {
    return (
      <div className="space-y-4">
        {data.map((row, i) => (
          <div
            key={rowKey ? rowKey(row, i) : i}
            className="rounded-xl border border-neutral-200 p-4"
          >
            {mobileCard(row)}
          </div>
        ))}
        {data.length === 0 && (
          <EmptyState message={emptyMessage} />
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left font-semibold text-neutral-700",
                  col.headerClassName,
                  col.mobileHidden && "hidden md:table-cell",
                  col.sortable && "cursor-pointer select-none",
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={rowKey ? rowKey(row, i) : i}
              className="border-b border-neutral-200 hover:bg-neutral-50"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-neutral-800",
                    col.className,
                    col.mobileHidden && "hidden md:table-cell",
                  )}
                >
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableSkeleton({ columns }: { columns: Column<Record<string, unknown>>[] | Column<any>[] }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        {columns.map((c, i) => (
          <div
            key={i}
            className="h-6 flex-1 rounded bg-neutral-200 animate-pulse"
          />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {columns.map((c, j) => (
            <div
              key={j}
              className="h-4 flex-1 rounded bg-neutral-200 animate-pulse"
              style={{ animationDelay: `${i * 30}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <TableIcon className="h-12 w-12 text-neutral-300 mb-3" />
      <p className="text-neutral-500">{message}</p>
    </div>
  );
}
