import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  UsersRound,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardAppointment } from "@/types/doctor-dashboard";

const quickActions = [
  { label: "Add availability slot", href: "/dashboard/availability", icon: Clock3 },
  { label: "View patient directory", href: "/dashboard/patients", icon: UsersRound },
  { label: "Open full calendar", href: "/dashboard/calendar", icon: CalendarDays },
] as const;

export function DashboardSidePanels({
  nextAppointment,
}: {
  nextAppointment: DashboardAppointment | undefined;
}) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-1">
      <Card className="gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <div className="h-1 bg-primary" aria-hidden="true" />
        <CardHeader className="flex flex-row items-center justify-between gap-2 px-5 pt-4 pb-3">
          <CardTitle className="font-semibold">Next Appointment</CardTitle>
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            Sample
          </Badge>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {nextAppointment ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="size-11">
                  <AvatarFallback className="bg-blue-100 text-xs font-semibold text-primary">
                    {nextAppointment.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{nextAppointment.patientName}</p>
                  <p className="truncate text-xs text-muted-foreground">{nextAppointment.reason}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-primary" aria-hidden="true" />
                  {nextAppointment.time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  {nextAppointment.visitType === "Video" ? (
                    <Video className="size-3.5 text-primary" aria-hidden="true" />
                  ) : (
                    <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                  )}
                  {nextAppointment.visitType}
                </span>
              </div>
              <div className="mt-5 border-t pt-4">
                <Button
                  render={<Link href="/dashboard/appointments" />}
                  className="h-10 w-full px-4 text-sm"
                >
                  View appointment
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No sample appointment selected.</p>
          )}
        </CardContent>
      </Card>

      <Card className="gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <CardHeader className="px-5 pt-4 pb-3">
          <CardTitle className="font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/85 outline-none transition-colors hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon className="size-4 text-primary" aria-hidden="true" />
              <span className="flex-1">{label}</span>
              <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
