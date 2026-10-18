import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WeeklyActivityChart } from "@/components/dashboard/doctor-dashboard/overview/weekly-activity-chart";
import { getWeeklyAppointmentActivity } from "@/lib/doctor-dashboard";
import type { DashboardActivityPanelsProps } from "@/types/doctor-dashboard";

export function DashboardActivityPanels({
  appointments,
}: DashboardActivityPanelsProps) {
  const weeklyActivity = getWeeklyAppointmentActivity(appointments);

  return (
    <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
      <CardHeader className="px-5 pt-5 pb-2">
        <CardTitle className="font-semibold">Weekly Overview</CardTitle>
        <CardDescription className="text-xs">
          Current appointment activity by status
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-5 sm:px-5">
        <WeeklyActivityChart activity={weeklyActivity} />
      </CardContent>
    </Card>
  );
}
