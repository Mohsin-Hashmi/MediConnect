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
          subtitle={`${reviews.length} filtered reviews from the current preview`}
          filename="mediconnect-patient-reviews"
          label="Export reviews"
          headers={[
            "Patient",
            "Rating",
            "Consultation",
            "Submitted",
            "Feedback",
          ]}
          rows={reviews.map((review) => [
            review.patientLabel,
            `${review.rating} / 5`,
            `${review.service} (${review.consultationType})`,
            format(new Date(review.submittedAt), "d MMM yyyy"),
            review.comment,
          ])}
        />
      }
    />
  );
}
