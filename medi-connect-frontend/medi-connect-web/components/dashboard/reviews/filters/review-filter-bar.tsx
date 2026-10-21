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
import type { ReviewFilterBarProps, ReviewFilters } from "@/types/review";

export function ReviewFilterBar({
  filters,
  onChange,
  onReset,
  hasFilters,
}: ReviewFilterBarProps) {
  return (
    <div className="grid gap-3 border-b px-5 py-4 md:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_11rem_12rem_12rem_11rem_auto]">
      <div className="relative md:col-span-2 xl:col-span-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
        <Input
          aria-label="Search reviews"
          placeholder="Search patient, feedback, service or tag..."
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          className="h-10 pl-9 text-sm"
        />
      </div>
      <Select
        items={{
          all: "All ratings",
          "5": "5 stars",
          "4": "4 stars",
          "3": "3 stars",
          "2": "2 stars",
          "1": "1 star",
        }}
        value={String(filters.rating)}
        onValueChange={(value) =>
          onChange({
            rating:
              value === "all" || !value
                ? "all"
                : (Number(value) as ReviewFilters["rating"]),
          })
        }
      >
        <SelectTrigger
          aria-label="Filter by rating"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All ratings</SelectItem>
          {[5, 4, 3, 2, 1].map((rating) => (
            <SelectItem key={rating} value={String(rating)}>
              {rating} {rating === 1 ? "star" : "stars"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={{
          all: "All S",
          "in-person": "In-person",
          video: "Video",
        }}
        value={filters.consultationType}
        onValueChange={(value) =>
          onChange({
            consultationType: (value ??
              "all") as ReviewFilters["consultationType"],
          })
        }
      >
        <SelectTrigger
          aria-label="Filter by consultation type"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All consultations</SelectItem>
          <SelectItem value="in-person">In-person</SelectItem>
          <SelectItem value="video">Video</SelectItem>
        </SelectContent>
      </Select>
      <Select
        items={{
          all: "All responses",
          replied: "Replied",
          unanswered: "Awaiting response",
        }}
        value={filters.replyStatus}
        onValueChange={(value) =>
          onChange({
            replyStatus: (value ?? "all") as ReviewFilters["replyStatus"],
          })
        }
      >
        <SelectTrigger
          aria-label="Filter by reply status"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All responses</SelectItem>
          <SelectItem value="replied">Replied</SelectItem>
          <SelectItem value="unanswered">Awaiting response</SelectItem>
        </SelectContent>
      </Select>
      <Select
        items={{
          newest: "Newest first",
          oldest: "Oldest first",
          highest: "Highest rated",
          lowest: "Lowest rated",
        }}
        value={filters.sort}
        onValueChange={(value) =>
          onChange({ sort: (value ?? "newest") as ReviewFilters["sort"] })
        }
      >
        <SelectTrigger
          aria-label="Sort reviews"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="highest">Highest rated</SelectItem>
          <SelectItem value="lowest">Lowest rated</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          className="h-10 px-3 text-sm"
          onClick={onReset}
        >
          <X className="size-4" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
