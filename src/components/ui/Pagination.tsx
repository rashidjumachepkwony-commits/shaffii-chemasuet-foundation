import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  showPageSize?: boolean;
  pageSizes?: number[];
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  showPageSize = false,
  pageSizes = [10, 20, 50],
  siblingCount = 1,
}: PaginationProps) {
  const range = (start: number, end: number) => {
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  };

  const generatePagination = () => {
    const totalNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalNumbers) {
      return range(1, totalPages);
    }

    const leftSiblings = Math.max(currentPage - siblingCount, 1);
    const rightSiblings = Math.min(currentPage + siblingCount, totalPages);
    const leftGap = currentPage - leftSiblings;
    const rightGap = rightSiblings - currentPage;

    if (leftGap === 0 && rightGap <= 1) {
      const leftRange = Math.max(1, currentPage - totalNumbers + 1);
      return [...range(leftRange, currentPage), "...", totalPages];
    }

    if (rightGap === 0 && leftGap <= 1) {
      const rightRange = Math.min(totalPages, currentPage + totalNumbers - 1);
      return [1, "...", ...range(currentPage, rightRange)];
    }

    if (leftGap <= 1 && rightGap <= 1) {
      const leftRange = Math.max(1, currentPage - totalNumbers + 1);
      const rightRange = Math.min(totalPages, currentPage + totalNumbers - 1);
      return [
        ...range(leftRange, currentPage),
        "...",
        currentPage + 1,
        "...",
        totalPages,
      ];
    }

    return [1, "...", ...range(leftSiblings, rightSiblings), "...", totalPages];
  };

  const pages = generatePagination();
  const pageNumbers = pages.filter(
    (p): p is number => typeof p === "number"
  );

  return (
    <div className="flex items-center justify-between">
      {showPageSize && totalItems !== undefined && (
        <div className="text-sm text-neutral-600">
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems}
        </div>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
          aria-label="Previous page"
        >
          Previous
        </button>
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-neutral-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                currentPage === page
                  ? "bg-foundation-600 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
      {showPageSize && (
        <select
          value={pageSize}
          onChange={(e) => onPageChange(1)}
          className="rounded-lg border border-neutral-300 px-2 py-1 text-sm"
          aria-label="Page size"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
