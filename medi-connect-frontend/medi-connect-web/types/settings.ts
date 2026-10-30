import type { FormikProps } from "formik";
import type { LucideIcon } from "lucide-react";

export type SettingsSectionId =
  | "account"
  | "notifications"
  | "workspace"
  | "account-management";

export type SettingsTheme = "light" | "dark" | "system";
export type SettingsTimeFormat = "12-hour" | "24-hour";
export type SettingsWeekStart = "monday" | "sunday";
export type NotificationDigest = "immediate" | "daily" | "weekly";

export interface SettingsFormValues {
  emailNotifications: boolean;
  appointmentRequests: boolean;
  appointmentCancellations: boolean;
  consultationReminders: boolean;
  patientMessages: boolean;
  patientReviews: boolean;
  notificationDigest: NotificationDigest;
  defaultDuration: string;
  bufferTime: string;
  minimumBookingNotice: string;
  autoConfirmAppointments: boolean;
  timezone: string;
  timeFormat: SettingsTimeFormat;
  weekStartsOn: SettingsWeekStart;
  theme: SettingsTheme;
}

export interface SettingsAccountSummary {
  name: string;
  email: string;
  initials: string;
  role: string;
  joinedAt: string;
}

export interface SettingsNavigationItem {
  id: SettingsSectionId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface SettingsNavigationProps {
  items: readonly SettingsNavigationItem[];
}

export interface SettingsSectionProps {
  formik: FormikProps<SettingsFormValues>;
  onPreviewAction: (message: string) => void;
}

export interface AccountSecuritySettingsProps {
  account: SettingsAccountSummary;
  onPreviewAction: (message: string) => void;
}

export interface AccountManagementSettingsProps {
  onExport: () => void;
  onDelete: () => void;
}

export interface SettingsToggleRowProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onCheckedChange: (checked: boolean) => void;
}
