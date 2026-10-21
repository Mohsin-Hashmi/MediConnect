import { format } from "date-fns";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  MessageSquareReply,
  Video,
} from "lucide-react";

import { StarRating } from "@/components/dashboard/reviews/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ReviewCardProps } from "@/types/review";

export function ReviewCard({ review, onReply }: ReviewCardProps) {
  const initials = review.patientLabel
    .replace("Patient ", "")
    .slice(0, 2)
    .toUpperCase();
  const ConsultationIcon =
    review.consultationType === "video" ? Video : Building2;

  return (
    <Card className="gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="font-semibold">{review.patientLabel}</p>
                {review.verifiedPatient ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Verified patient
                  </span>
                ) : null}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ConsultationIcon className="size-3.5" aria-hidden="true" />
                  {review.consultationType === "video"
                    ? "Video consultation"
                    : "In-person consultation"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {format(
                    new Date(`${review.consultationDate}T00:00:00`),
                    "d MMM yyyy",
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 sm:text-right">
            <StarRating rating={review.rating} showValue />
            <p className="mt-1 text-xs text-muted-foreground">
              Submitted {format(new Date(review.submittedAt), "d MMM yyyy")}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-700">
          “{review.comment}”
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-medium">
            {review.service}
          </Badge>
          {review.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="font-normal text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {review.doctorReply ? (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-blue-900">
                Your response
              </p>
              <span className="text-xs text-blue-700">
                {format(new Date(review.doctorReply.repliedAt), "d MMM yyyy")}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-6 text-slate-700">
              {review.doctorReply.message}
            </p>
          </div>
        ) : (
          <div className="mt-4 flex justify-end border-t pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-9 px-4"
              onClick={() => onReply(review)}
            >
              <MessageSquareReply className="size-4" aria-hidden="true" />
              Reply to patient
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
