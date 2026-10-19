"use client";

import { format, parseISO } from "date-fns";
import { useFormik } from "formik";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { availabilitySchema } from "@/schemas/availability.schema";
import type {
  AvailabilityFormValues,
  TimeRangeDialogProps,
} from "@/types/availability";

function today() {
  return format(new Date(), "yyyy-MM-dd");
}

export function TimeRangeDialog({
  open,
  availability,
  isPending,
  onOpenChange,
  onSave,
}: TimeRangeDialogProps) {
  const formik = useFormik<AvailabilityFormValues>({
    initialValues: {
      date: availability
        ? format(parseISO(availability.date), "yyyy-MM-dd")
        : today(),
      startTime: availability?.startTime ?? "09:00",
      endTime: availability?.endTime ?? "13:00",
      slotDuration: String(availability?.slotDuration ?? 30),
      isAvailable: availability?.isAvailable ?? true,
    },
    validationSchema: availabilitySchema,
    onSubmit: onSave,
  });

  const error = (name: keyof AvailabilityFormValues) =>
    formik.touched[name] ? formik.errors[name] : undefined;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {availability ? "Edit availability" : "Add availability"}
          </DialogTitle>
          <DialogDescription>
            Set a dated window and the duration of each patient-bookable slot.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="availability-date">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="availability-date"
              name="date"
              type="date"
              min={today()}
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(error("date"))}
              className="h-11"
            />
            {error("date") ? (
              <p className="text-xs text-destructive">{error("date")}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="availability-start">
                Start time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="availability-start"
                name="startTime"
                type="time"
                value={formik.values.startTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(error("startTime"))}
                className="h-11"
              />
              {error("startTime") ? (
                <p className="text-xs text-destructive">{error("startTime")}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability-end">
                End time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="availability-end"
                name="endTime"
                type="time"
                value={formik.values.endTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(error("endTime"))}
                className="h-11"
              />
              {error("endTime") ? (
                <p className="text-xs text-destructive">{error("endTime")}</p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slot-duration">
              Slot duration (minutes){" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slot-duration"
              name="slotDuration"
              type="number"
              min={5}
              max={240}
              step={5}
              value={formik.values.slotDuration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(error("slotDuration"))}
              className="h-11"
            />
            {error("slotDuration") ? (
              <p className="text-xs text-destructive">
                {error("slotDuration")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Patients will choose one slot of this length.
              </p>
            )}
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-4">
            <div>
              <Label htmlFor="availability-active">Available for booking</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Turn this off to keep the window without accepting bookings.
              </p>
            </div>
            <Switch
              id="availability-active"
              checked={formik.values.isAvailable}
              onCheckedChange={(checked) =>
                void formik.setFieldValue("isAvailable", checked)
              }
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? <Spinner aria-label="Saving availability" />
                : availability
                  ? "Save changes"
                  : "Create availability"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
