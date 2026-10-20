import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EarningsFilterBarProps,
  EarningsSortOrder,
  EarningStatus,
} from "@/types/earnings";

export function EarningsFilterBar({
  filters,
  onChange,
  onReset,
  hasFilters,
}: EarningsFilterBarProps) {
  return (
    <div className="grid gap-3 border-b px-5 py-4 md:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_12rem_12rem_auto]">
      <div className="relative md:col-span-2 xl:col-span-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Search transactions"
          placeholder="Search reference, patient, or service..."
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          className="h-10 pl-9"
        />
      </div>
      <Select
        items={{
          all: "All statuses",
          settled: "Settled",
          pending: "Pending",
          refunded: "Refunded",
        }}
        value={filters.status}
        onValueChange={(value) =>
          onChange({ status: (value ?? "all") as "all" | EarningStatus })
        }
      >
        <SelectTrigger
          aria-label="Filter by settlement status"
          className="w-full bg-white px-3 data-[size=default]:h-10"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="settled">Settled</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
        </SelectContent>
      </Select>
      <Select
        items={{
          newest: "Newest first",
          oldest: "Oldest first",
          highest: "Highest amount",
        }}
        value={filters.sort}
        onValueChange={(value) =>
          onChange({ sort: (value ?? "newest") as EarningsSortOrder })
        }
      >
        <SelectTrigger
          aria-label="Sort transactions"
          className="w-full bg-white px-3 data-[size=default]:h-10"
        >
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="highest">Highest amount</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          className="h-10"
          onClick={onReset}
        >
          <X className="size-4" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
