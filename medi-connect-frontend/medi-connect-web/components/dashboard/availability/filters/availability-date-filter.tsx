"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AvailabilityDateFilterProps } from "@/types/availability";

export function AvailabilityDateFilter({
  date,
  onDateChange,
}: AvailabilityDateFilterProps) {
  const [open, setOpen] = useState(false);
  const selected = date ? parseISO(date) : undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            aria-label="Filter availability by date"
            aria-expanded={open}
            className="h-10 w-full justify-between border-input bg-white px-2.5 text-sm font-normal"
          />
        }
      >
        <span
          className={
            date ? "truncate text-foreground" : "truncate text-muted-foreground"
          }
        >
          {date ? format(parseISO(date), "d MMM yyyy") : "Select date"}
        </span>
        <CalendarDays className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto max-w-[calc(100vw-2rem)] gap-0 p-2"
      >
        <PopoverHeader className="sr-only">
          <PopoverTitle>Filter availability by date</PopoverTitle>
        </PopoverHeader>
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? new Date()}
          onSelect={(value) => {
            if (!value) return;
            onDateChange(format(value, "yyyy-MM-dd"));
            setOpen(false);
          }}
          className="p-1 [--cell-size:2.25rem]"
        />
        <div className="flex justify-end border-t px-1 pt-2">
          <Button
            type="button"
            variant="ghost"
            disabled={!date}
            className="h-8 px-2.5 text-sm"
            onClick={() => {
              onDateChange("");
              setOpen(false);
            }}
          >
            Clear date
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
