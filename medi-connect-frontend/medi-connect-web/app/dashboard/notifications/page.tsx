import type { Metadata } from "next";

import { NotificationsPage } from "@/components/dashboard/notifications/notifications-page";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Review important doctor workspace activity.",
};

export default function NotificationsRoute() {
  return <NotificationsPage />;
}
