import { format } from "date-fns";

import { DashboardPageHeader } from "@/components/common/dashboard-page-header";
import { PdfExportButton } from "@/components/common/pdf-export-button";
import type { ReviewsPageHeaderProps } from "@/types/review";

export function ReviewsPageHeader({ reviews }: ReviewsPageHeaderProps) {
  return (
    <DashboardPageHeader
      title="Patient reviews & ratings"
      description="Review patient feedback and identify opportunities to improve the care experience."
      actions={
        <PdfExportButton
          title="MediConnect patient reviews"
          subtitle={`${reviews.length} reviews from the current page`}
          filename="mediconnect-patient-reviews"
          label="Export reviews"
          headers={[
            "Patient",
            "Rating",
            "Appointment reason",
            "Submitted",
            "Feedback",
          ]}
          rows={reviews.map((review) => [
            review.patient?.name ?? "Patient unavailable",
            `${review.review.rating} / 5`,
            review.appointment?.reason ?? "No reason provided",
            format(new Date(review.review.createdAt), "d MMM yyyy"),
            review.review.comment,
          ])}
        />
      }
    />
  );
}
