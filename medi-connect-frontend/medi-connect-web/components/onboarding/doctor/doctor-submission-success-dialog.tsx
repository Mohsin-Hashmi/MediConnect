"use client";

import { CircleCheck, LayoutDashboard, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DoctorProfile, DoctorSubmissionSuccessDialogProps } from "@/types/doctor";

function getApplicationReference(doctor: DoctorProfile) {
  const year = new Date(doctor.createdAt).getFullYear();
  const referenceSuffix = doctor.id.slice(-6).toUpperCase();

  return `MDC-${year}-${referenceSuffix}`;
}

export function DoctorSubmissionSuccessDialog({
  doctor,
  open,
  onContinue,
}: DoctorSubmissionSuccessDialogProps) {
  if (!doctor) return null;

  const details = [
    { label: "Application Reference", value: getApplicationReference(doctor) },
    { label: "Specialization", value: doctor.specialization },
    { label: "License Number", value: doctor.licenseNumber },
    { label: "Licensing Body", value: "PMDC Automated Queue", verified: true },
    { label: "Est. Activation Turnaround", value: "4–12 Hours" },
  ];

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 shadow-[0_28px_80px_rgba(15,23,42,0.28)] sm:max-w-md"
      >
        <div className="px-6 pt-7 pb-5 text-center sm:px-8">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-teal-100 text-secondary ring-8 ring-teal-50">
            <CircleCheck className="size-7" aria-hidden="true" />
          </span>

          <DialogHeader className="mt-6 items-center gap-2">
            <Badge className="h-auto border-0 bg-transparent p-0 text-[11px] font-bold tracking-[0.12em] text-secondary uppercase hover:bg-transparent">
              Application Dispatched
            </Badge>
            <DialogTitle className="text-xl font-bold tracking-tight sm:text-2xl">
              Profile Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="max-w-sm text-sm leading-relaxed">
              Your credentials and PMDC record have been transmitted to the
              MediConnect Clinical Audit Desk for regulatory clearance.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 rounded-xl border border-primary/10 bg-indigo-50/70 p-4 text-left">
            <dl className="space-y-3">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-start gap-4 text-sm"
                >
                  <dt className="text-muted-foreground">{detail.label}</dt>
                  <dd className="flex items-center justify-end gap-1.5 text-right font-semibold text-foreground">
                    {detail.verified ? (
                      <ShieldCheck
                        className="size-3.5 shrink-0 text-secondary"
                        aria-hidden="true"
                      />
                    ) : null}
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 flex-col gap-3 border-t bg-slate-50 px-6 py-5 sm:flex-col sm:px-8">
          <Button
            type="button"
            size="lg"
            className="h-11 w-full shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
            onClick={onContinue}
          >
            Go to Doctor Dashboard
            <LayoutDashboard aria-hidden="true" />
          </Button>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            You will receive notifications when document verification is
            complete.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
