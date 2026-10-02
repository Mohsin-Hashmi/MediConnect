"use client";

import { useFormik } from "formik";

import {
  INITIAL_PRACTICE_PROFILE,
  PRACTICE_PROFILE_STORAGE_KEY,
} from "@/constants/practice-profile";
import { practiceProfileSchema } from "@/schemas/doctor-onboarding.schema";
import type { DoctorPracticeProfile } from "@/types/practice-profile";

export function useDoctorPracticeProfile() {
  const formik = useFormik<DoctorPracticeProfile>({
    initialValues: INITIAL_PRACTICE_PROFILE,
    validationSchema: practiceProfileSchema,
    onSubmit: (values, helpers) => {
      window.sessionStorage.setItem(
        PRACTICE_PROFILE_STORAGE_KEY,
        JSON.stringify({
          hospitalAffiliation: values.hospitalAffiliation.trim(),
          consultationFee: values.consultationFee,
          biography: values.biography.trim(),
        }),
      );
      helpers.setStatus(
        "Practice details saved. Review & Submit will be connected next.",
      );
      helpers.setSubmitting(false);
    },
  });

  const updateProfile = <Field extends keyof DoctorPracticeProfile>(
    field: Field,
    value: DoctorPracticeProfile[Field],
  ) => {
    void formik.setFieldValue(field, value);
    formik.setStatus("");
  };

  return {
    formik,
    profile: formik.values,
    message: typeof formik.status === "string" ? formik.status : "",
    updateProfile,
  };
}
