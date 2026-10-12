import { Clock3, Settings2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { BookingSettingsProps } from "@/types/availability";

export function BookingSettings({ values, onChange }: BookingSettingsProps) {
  return (
    <Card className="gap-0 border border-slate-200 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
              <Settings2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold">
                Booking preferences
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Control your weekly booking defaults.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Label htmlFor="accepting-appointments" className="cursor-pointer text-sm font-medium text-slate-700">
              {values.acceptingAppointments
                ? "Accepting new appointments"
                : "New appointments paused"}
            </Label>
            <Switch
              id="accepting-appointments"
              checked={values.acceptingAppointments}
              onCheckedChange={(checked) =>
                onChange("acceptingAppointments", checked)
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid max-w-4xl gap-x-5 gap-y-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium text-slate-800">Consultation duration</Label>
          <Select
            value={String(values.durationMinutes)}
            onValueChange={(value) =>
              onChange("durationMinutes", Number(value))
            }
          >
            <SelectTrigger
              id="duration"
              className="h-11 w-full border-slate-300 bg-white px-3 text-sm font-medium text-slate-800"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="start"
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={8}
              className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
            >
              {[15, 20, 30, 45, 60].map((minutes) => (
                <SelectItem key={minutes} value={String(minutes)} className="min-h-10 rounded-lg py-2 pr-9 pl-3 text-sm data-selected:bg-blue-50 data-selected:text-primary">
                  {minutes} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Used to estimate the number of consultations in each time range.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="buffer" className="text-sm font-medium text-slate-800">Time between patients</Label>
          <Select
            value={String(values.bufferMinutes)}
            onValueChange={(value) => onChange("bufferMinutes", Number(value))}
          >
            <SelectTrigger
              id="buffer"
              className="h-11 w-full border-slate-300 bg-white px-3 text-sm font-medium text-slate-800"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="start"
              alignItemWithTrigger={false}
              side="bottom"
              sideOffset={8}
              className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
            >
              {[0, 5, 10, 15, 20, 30].map((minutes) => (
                <SelectItem key={minutes} value={String(minutes)} className="min-h-10 rounded-lg py-2 pr-9 pl-3 text-sm data-selected:bg-blue-50 data-selected:text-primary">
                  {minutes === 0 ? "No buffer" : `${minutes} minutes`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
            <Clock3 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Extra time between consecutive consultations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
