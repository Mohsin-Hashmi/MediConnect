import { format } from "date-fns";
import {
  Building2,
  CalendarClock,
  Hash,
  MessageSquareLock,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { PatientMessageContextProps } from "@/types/message";

export function PatientMessageContext({
  conversation,
}: PatientMessageContextProps) {
  const { participant, context } = conversation;
  const ConsultationIcon =
    context.consultationType === "video" ? Video : Building2;

  return (
    <aside
      className="h-full min-h-0 overflow-y-auto border-l bg-white"
      aria-label="Conversation context"
    >
      <div className="border-b p-5 text-center">
        <Avatar className="mx-auto size-14">
          <AvatarFallback className="bg-blue-100 font-semibold text-blue-700">
            {participant.initials}
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-3 font-semibold">{participant.label}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Connected patient preview
        </p>
        <Badge
          variant="outline"
          className="mt-3 bg-emerald-50 text-emerald-700"
        >
          {context.totalConsultations} consultations
        </Badge>
      </div>

      <div className="border-b p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Appointment context
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex gap-3">
            <CalendarClock
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium">
                {format(
                  new Date(`${context.appointmentDate}T00:00:00`),
                  "EEEE, d MMM yyyy",
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {context.appointmentTime} · PKT
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <ConsultationIcon
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium">{context.service}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {context.consultationType.replace("-", " ")}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Hash
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium">Appointment reference</p>
              <p className="truncate text-xs text-muted-foreground">
                {context.appointmentReference}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <MessageSquareLock
            className="size-5 text-amber-700"
            aria-hidden="true"
          />
          <p className="mt-2 text-sm font-semibold text-amber-950">
            Messaging preview
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            Delivery, attachments, history retention, and emergency guidance
            require approved backend contracts before this workspace goes live.
          </p>
        </div>
      </div>
    </aside>
  );
}
