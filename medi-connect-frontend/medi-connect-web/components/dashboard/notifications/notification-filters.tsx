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
  NotificationFilterBarProps,
  NotificationFilters,
} from "@/types/notification";

export function NotificationFilters({
  filters,
  onChange,
  onReset,
  hasFilters,
}: NotificationFilterBarProps) {
  return (
    <div className="grid gap-3 border-b px-5 py-4 md:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_13rem_11rem_12rem_auto]">
      <div className="relative md:col-span-2 xl:col-span-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
        <Input
          aria-label="Search notifications"
          placeholder="Search notification activity..."
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          className="h-10 pl-9 text-sm"
        />
      </div>
      <Select
        items={{
          all: "All categories",
          appointments: "Appointments",
          messages: "Messages",
          reviews: "Reviews",
          availability: "Availability",
          profile: "Profile",
          system: "System",
        }}
        value={filters.category}
        onValueChange={(value) =>
          onChange({
            category: (value ?? "all") as NotificationFilters["category"],
          })
        }
      >
        <SelectTrigger
          aria-label="Filter by category"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="appointments">Appointments</SelectItem>
          <SelectItem value="messages">Messages</SelectItem>
          <SelectItem value="reviews">Reviews</SelectItem>
          <SelectItem value="availability">Availability</SelectItem>
          <SelectItem value="profile">Profile</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <Select
        items={{ all: "All activity", unread: "Unread", read: "Read" }}
        value={filters.status}
        onValueChange={(value) =>
          onChange({
            status: (value ?? "all") as NotificationFilters["status"],
          })
        }
      >
        <SelectTrigger
          aria-label="Filter by read status"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All activity</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>
      <Select
        items={{ newest: "Newest first", oldest: "Oldest first" }}
        value={filters.sort}
        onValueChange={(value) =>
          onChange({
            sort: (value ?? "newest") as NotificationFilters["sort"],
          })
        }
      >
        <SelectTrigger
          aria-label="Sort notifications"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          className="h-10 px-3 text-sm"
          onClick={onReset}
        >
          <X className="size-4" aria-hidden="true" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
