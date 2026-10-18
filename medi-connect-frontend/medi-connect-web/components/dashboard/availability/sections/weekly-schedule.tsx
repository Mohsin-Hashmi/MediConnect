import { Clock3, Pencil, Plus, Trash2, Video, Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { WeeklyScheduleProps } from "@/types/availability";

export function WeeklySchedule({
  days,
  onToggle,
  onEdit,
  onRemove,
}: WeeklyScheduleProps) {
  return (
    <Card className="gap-0 border border-slate-200 bg-white py-0 shadow-sm xl:h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <CardTitle className="text-base font-semibold">
            Weekly operating schedule
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Set one or more consultation windows for each day.
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {days.filter((day) => day.enabled).length} days active
        </Badge>
      </CardHeader>
      <CardContent className="divide-y divide-slate-100 px-5 sm:px-6 xl:flex xl:flex-1 xl:flex-col">
        {days.map((day, dayIndex) => (
          <div
            key={day.day}
            className="grid gap-3 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4 xl:min-h-20 xl:flex-1 xl:items-center"
          >
            <div className="flex items-center gap-3 sm:pt-2 xl:pt-0">
              <Switch
                checked={day.enabled}
                onCheckedChange={(checked) => onToggle(dayIndex, checked)}
                aria-label={`${day.enabled ? "Disable" : "Enable"} ${day.day}`}
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {day.day}
                </p>
                <p className="text-xs text-muted-foreground">
                  {day.enabled
                    ? `${day.ranges.length} ${day.ranges.length === 1 ? "window" : "windows"}`
                    : "Day off"}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {day.enabled ? (
                <>
                  {day.ranges.map((range) => (
                    <div
                      key={range.id}
                      className="flex min-h-14 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                    >
                      {range.mode === "Video" ? (
                        <Video
                          className="size-4 shrink-0 text-violet-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <Building2
                          className="size-4 shrink-0 text-blue-600"
                          aria-hidden="true"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">
                          {range.startTime}–{range.endTime}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {range.mode}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-1 text-slate-600"
                        aria-label={`Edit ${day.day} ${range.startTime} range`}
                        onClick={() => onEdit({ dayIndex, rangeId: range.id })}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-600 hover:text-destructive"
                        aria-label={`Remove ${day.day} ${range.startTime} range`}
                        onClick={() => onRemove(dayIndex, range.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 border-dashed px-3 text-primary"
                    onClick={() => onEdit({ dayIndex })}
                  >
                    <Plus className="size-4" /> Add time range
                  </Button>
                </>
              ) : (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock3 className="size-4" aria-hidden="true" /> No
                  consultations scheduled
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
