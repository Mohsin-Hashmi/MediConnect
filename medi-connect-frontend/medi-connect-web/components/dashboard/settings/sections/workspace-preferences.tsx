import { CalendarClock, Clock3, Globe2, MonitorCog } from "lucide-react";

import { SettingsToggleRow } from "@/components/dashboard/settings/settings-toggle-row";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SETTINGS_BOOKING_NOTICE_OPTIONS,
  SETTINGS_BUFFER_OPTIONS,
  SETTINGS_DURATION_OPTIONS,
  SETTINGS_TIMEZONE_OPTIONS,
} from "@/constants/settings";
import type {
  SettingsSectionProps,
  SettingsTheme,
  SettingsTimeFormat,
  SettingsWeekStart,
} from "@/types/settings";

export function WorkspacePreferences({ formik }: SettingsSectionProps) {
  return (
    <Card
      id="workspace"
      className="scroll-mt-24 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90"
    >
      <CardHeader className="border-b px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CalendarClock className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Workspace preferences</CardTitle>
            <CardDescription className="mt-1">
              Set scheduling defaults and regional display preferences for your workspace.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-7 px-5 py-5 sm:px-6">
        <div>
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold">Scheduling defaults</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Use these values as starting points when publishing new availability.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="default-duration">Default appointment duration</Label>
              <Select
                items={SETTINGS_DURATION_OPTIONS}
                value={formik.values.defaultDuration}
                onValueChange={(value) =>
                  void formik.setFieldValue("defaultDuration", value ?? "30")
                }
              >
                <SelectTrigger id="default-duration" className="h-11 w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false} sideOffset={6}>
                  {Object.entries(SETTINGS_DURATION_OPTIONS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buffer-time">Buffer between patients</Label>
              <Select
                items={SETTINGS_BUFFER_OPTIONS}
                value={formik.values.bufferTime}
                onValueChange={(value) =>
                  void formik.setFieldValue("bufferTime", value ?? "10")
                }
              >
                <SelectTrigger id="buffer-time" className="h-11 w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false} sideOffset={6}>
                  {Object.entries(SETTINGS_BUFFER_OPTIONS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2 xl:col-span-1">
              <Label htmlFor="booking-notice">Minimum booking notice</Label>
              <Select
                items={SETTINGS_BOOKING_NOTICE_OPTIONS}
                value={formik.values.minimumBookingNotice}
                onValueChange={(value) =>
                  void formik.setFieldValue("minimumBookingNotice", value ?? "2")
                }
              >
                <SelectTrigger id="booking-notice" className="h-11 w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false} sideOffset={6}>
                  {Object.entries(SETTINGS_BOOKING_NOTICE_OPTIONS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 px-4 sm:px-5">
            <SettingsToggleRow
              id="auto-confirm-appointments"
              title="Automatically confirm appointments"
              description="Confirm new bookings without a separate doctor review. Server-side eligibility rules will still apply."
              checked={formik.values.autoConfirmAppointments}
              badge="Backend rule required"
              onCheckedChange={(checked) =>
                void formik.setFieldValue("autoConfirmAppointments", checked)
              }
            />
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-start gap-3">
            <Globe2 className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold">Regional preferences</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Control how dates and times are presented throughout the doctor portal.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="settings-timezone">Timezone</Label>
              <Select
                items={SETTINGS_TIMEZONE_OPTIONS}
                value={formik.values.timezone}
                onValueChange={(value) =>
                  void formik.setFieldValue("timezone", value ?? "Asia/Karachi")
                }
              >
                <SelectTrigger id="settings-timezone" className="h-11 w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false} sideOffset={6}>
                  {Object.entries(SETTINGS_TIMEZONE_OPTIONS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Timezone persistence requires a scheduling contract update before API integration.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-format">Time format</Label>
              <Select
                items={{ "12-hour": "12-hour (9:30 AM)", "24-hour": "24-hour (09:30)" }}
                value={formik.values.timeFormat}
                onValueChange={(value) =>
                  void formik.setFieldValue(
                    "timeFormat",
                    (value ?? "12-hour") as SettingsTimeFormat,
                  )
                }
              >
                <SelectTrigger id="time-format" className="h-11 w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false} sideOffset={6}>
                  <SelectItem value="12-hour">12-hour (9:30 AM)</SelectItem>
                  <SelectItem value="24-hour">24-hour (09:30)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="week-start">Week starts on</Label>
              <Select
                items={{ monday: "Monday", sunday: "Sunday" }}
                value={formik.values.weekStartsOn}
                onValueChange={(value) =>
                  void formik.setFieldValue(
                    "weekStartsOn",
                    (value ?? "monday") as SettingsWeekStart,
                  )
                }
              >
                <SelectTrigger id="week-start" className="h-11 w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false} sideOffset={6}>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-start gap-3">
            <MonitorCog className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold">Appearance</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose the preferred interface appearance for your workspace.
              </p>
            </div>
          </div>
          <div className="mt-5 max-w-sm space-y-2">
            <Label htmlFor="settings-theme">Color theme</Label>
            <Select
              items={{ light: "Light", dark: "Dark", system: "Use system setting" }}
              value={formik.values.theme}
              onValueChange={(value) =>
                void formik.setFieldValue(
                  "theme",
                  (value ?? "light") as SettingsTheme,
                )
              }
            >
              <SelectTrigger id="settings-theme" className="h-11 w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false} sideOffset={6}>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">Use system setting</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Theme selection will be activated when the application theme provider is connected.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
