import * as Yup from "yup";

export const settingsSchema = Yup.object({
  emailNotifications: Yup.boolean().defined(),
  appointmentRequests: Yup.boolean().defined(),
  appointmentCancellations: Yup.boolean().defined(),
  consultationReminders: Yup.boolean().defined(),
  patientMessages: Yup.boolean().defined(),
  patientReviews: Yup.boolean().defined(),
  notificationDigest: Yup.string()
    .oneOf(["immediate", "daily", "weekly"])
    .required(),
  defaultDuration: Yup.string()
    .oneOf(["15", "20", "30", "45", "60"])
    .required(),
  bufferTime: Yup.string()
    .oneOf(["0", "5", "10", "15", "30"])
    .required(),
  minimumBookingNotice: Yup.string()
    .oneOf(["1", "2", "6", "12", "24"])
    .required(),
  autoConfirmAppointments: Yup.boolean().defined(),
  timezone: Yup.string().oneOf(["Asia/Karachi", "UTC"]).required(),
  timeFormat: Yup.string().oneOf(["12-hour", "24-hour"]).required(),
  weekStartsOn: Yup.string().oneOf(["monday", "sunday"]).required(),
  theme: Yup.string().oneOf(["light", "dark", "system"]).required(),
});
