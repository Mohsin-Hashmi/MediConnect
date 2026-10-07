import {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  MessageSquareText,
  Settings2,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";

export const DASHBOARD_NAVIGATION = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        label: "Appointments",
        href: "/dashboard/appointments",
        icon: ClipboardList,
      },
      { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { label: "Patients", href: "/dashboard/patients", icon: UsersRound },
      { label: "Availability", href: "/dashboard/availability", icon: Clock3 },
    ],
  },
  {
    label: "Practice",
    items: [
      { label: "Doctor Profile", href: "/dashboard/profile", icon: UserRound },
      { label: "Reviews", href: "/dashboard/reviews", icon: Star },
      {
        label: "Earnings",
        href: "/dashboard/earnings",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        label: "Messages",
        href: "/dashboard/messages",
        icon: MessageSquareText,
      },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
    ],
  },
] as const;

export const DASHBOARD_MODULES = [
  { slug: "appointments", title: "Appointments", icon: ClipboardList },
  { slug: "calendar", title: "Calendar", icon: CalendarDays },
  { slug: "patients", title: "Patients", icon: UsersRound },
  { slug: "availability", title: "Availability", icon: Clock3 },
  { slug: "profile", title: "Doctor Profile", icon: UserRound },
  { slug: "reviews", title: "Reviews", icon: Star },
  { slug: "earnings", title: "Earnings", icon: ChartNoAxesCombined },
  { slug: "messages", title: "Messages", icon: MessageSquareText },
  { slug: "notifications", title: "Notifications", icon: Bell },
  { slug: "settings", title: "Settings", icon: Settings2 },
] as const;
