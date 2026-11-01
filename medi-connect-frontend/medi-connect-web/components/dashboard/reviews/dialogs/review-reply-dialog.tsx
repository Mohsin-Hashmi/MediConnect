"use client";

import { useFormik } from "formik";
import { MessageSquareReply } from "lucide-react";

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
import { reviewReplySchema } from "@/schemas/review.schema";
import type {
  ReviewReplyDialogProps,
  ReviewReplyFormValues,
} from "@/types/review";

export function ReviewReplyDialog({
  review,
  isPending,
  onClose,
  onSubmit,
}: ReviewReplyDialogProps) {
  const formik = useFormik<ReviewReplyFormValues>({
    initialValues: { message: "" },
    validationSchema: reviewReplySchema,
    onSubmit,
  });
  const error = formik.touched.message && formik.errors.message;

  function closeDialog() {
    formik.resetForm();
    onClose();
  }

  return (
    <Dialog open={review !== null} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-5 p-6">
            <DialogHeader>
              <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-primary ring-1 ring-blue-100">
                <MessageSquareReply className="size-5" aria-hidden="true" />
              </span>
              <DialogTitle>Reply to patient review</DialogTitle>
              <DialogDescription>
                Your response to {review?.patient?.name ?? "this patient"} will be saved with the review.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="reviewReply">Response</Label>
              <Textarea
                id="reviewReply"
                name="message"
                rows={5}
                maxLength={1000}
                placeholder="Write a professional response to this feedback."
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "review-reply-error" : undefined}
                className="min-h-32 resize-none"
              />
              <div className="flex items-start justify-between gap-3 text-xs">
                <p id="review-reply-error" className="text-destructive">{error || ""}</p>
                <p className="ml-auto text-muted-foreground">{formik.values.message.length}/1000</p>
              </div>
            </div>
          </div>
          <DialogFooter className="m-0 rounded-none px-6 py-4">
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner aria-label="Saving review reply" /> : "Publish response"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
