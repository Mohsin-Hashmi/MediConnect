"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  PROFESSIONAL_INFO_STORAGE_KEY,
  REVIEW_SUBMISSION_STORAGE_KEY,
} from "@/constants/onboarding";
import { PRACTICE_PROFILE_STORAGE_KEY } from "@/constants/practice-profile";
import { QUALIFICATIONS_STORAGE_KEY } from "@/constants/qualification";
import { useSessionStorageValue } from "@/hooks/use-session-storage-value";
import { writeSessionStorage } from "@/lib/session-storage";
import type { DoctorProfessionalInfoFormValues } from "@/types/professional-info";
import type { Qualification } from "@/types/qualification";
import type { StoredDoctorPracticeProfile } from "@/types/practice-profile";
import type { DoctorReviewData } from "@/types/review-submit";
import {
  getStoredProfileImageDataUrl,
  PROFILE_IMAGE_QUERY_KEY,
} from "@/lib/profile-image-storage";

export function useDoctorReview() {
  const { data: profileImagePreview = "" } = useQuery({
    queryKey: PROFILE_IMAGE_QUERY_KEY,
    queryFn: getStoredProfileImageDataUrl,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const professionalValue =
    useSessionStorageValue<DoctorProfessionalInfoFormValues>(
      PROFESSIONAL_INFO_STORAGE_KEY,
    );
  const qualificationsValue = useSessionStorageValue<Qualification[]>(
    QUALIFICATIONS_STORAGE_KEY,
  );
  const practiceProfileValue =
    useSessionStorageValue<StoredDoctorPracticeProfile>(
      PRACTICE_PROFILE_STORAGE_KEY,
    );

  const reviewData = useMemo<DoctorReviewData>(
    () => ({
      professional: professionalValue,
      qualifications: Array.isArray(qualificationsValue)
        ? qualificationsValue
        : [],
      practiceProfile: practiceProfileValue,
    }),
    [practiceProfileValue, professionalValue, qualificationsValue],
  );

  const saveDraft = (confirmed: boolean) => {
    writeSessionStorage(
      REVIEW_SUBMISSION_STORAGE_KEY,
      {
        ...reviewData,
        confirmed,
        savedAt: new Date().toISOString(),
      },
    );
    toast.success("Review draft saved on this device.");
  };

  return { reviewData, profileImagePreview, saveDraft };
}
