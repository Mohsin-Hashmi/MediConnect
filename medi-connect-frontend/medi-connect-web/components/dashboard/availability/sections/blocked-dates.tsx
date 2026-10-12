import { format, parseISO } from "date-fns";
import { CalendarOff, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlockedDatesProps } from "@/types/availability";

export function BlockedDates({ blocks, onAdd, onRemove }: BlockedDatesProps) {
  return (
    <Card className="gap-0 border border-slate-200 bg-white py-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-slate-100 px-5 py-5">
        <div>
          <CardTitle className="text-base font-semibold">
            Blocked dates
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Leave and one-off closures.
          </p>
        </div>
        <CalendarOff className="size-5 text-amber-600" aria-hidden="true" />
      </CardHeader>
      <CardContent className="space-y-3 px-5 py-5">
        {blocks.length === 0 ? (
          <p className="rounded-lg bg-slate-50 px-3 py-4 text-sm text-muted-foreground">
            No dates blocked in this draft.
          </p>
        ) : (
          blocks.map((block) => (
            <div
              key={block.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {block.reason}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(block.date), "dd MMM yyyy")}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove blocked date ${block.date}`}
                onClick={() => onRemove(block.id)}
              >
                <Trash2 className="size-4 text-slate-500" />
              </Button>
            </div>
          ))
        )}
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full border-dashed text-primary"
          onClick={onAdd}
        >
          <Plus className="size-4" /> Add blocked date
        </Button>
      </CardContent>
    </Card>
  );
}
