import { BellRing, Mail } from "lucide-react";

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
import type {
  NotificationDigest,
  SettingsSectionProps,
} from "@/types/settings";

export function NotificationSettings({ formik }: SettingsSectionProps) {
  return (
    <Card
      id="notifications"
      className="scroll-mt-24 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90"
    >
      <CardHeader className="border-b px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <BellRing className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Notification preferences</CardTitle>
            <CardDescription className="mt-1">
              Choose which workspace events should reach you outside the
              activity center.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-5 py-5 sm:px-6">
        <div>
          <h3 className="text-sm font-semibold">Delivery channels</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            In-app activity remains available in the Notifications page.
          </p>
          <div className="mt-5 divide-y rounded-xl border border-slate-200 px-4 sm:px-5">
            <SettingsToggleRow
              id="in-app-notifications"
              title="In-app notifications"
              description="Show important activity inside your doctor workspace."
              checked
              disabled
              badge="Always on"
              onCheckedChange={() => undefined}
            />
            <SettingsToggleRow
              id="email-notifications"
              title="Email notifications"
              description="Receive selected appointment and practice updates by email."
              checked={formik.values.emailNotifications}
              badge="API required"
              onCheckedChange={(checked) =>
                void formik.setFieldValue("emailNotifications", checked)
              }
            />
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4.5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Email delivery timing</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose immediate delivery or a grouped digest once email
                delivery is connected.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification-digest">Delivery frequency</Label>
            <Select
              items={{
                immediate: "Immediately",
                daily: "Daily digest",
                weekly: "Weekly digest",
              }}
              value={formik.values.notificationDigest}
              onValueChange={(value) =>
                void formik.setFieldValue(
                  "notificationDigest",
                  (value ?? "immediate") as NotificationDigest,
                )
              }
              disabled={!formik.values.emailNotifications}
            >
              <SelectTrigger
                id="notification-digest"
                className="h-10 w-full bg-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                sideOffset={6}
              >
                <SelectItem value="immediate">Immediately</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold">Activity types</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Control the events included in external notification delivery.
          </p>
          <div className="mt-5 divide-y rounded-xl border border-slate-200 px-4 sm:px-5">
            <SettingsToggleRow
              id="appointment-requests"
              title="New appointment requests"
              description="A patient books an available consultation slot."
              checked={formik.values.appointmentRequests}
              onCheckedChange={(checked) =>
                void formik.setFieldValue("appointmentRequests", checked)
              }
            />
            <SettingsToggleRow
              id="appointment-cancellations"
              title="Appointment cancellations"
              description="A patient cancels an upcoming consultation."
              checked={formik.values.appointmentCancellations}
              onCheckedChange={(checked) =>
                void formik.setFieldValue("appointmentCancellations", checked)
              }
            />
            <SettingsToggleRow
              id="consultation-reminders"
              title="Consultation reminders"
              description="Receive an alert before a confirmed appointment begins."
              checked={formik.values.consultationReminders}
              onCheckedChange={(checked) =>
                void formik.setFieldValue("consultationReminders", checked)
              }
            />
            <SettingsToggleRow
              id="patient-messages"
              title="Patient messages"
              description="A connected patient sends a new appointment-related message."
              checked={formik.values.patientMessages}
              badge="Messaging API required"
              onCheckedChange={(checked) =>
                void formik.setFieldValue("patientMessages", checked)
              }
            />
            <SettingsToggleRow
              id="patient-reviews"
              title="Patient reviews"
              description="A patient submits feedback after an eligible consultation."
              checked={formik.values.patientReviews}
              badge="Reviews API required"
              onCheckedChange={(checked) =>
                void formik.setFieldValue("patientReviews", checked)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
