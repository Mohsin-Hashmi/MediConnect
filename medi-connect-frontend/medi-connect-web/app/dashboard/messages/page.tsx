import type { Metadata } from "next";

import { MessagesPage } from "@/components/dashboard/messages/messages-page";

export const metadata: Metadata = {
  title: "Messages",
  description: "Review appointment-related patient conversations.",
};

export default function MessagesRoute() {
  return <MessagesPage />;
}
