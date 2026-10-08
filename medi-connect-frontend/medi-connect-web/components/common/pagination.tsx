import { Button } from "@/components/ui/button";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import type { PaginationProps } from "@/types/common";

export function Pagination({
  currentPage,
  totalItems,
  onPageChange,
  itemLabel = "records",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGINATION_PAGE_SIZE));
  const page = Math.min(Math.max(currentPage, 1), totalPages);
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * PAGINATION_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGINATION_PAGE_SIZE, totalItems);
  const firstVisiblePage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const lastVisiblePage = Math.min(totalPages, firstVisiblePage + 4);
  const visiblePages = Array.from(
    { length: lastVisiblePage - firstVisiblePage + 1 },
    (_, index) => firstVisiblePage + index,
  );

  return (
    <div className="flex flex-col gap-3 border-t px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span aria-live="polite">Showing {rangeStart}–{rangeEnd} of {totalItems} {itemLabel}</span>
      <nav aria-label={`${itemLabel} pagination`} className="flex flex-wrap items-center gap-1.5">
        <Button type="button" variant="outline" className="h-9 px-3" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        {firstVisiblePage > 1 && (
          <>
            <Button type="button" variant="outline" className="size-9 p-0" aria-label="Go to page 1" onClick={() => onPageChange(1)}>1</Button>
            {firstVisiblePage > 2 && <span aria-hidden="true" className="px-1">…</span>}
          </>
        )}
        {visiblePages.map((pageNumber) => (
          <Button
            key={pageNumber}
            type="button"
            variant={pageNumber === page ? "default" : "outline"}
            className="size-9 p-0 tabular-nums"
            aria-label={`Go to page ${pageNumber}`}
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
        {lastVisiblePage < totalPages && (
          <>
            {lastVisiblePage < totalPages - 1 && <span aria-hidden="true" className="px-1">…</span>}
            <Button type="button" variant="outline" className="size-9 p-0" aria-label={`Go to page ${totalPages}`} onClick={() => onPageChange(totalPages)}>{totalPages}</Button>
          </>
        )}
        <Button type="button" variant="outline" className="h-9 px-3" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </nav>
    </div>
  );
}
