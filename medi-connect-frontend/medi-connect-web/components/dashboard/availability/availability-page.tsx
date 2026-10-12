"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";

import { BlockedDateDialog } from "@/components/dashboard/availability/dialogs/blocked-date-dialog";
import { TimeRangeDialog } from "@/components/dashboard/availability/dialogs/time-range-dialog";
import { BlockedDates } from "@/components/dashboard/availability/sections/blocked-dates";
import { BookingSettings } from "@/components/dashboard/availability/sections/booking-settings";
import { ScheduleSummary } from "@/components/dashboard/availability/sections/schedule-summary";
import { WeeklySchedule } from "@/components/dashboard/availability/sections/weekly-schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockAvailability } from "@/data/mock/availability";
import { getScheduleIssues } from "@/lib/availability-schedule";
import { availabilitySchema } from "@/schemas/availability.schema";
import type {
  AvailabilityTimeRange,
  AvailabilityValues,
  TimeRangeTarget,
} from "@/types/availability";

export function AvailabilityPage() {
  const [rangeTarget, setRangeTarget] = useState<TimeRangeTarget | null>(null);
  const [blockedDialogOpen, setBlockedDialogOpen] = useState(false);
  const formik = useFormik<AvailabilityValues>({
    initialValues: structuredClone(mockAvailability),
    validationSchema: availabilitySchema,
    onSubmit(values) {
      const issues = getScheduleIssues(values);
      if (issues.length > 0) {
        toast.error(issues[0]);
        return;
      }
      toast.info(
        "Draft validated for UI preview. No schedule was saved or published.",
      );
    },
  });

  function updateDay(
    dayIndex: number,
    day: AvailabilityValues["days"][number],
  ) {
    const days = [...formik.values.days];
    days[dayIndex] = day;
    void formik.setFieldValue("days", days);
  }

  function handleRangeSubmit(
    input: Pick<AvailabilityTimeRange, "startTime" | "endTime" | "mode">,
  ) {
    // API integration point: do not change the mock schedule.
    void input;
    toast.info("Time range preview only. No schedule was changed.");
  }

  function handleRemoveRange(dayIndex: number, rangeId: string) {
    // API integration point: no time range is deleted yet.
    void dayIndex;
    void rangeId;
    toast.info("Delete preview only. No time range was removed.");
  }

  function handleAddBlockedDate(date: string, reason: string) {
    // API integration point: no blocked date is added yet.
    void date;
    void reason;
    toast.info("Blocked date preview only. No date was added.");
  }

  function handleRemoveBlockedDate(id: string) {
    // API integration point: no blocked date is deleted yet.
    void id;
    toast.info("Delete preview only. No blocked date was removed.");
  }

  const selectedDay = rangeTarget
    ? formik.values.days[rangeTarget.dayIndex]
    : null;
  const selectedRange = selectedDay?.ranges.find(
    (range) => range.id === rangeTarget?.rangeId,
  );

  return (
    <section
      aria-label="Doctor availability"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            <CalendarClock className="size-6 text-primary" aria-hidden="true" />{" "}
            Availability
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shape your consultation hours and time away before scheduling goes
            live.
          </p>
        </div>
        <p className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
          Times shown in PKT (UTC+05:00)
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
        <BookingSettings
          values={formik.values}
          onChange={(field, value) => {
            void formik.setFieldValue(field, value);
          }}
        />
        <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-stretch">
          <WeeklySchedule
            days={formik.values.days}
            onToggle={(dayIndex, enabled) =>
              updateDay(dayIndex, { ...formik.values.days[dayIndex], enabled })
            }
            onEdit={setRangeTarget}
            onRemove={handleRemoveRange}
          />
          <div className="space-y-5">
            <ScheduleSummary values={formik.values} />
            <BlockedDates
              blocks={formik.values.blocks}
              onAdd={() => setBlockedDialogOpen(true)}
              onRemove={handleRemoveBlockedDate}
            />
            <Card className="gap-0 border border-slate-200 bg-white py-0 shadow-sm">
              <CardHeader className="px-5 py-5">
                <CardTitle className="text-base font-semibold">
                  Practice location
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Label for your in-person sessions.
                </p>
              </CardHeader>
              <CardContent className="space-y-2 border-t border-slate-100 px-5 py-5">
                <Label htmlFor="clinic-name">Clinic or hospital name</Label>
                <Input
                  id="clinic-name"
                  name="clinicName"
                  className="h-11"
                  value={formik.values.clinicName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(
                    formik.touched.clinicName && formik.errors.clinicName,
                  )}
                />
                {formik.touched.clinicName && formik.errors.clinicName ? (
                  <p className="text-xs text-destructive">
                    {formik.errors.clinicName}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <TimeRangeDialog
        key={
          rangeTarget
            ? `${rangeTarget.dayIndex}-${rangeTarget.rangeId ?? "new"}`
            : "closed"
        }
        open={rangeTarget !== null}
        day={selectedDay?.day ?? ""}
        range={selectedRange}
        onOpenChange={(open) => {
          if (!open) setRangeTarget(null);
        }}
        onSave={handleRangeSubmit}
      />
      <BlockedDateDialog
        key={blockedDialogOpen ? "open" : "closed"}
        open={blockedDialogOpen}
        existingDates={formik.values.blocks.map((block) => block.date)}
        onOpenChange={setBlockedDialogOpen}
        onSave={handleAddBlockedDate}
      />
    </section>
  );
}
