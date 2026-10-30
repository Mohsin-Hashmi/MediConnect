import {
  BellRing,
  CalendarClock,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import type { SettingsNavigationItem } from "@/types/settings";

export const SETTINGS_NAVIGATION: readonly SettingsNavigationItem[] = [
  {
    id: "account",
    label: "Account & security",
    description: "Identity and sign-in",
    icon: ShieldCheck,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Updates and reminders",
    icon: BellRing,
  },
  {
    id: "workspace",
    label: "Workspace preferences",
    description: "Scheduling and regional",
    icon: CalendarClock,
  },
  {
    id: "account-management",
    label: "Account management",
    description: "Data and deletion",
    icon: Trash2,
  },
];

export const SETTINGS_DURATION_OPTIONS = {
  "15": "15 minutes",
  "20": "20 minutes",
  "30": "30 minutes",
  "45": "45 minutes",
  "60": "60 minutes",
} as const;

export const SETTINGS_BUFFER_OPTIONS = {
  "0": "No buffer",
  "5": "5 minutes",
  "10": "10 minutes",
  "15": "15 minutes",
  "30": "30 minutes",
} as const;

export const SETTINGS_BOOKING_NOTICE_OPTIONS = {
  "1": "1 hour",
  "2": "2 hours",
  "6": "6 hours",
  "12": "12 hours",
  "24": "24 hours",
} as const;

export const SETTINGS_TIMEZONE_OPTIONS = {
  "Asia/Karachi": "Pakistan Standard Time (UTC+05:00)",
  UTC: "Coordinated Universal Time (UTC)",
} as const;
