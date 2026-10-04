"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  PROFESSIONAL_INFO_STORAGE_KEY,
  REVIEW_SUBMISSION_STORAGE_KEY,
} from "@/constants/onboarding";
import { PRACTICE_PROFILE_STORAGE_KEY } from "@/constants/practice-profile";
import { QUALIFICATIONS_STORAGE_KEY } from "@/constants/qualification";
import { reviewSubmitSchema } from "@/schemas/doctor-onboarding.schema";
import type { DoctorProfessionalInfoFormValues } from "@/types/professional-info";
import type { Qualification } from "@/types/qualification";
import type { StoredDoctorPracticeProfile } from "@/types/practice-profile";
import type {
  DoctorReviewData,
  ReviewSubmitFormValues,
} from "@/types/review-submit";
import {
  getStoredProfileImageDataUrl,
  PROFILE_IMAGE_QUERY_KEY,
} from "@/lib/profile-image-storage";

const subscribeToSessionStorage = () => () => {};

function useSessionStorageValue(key: string) {
  return useSyncExternalStore(
    subscribeToSessionStorage,
    () => window.sessionStorage.getItem(key),
    () => null,
  );
}

function parseStoredValue<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function useDoctorReview() {
  const { data: profileImagePreview = "" } = useQuery({
    queryKey: PROFILE_IMAGE_QUERY_KEY,
    queryFn: getStoredProfileImageDataUrl,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const professionalValue = useSessionStorageValue(
    PROFESSIONAL_INFO_STORAGE_KEY,
  );
  const qualificationsValue = useSessionStorageValue(
    QUALIFICATIONS_STORAGE_KEY,
  );
  const practiceProfileValue = useSessionStorageValue(
    PRACTICE_PROFILE_STORAGE_KEY,
  );

  const reviewData = useMemo<DoctorReviewData>(
    () => ({
      professional: parseStoredValue<DoctorProfessionalInfoFormValues | null>(
        professionalValue,
        null,
      ),
      qualifications: parseStoredValue<Qualification[]>(
        qualificationsValue,
        [],
      ),
      practiceProfile: parseStoredValue<StoredDoctorPracticeProfile | null>(
        practiceProfileValue,
        null,
      ),
    }),
    [practiceProfileValue, professionalValue, qualificationsValue],
  );

  const formik = useFormik<ReviewSubmitFormValues>({
    initialValues: { confirmed: false },
    validationSchema: reviewSubmitSchema,
    onSubmit: (values, helpers) => {
      window.sessionStorage.setItem(
        REVIEW_SUBMISSION_STORAGE_KEY,
        JSON.stringify({
          ...reviewData,
          confirmed: values.confirmed,
          submittedAt: new Date().toISOString(),
        }),
      );
      toast.success("Profile submitted for regulatory verification.");
      helpers.setSubmitting(false);
    },
  });

  const saveDraft = () => {
    window.sessionStorage.setItem(
      REVIEW_SUBMISSION_STORAGE_KEY,
      JSON.stringify({
        ...reviewData,
        confirmed: formik.values.confirmed,
        savedAt: new Date().toISOString(),
      }),
    );
    toast.success("Review draft saved on this device.");
  };

  return { formik, reviewData, profileImagePreview, saveDraft };
}
