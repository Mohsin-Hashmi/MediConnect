import type {
  SettingsAccountSummary,
  SettingsFormValues,
} from "@/types/settings";

export const SETTINGS_ACCOUNT_FIXTURE: SettingsAccountSummary = {
  name: "Dr. Ayesha Rahman",
  email: "ayesha.rahman@example.test",
  initials: "AR",
  role: "Doctor account",
  joinedAt: "October 2026",
};

export const SETTINGS_INITIAL_VALUES: SettingsFormValues = {
  emailNotifications: true,
  appointmentRequests: true,
  appointmentCancellations: true,
  consultationReminders: true,
  patientMessages: true,
  patientReviews: false,
  notificationDigest: "immediate",
  defaultDuration: "30",
  bufferTime: "10",
  minimumBookingNotice: "2",
  autoConfirmAppointments: false,
  timezone: "Asia/Karachi",
  timeFormat: "12-hour",
  weekStartsOn: "monday",
  theme: "light",
};
