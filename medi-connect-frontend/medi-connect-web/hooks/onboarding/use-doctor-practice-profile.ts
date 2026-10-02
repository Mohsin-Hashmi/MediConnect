"use client";

import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";

import {
  INITIAL_PRACTICE_PROFILE,
  PRACTICE_PROFILE_STORAGE_KEY,
} from "@/constants/practice-profile";
import { practiceProfileSchema } from "@/schemas/doctor-onboarding.schema";
import type { DoctorPracticeProfile } from "@/types/practice-profile";

export function useDoctorPracticeProfile() {
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const previewUrlRef = useRef<string | null>(null);
  const formik = useFormik<DoctorPracticeProfile>({
    initialValues: INITIAL_PRACTICE_PROFILE,
    validationSchema: practiceProfileSchema,
    onSubmit: (values, helpers) => {
      window.sessionStorage.setItem(
        PRACTICE_PROFILE_STORAGE_KEY,
        JSON.stringify({
          hospitalAffiliation: values.hospitalAffiliation.trim(),
          consultationFee: values.consultationFee,
          profileImageName: values.profileImage?.name ?? null,
          biography: values.biography.trim(),
        }),
      );
      helpers.setStatus(
        "Practice details saved. Review & Submit will be connected next.",
      );
      helpers.setSubmitting(false);
    },
  });

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const updateProfile = <Field extends keyof DoctorPracticeProfile>(
    field: Field,
    value: DoctorPracticeProfile[Field],
  ) => {
    void formik.setFieldValue(field, value);
    formik.setStatus("");
  };

  const updateProfileImage = (file: File | null) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    const previewUrl = file ? URL.createObjectURL(file) : "";
    previewUrlRef.current = previewUrl || null;
    setProfileImagePreview(previewUrl);
    void formik.setFieldValue("profileImage", file);
    void formik.setFieldTouched("profileImage", true, false);
    formik.setStatus("");
  };

  return {
    formik,
    profile: formik.values,
    message: typeof formik.status === "string" ? formik.status : "",
    profileImagePreview,
    updateProfile,
    updateProfileImage,
  };
}
