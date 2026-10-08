"use client";

import { Trash2, TriangleAlert } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ConfirmActionDialogProps } from "@/types/common";

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  destructive = false,
  details,
  consequence,
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] gap-0 overflow-y-auto border border-slate-200 p-0 shadow-xl data-[size=default]:max-w-md data-[size=default]:sm:max-w-md">
        <div className="space-y-5 px-5 py-6 sm:px-6">
          <AlertDialogHeader>
            {destructive ? (
              <AlertDialogMedia className="size-11 rounded-xl bg-red-50 text-destructive ring-1 ring-red-100">
                <TriangleAlert className="size-5" aria-hidden="true" />
              </AlertDialogMedia>
            ) : null}
            <AlertDialogTitle className="text-lg font-semibold tracking-tight">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">{description}</AlertDialogDescription>
          </AlertDialogHeader>
          {details && details.length > 0 ? (
            <dl className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              {details.map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">{label}</dt>
                  <dd className="min-w-0 text-right font-medium text-foreground break-words">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {consequence ? (
            <p className={destructive ? "rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm leading-relaxed text-red-800" : "text-sm leading-relaxed text-muted-foreground"}>
              {consequence}
            </p>
          ) : null}
        </div>
        <AlertDialogFooter className="mx-0 mb-0 rounded-none border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <AlertDialogCancel autoFocus className="h-10 px-4">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            className={destructive ? "h-10 gap-2 bg-destructive px-4 text-white hover:bg-destructive/90" : "h-10 px-4"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {destructive ? <Trash2 className="size-4" aria-hidden="true" /> : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
