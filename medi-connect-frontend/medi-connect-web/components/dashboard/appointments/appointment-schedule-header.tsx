import { CalendarDays } from "lucide-react";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APPOINTMENTS_DEMO_DATE } from "@/data/mock/appointments";
import { formatAppointmentDate } from "@/lib/appointment-format";
import type {
  AppointmentScheduleHeaderProps,
  AppointmentTab,
} from "@/types/appointment";

const appointmentTabs: AppointmentTab[] = [
  "all",
  "upcoming",
  "today",
  "completed",
  "cancelled",
];

export function AppointmentScheduleHeader({
  matchingCount,
  tab,
  tabCounts,
  onTabChange,
}: AppointmentScheduleHeaderProps) {
  return (
    <CardHeader className="gap-0 border-b px-5 pt-5 pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div>
          <CardTitle className="font-semibold">Appointment schedule</CardTitle>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            Sample day: {formatAppointmentDate(APPOINTMENTS_DEMO_DATE)}
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {matchingCount} matching appointments
        </span>
      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => onTabChange(value as AppointmentTab)}
      >
        <div className="overflow-x-auto">
          <TabsList variant="line" className="h-11 gap-1 p-0">
            {appointmentTabs.map((item) => (
              <TabsTrigger
                key={item}
                value={item}
                className="h-10 min-w-fit gap-2 px-3 text-sm capitalize data-active:text-primary data-active:after:bg-primary"
              >
                {item === "today" ? "Demo day" : item}
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] tabular-nums text-muted-foreground">
                  {tabCounts[item]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </CardHeader>
  );
}
