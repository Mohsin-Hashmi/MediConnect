"use client";

import { useFormik } from "formik";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPOINTMENTS_DEMO_DATE } from "@/data/mock/appointments";
import { newAppointmentSchema } from "@/schemas/appointment.schema";
import type { NewAppointmentDialogProps, NewAppointmentFormValues } from "@/types/appointment";

export function NewAppointmentDialog({
  open,
  onOpenChange,
  onCreate,
}: NewAppointmentDialogProps) {
  const formik = useFormik<NewAppointmentFormValues>({
    initialValues: {
      patientName: "",
      patientAge: "",
      reason: "",
      date: APPOINTMENTS_DEMO_DATE,
      time: "09:00",
      visitType: "In-person",
      feePkr: "2500",
    },
    validationSchema: newAppointmentSchema,
    onSubmit(values) {
      const patientName = values.patientName.trim().replace(/\s+/g, " ");
      onCreate({
        patientName,
        patientAge: Number(values.patientAge),
        reason: values.reason.trim(),
        date: values.date,
        time: values.time,
        durationMinutes: 30,
        visitType: values.visitType,
        status: "pending",
        feePkr: Number(values.feePkr),
        avatarTone: "blue",
      });
      formik.resetForm();
      onOpenChange(false);
      toast.success("Demo appointment added to this page.");
    },
  });

  const fieldError = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field] ? String(formik.errors[field]) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">New appointment</DialogTitle>
          <DialogDescription>This creates a demo booking in this browser session only.</DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="appointment-patient">Patient name</Label>
              <Input id="appointment-patient" name="patientName" placeholder="e.g. Ayesha Khan" value={formik.values.patientName} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("patientName"))} className="h-10" />
              {fieldError("patientName") && <p className="text-xs text-destructive">{fieldError("patientName")}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appointment-age">Patient age</Label>
              <Input id="appointment-age" name="patientAge" type="number" min="1" max="120" value={formik.values.patientAge} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("patientAge"))} className="h-10" />
              {fieldError("patientAge") && <p className="text-xs text-destructive">{fieldError("patientAge")}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appointment-fee">Fee (PKR)</Label>
              <Input id="appointment-fee" name="feePkr" type="number" min="0" value={formik.values.feePkr} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("feePkr"))} className="h-10" />
              {fieldError("feePkr") && <p className="text-xs text-destructive">{fieldError("feePkr")}</p>}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="appointment-reason">Reason for visit</Label>
              <Input id="appointment-reason" name="reason" placeholder="e.g. Cardiology follow-up" value={formik.values.reason} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("reason"))} className="h-10" />
              {fieldError("reason") && <p className="text-xs text-destructive">{fieldError("reason")}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appointment-date">Date</Label>
              <Input id="appointment-date" name="date" type="date" min={APPOINTMENTS_DEMO_DATE} value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("date"))} className="h-10" />
              {fieldError("date") && <p className="text-xs text-destructive">{fieldError("date")}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appointment-time">Time</Label>
              <Input id="appointment-time" name="time" type="time" value={formik.values.time} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("time"))} className="h-10" />
              {fieldError("time") && <p className="text-xs text-destructive">{fieldError("time")}</p>}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="appointment-type">Visit type</Label>
              <Select value={formik.values.visitType} onValueChange={(value) => void formik.setFieldValue("visitType", value ?? "")}>
                <SelectTrigger id="appointment-type" className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"><SelectValue /></SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  <SelectItem value="In-person">In-person</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                </SelectContent>
              </Select>
              {fieldError("visitType") && <p className="text-xs text-destructive">{fieldError("visitType")}</p>}
            </div>
          </div>
          <DialogFooter className="mx-0 mb-0 rounded-lg bg-transparent px-0 pb-0">
            <Button type="button" variant="outline" className="h-10 px-4" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="h-10 px-4"><Plus className="size-4" aria-hidden="true" />Add demo appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
