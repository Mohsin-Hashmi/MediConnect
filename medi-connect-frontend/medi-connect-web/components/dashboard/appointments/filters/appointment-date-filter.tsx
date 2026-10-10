"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { APPOINTMENTS_DEMO_DATE } from "@/data/mock/appointments";
import { formatAppointmentDate } from "@/lib/appointment-format";
import type { AppointmentDateFilterProps } from "@/types/appointment";

export function AppointmentDateFilter({ date, onDateChange }: AppointmentDateFilterProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = date ? parseISO(date) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            aria-label="Filter by date"
            aria-expanded={open}
            className="h-10 w-full justify-between border-input bg-white px-2.5 text-sm font-normal"
          />
        }
      >
        <span className={date ? "truncate text-foreground" : "truncate text-muted-foreground"}>
          {date ? formatAppointmentDate(date) : "Select date"}
        </span>
        <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto max-w-[calc(100vw-2rem)] gap-0 p-2">
        <PopoverHeader className="sr-only">
          <PopoverTitle>Filter appointments by date</PopoverTitle>
        </PopoverHeader>
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate ?? parseISO(APPOINTMENTS_DEMO_DATE)}
          onSelect={(selected) => {
            if (!selected) return;
            onDateChange(format(selected, "yyyy-MM-dd"));
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
