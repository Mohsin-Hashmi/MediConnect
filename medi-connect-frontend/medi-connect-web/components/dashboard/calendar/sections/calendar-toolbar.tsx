"use client";

import { endOfWeek, format, startOfWeek } from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  CalendarToolbarProps,
  CalendarView,
} from "@/types/calendar";

function periodLabel(date: Date, view: CalendarView) {
  if (view === "day") return format(date, "EEEE, MMMM d, yyyy");
  if (view === "month") return format(date, "MMMM yyyy");
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return start.getMonth() === end.getMonth()
    ? `${format(start, "MMMM d")}–${format(end, "d, yyyy")}`
    : `${format(start, "MMM d")}–${format(end, "MMM d, yyyy")}`;
}

export function CalendarToolbar({
  date,
  view,
  onToday,
  onPrevious,
  onNext,
  onViewChange,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 xl:flex-row xl:items-center xl:justify-between xl:px-5">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-10 border-slate-200 px-4 text-sm font-semibold text-slate-700 shadow-xs"
          onClick={onToday}
        >
          Today
        </Button>
        <div
          role="group"
          aria-label="Calendar date navigation"
          className="flex h-10 items-center rounded-lg border border-slate-200 bg-white shadow-xs"
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-r-none text-slate-600"
                  aria-label={`Previous ${view}`}
                  onClick={onPrevious}
                />
              }
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent side="bottom">Previous {view}</TooltipContent>
          </Tooltip>
          <span aria-hidden="true" className="h-5 w-px bg-slate-200" />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-l-none text-slate-600"
                  aria-label={`Next ${view}`}
                  onClick={onNext}
                />
              }
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent side="bottom">Next {view}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex min-w-0 items-center gap-2.5 sm:border-l sm:border-slate-200 sm:pl-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="size-[18px]" aria-hidden="true" />
          </span>
          <h2 className="min-w-0 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            {periodLabel(date, view)}
          </h2>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Tabs
          value={view}
          onValueChange={(value) => onViewChange(value as CalendarView)}
        >
          <TabsList aria-label="Calendar view" className="h-10 border border-slate-200 bg-slate-100/70 p-1">
            <TabsTrigger value="day" className="h-8 min-w-12 px-3 text-sm data-active:text-primary">
              Day
            </TabsTrigger>
            <TabsTrigger value="week" className="h-8 min-w-12 px-3 text-sm data-active:text-primary">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="h-8 min-w-12 px-3 text-sm data-active:text-primary">
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
