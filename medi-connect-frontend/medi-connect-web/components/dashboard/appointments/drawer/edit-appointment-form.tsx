"use client";

import { useFormik } from "formik";
import { Save } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { editAppointmentSchema } from "@/schemas/appointment.schema";
import type { EditAppointmentFormProps, EditAppointmentFormValues } from "@/types/appointment";

export function EditAppointmentForm({
  appointment,
  onClose,
  onSave,
}: EditAppointmentFormProps) {
  const formik = useFormik<EditAppointmentFormValues>({
    enableReinitialize: true,
    initialValues: {
      patientName: appointment.patientName,
      patientAge: String(appointment.patientAge),
      reason: appointment.reason,
      date: appointment.date,
      time: appointment.time,
      durationMinutes: String(appointment.durationMinutes),
      visitType: appointment.visitType,
      status: appointment.status,
      feePkr: String(appointment.feePkr),
    },
    validationSchema: editAppointmentSchema,
    onSubmit(values) {
      onSave({
        ...appointment,
        patientName: values.patientName.trim().replace(/\s+/g, " "),
        patientAge: Number(values.patientAge),
        reason: values.reason.trim(),
        date: values.date,
        time: values.time,
        durationMinutes: Number(values.durationMinutes),
        visitType: values.visitType,
        status: values.status,
        feePkr: Number(values.feePkr),
      });
    },
  });

  const fieldError = (field: keyof EditAppointmentFormValues) =>
    formik.touched[field] && formik.errors[field]
      ? String(formik.errors[field])
      : null;

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {appointment.patientName}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Patient ID: {appointment.patientId}
            </p>
          </div>
          <StatusBadge
            status={formik.values.status}
            tone={
              formik.values.status === "pending"
                ? "warning"
                : formik.values.status === "cancelled"
                  ? "danger"
                  : formik.values.status === "completed"
                    ? "success"
                    : "info"
            }
          />
        </div>

        <section className="space-y-4" aria-labelledby="edit-patient-heading">
          <div>
            <h3
              id="edit-patient-heading"
              className="text-sm font-semibold text-foreground"
            >
              Patient information
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Confirm who this appointment is for.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
            <div className="space-y-1.5">
              <Label htmlFor="edit-patient-name">
                Patient name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-patient-name"
                name="patientName"
                value={formik.values.patientName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("patientName"))}
                aria-describedby={
                  fieldError("patientName")
                    ? "edit-patient-name-error"
                    : undefined
                }
                className="h-11 bg-white text-sm"
              />
              {fieldError("patientName") && (
                <p
                  id="edit-patient-name-error"
                  className="text-xs text-destructive"
                >
                  {fieldError("patientName")}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-patient-age">
                Age <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-patient-age"
                name="patientAge"
                type="number"
                min="1"
                max="120"
                value={formik.values.patientAge}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("patientAge"))}
                aria-describedby={
                  fieldError("patientAge")
                    ? "edit-patient-age-error"
                    : undefined
                }
                className="h-11 bg-white text-sm"
              />
              {fieldError("patientAge") && (
                <p
                  id="edit-patient-age-error"
                  className="text-xs text-destructive"
                >
                  {fieldError("patientAge")}
                </p>
              )}
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4" aria-labelledby="edit-schedule-heading">
          <div>
            <h3
              id="edit-schedule-heading"
              className="text-sm font-semibold text-foreground"
            >
              Schedule &amp; visit
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Update the time and format of the consultation.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-appointment-date">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-appointment-date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("date"))}
                aria-describedby={
                  fieldError("date") ? "edit-appointment-date-error" : undefined
                }
                className="h-11 bg-white text-sm"
              />
              {fieldError("date") && (
                <p
                  id="edit-appointment-date-error"
                  className="text-xs text-destructive"
                >
                  {fieldError("date")}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-appointment-time">
                Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-appointment-time"
                name="time"
                type="time"
                value={formik.values.time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("time"))}
                aria-describedby={
                  fieldError("time") ? "edit-appointment-time-error" : undefined
                }
                className="h-11 bg-white text-sm"
              />
              {fieldError("time") && (
                <p
                  id="edit-appointment-time-error"
                  className="text-xs text-destructive"
                >
                  {fieldError("time")}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-duration">
                Duration (minutes) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-duration"
                name="durationMinutes"
                type="number"
                min="5"
                max="240"
                value={formik.values.durationMinutes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("durationMinutes"))}
                aria-describedby={
                  fieldError("durationMinutes")
                    ? "edit-duration-error"
                    : undefined
                }
                className="h-11 bg-white text-sm"
              />
              {fieldError("durationMinutes") && (
                <p
                  id="edit-duration-error"
                  className="text-xs text-destructive"
                >
                  {fieldError("durationMinutes")}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-visit-type">
                Visit type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formik.values.visitType}
                onValueChange={(value) => {
                  void formik.setFieldValue("visitType", value ?? "");
                  void formik.setFieldTouched("visitType", true, false);
                }}
              >
                <SelectTrigger
                  id="edit-visit-type"
                  aria-invalid={Boolean(fieldError("visitType"))}
                  className="w-full bg-white px-2.5 text-sm data-[size=default]:h-11"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  <SelectItem value="In-person">In-person</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                </SelectContent>
              </Select>
              {fieldError("visitType") && (
                <p className="text-xs text-destructive">
                  {fieldError("visitType")}
                </p>
              )}
            </div>
          </div>
        </section>

        <Separator />

        <section
          className="space-y-4"
          aria-labelledby="edit-consultation-heading"
        >
          <div>
            <h3
              id="edit-consultation-heading"
              className="text-sm font-semibold text-foreground"
            >
              Consultation details
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Keep the reason, fee, and status accurate.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-reason">
              Reason for visit <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-reason"
              name="reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(fieldError("reason"))}
              aria-describedby={
                fieldError("reason") ? "edit-reason-error" : undefined
              }
              className="min-h-24 resize-y bg-white text-sm"
            />
            {fieldError("reason") && (
              <p id="edit-reason-error" className="text-xs text-destructive">
                {fieldError("reason")}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-fee">
                Consultation fee <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  PKR
                </span>
                <Input
                  id="edit-fee"
                  name="feePkr"
                  type="number"
                  min="0"
                  value={formik.values.feePkr}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(fieldError("feePkr"))}
                  aria-describedby={
                    fieldError("feePkr") ? "edit-fee-error" : undefined
                  }
                  className="h-11 bg-white pl-12 text-sm"
                />
              </div>
              {fieldError("feePkr") && (
                <p id="edit-fee-error" className="text-xs text-destructive">
                  {fieldError("feePkr")}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-status">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                items={{
                  pending: "Pending",
                  confirmed: "Confirmed",
                  completed: "Completed",
                  cancelled: "Cancelled",
                }}
                value={formik.values.status}
                onValueChange={(value) => {
                  void formik.setFieldValue("status", value ?? "");
                  void formik.setFieldTouched("status", true, false);
                }}
              >
                <SelectTrigger
                  id="edit-status"
                  aria-invalid={Boolean(fieldError("status"))}
                  className="w-full bg-white px-2.5 text-sm data-[size=default]:h-11"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {fieldError("status") && (
                <p className="text-xs text-destructive">
                  {fieldError("status")}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <SheetFooter className="mt-0 border-t bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="text-xs text-muted-foreground">
          UI preview only. No changes will be saved.
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 px-4 sm:flex-none"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-10 flex-1 gap-2 px-4 sm:flex-none"
            disabled={!formik.dirty || formik.isSubmitting}
          >
            <Save className="size-4" aria-hidden="true" />
            Save changes
          </Button>
        </div>
      </SheetFooter>
    </form>
  );
}
