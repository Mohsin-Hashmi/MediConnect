"use client";

import { useFormik } from "formik";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cancelAppointmentSchema } from "@/schemas/appointment.schema";
import type {
  CancelAppointmentDialogProps,
  CancelAppointmentFormValues,
} from "@/types/appointment";

export function CancelAppointmentDialog({
  appointment,
  isPending,
  onClose,
  onConfirm,
}: CancelAppointmentDialogProps) {
  const formik = useFormik<CancelAppointmentFormValues>({
    initialValues: { cancellationReason: "" },
    enableReinitialize: true,
    validationSchema: cancelAppointmentSchema,
    onSubmit: (values) => {
      if (!appointment) return;
      onConfirm({
        appointmentId: appointment.id,
        cancellationReason: values.cancellationReason.trim(),
      });
    },
  });
  const error =
    formik.touched.cancellationReason && formik.errors.cancellationReason;

  function closeDialog() {
    formik.resetForm();
    onClose();
  }

  return (
    <Dialog
      open={appointment !== null}
      onOpenChange={(open) => !open && closeDialog()}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-5 p-6">
            <DialogHeader>
              <span className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-destructive ring-1 ring-red-100">
                <TriangleAlert className="size-5" aria-hidden="true" />
              </span>
              <DialogTitle className="text-lg font-semibold">
                Cancel appointment
              </DialogTitle>
              <DialogDescription className="leading-relaxed">
                {appointment
                  ? `Cancel the appointment with ${appointment.patientName}. The patient will see the cancellation reason.`
                  : "Add a reason for cancelling this appointment."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="cancellationReason">
                Cancellation reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="cancellationReason"
                name="cancellationReason"
                rows={4}
                maxLength={500}
                placeholder="For example: The clinic will be closed at this time."
                value={formik.values.cancellationReason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "cancellation-reason-error" : undefined}
                className="min-h-28 resize-none"
              />
              <div className="flex items-start justify-between gap-3 text-xs">
                <p id="cancellation-reason-error" className="text-destructive">
                  {error || ""}
                </p>
                <p className="ml-auto text-muted-foreground">
                  {formik.values.cancellationReason.length}/500
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="m-0 rounded-none px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isPending}
            >
              Keep appointment
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? (
                <Spinner aria-label="Cancelling appointment" />
              ) : (
                "Cancel appointment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
