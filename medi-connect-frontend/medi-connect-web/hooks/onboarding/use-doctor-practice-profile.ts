"use client";

import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";

import {
  INITIAL_PRACTICE_PROFILE,
  PRACTICE_PROFILE_STORAGE_KEY,
} from "@/constants/practice-profile";
import { practiceProfileSchema } from "@/schemas/doctor-onboarding.schema";
import type {
  DoctorPracticeProfile,
  StoredDoctorPracticeProfile,
} from "@/types/practice-profile";
import {
  deleteStoredProfileImage,
  getStoredProfileImageDataUrl,
  PROFILE_IMAGE_QUERY_KEY,
  saveStoredProfileImage,
} from "@/lib/profile-image-storage";
import { writeSessionStorage } from "@/lib/session-storage";
import { useSessionStorageValue } from "@/hooks/use-session-storage-value";

export function useDoctorPracticeProfile(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [storedProfileImageName, setStoredProfileImageName] = useState<
    string | null
  >(null);
  const previewUrlRef = useRef<string | null>(null);
  const savedProfile =
    useSessionStorageValue<StoredDoctorPracticeProfile>(
      PRACTICE_PROFILE_STORAGE_KEY,
    );
  const restoredProfile = savedProfile
    ? {
        hospitalAffiliation: savedProfile.hospitalAffiliation,
        consultationFee: savedProfile.consultationFee,
        profileImage: null,
        biography: savedProfile.biography,
      }
    : null;
  const initialValues =
    restoredProfile && practiceProfileSchema.isValidSync(restoredProfile)
      ? restoredProfile
      : INITIAL_PRACTICE_PROFILE;


      
  const formik = useFormik<DoctorPracticeProfile>({
    initialValues,
    enableReinitialize: true,
    validationSchema: practiceProfileSchema,
    onSubmit: async (values, helpers) => {
      try {
        if (values.profileImage) {
          await saveStoredProfileImage(values.profileImage);
          await queryClient.invalidateQueries({
            queryKey: PROFILE_IMAGE_QUERY_KEY,
          });
        }

        const profileImageName =
          values.profileImage?.name ??
          storedProfileImageName ??
          savedProfile?.profileImageName ??
          null;

        writeSessionStorage<StoredDoctorPracticeProfile>(
          PRACTICE_PROFILE_STORAGE_KEY,
          {
            hospitalAffiliation: values.hospitalAffiliation.trim(),
            consultationFee: values.consultationFee,
            profileImageName,
            biography: values.biography.trim(),
          },
        );
        setStoredProfileImageName(profileImageName);
        helpers.setStatus("Practice details saved.");
        onSuccess?.();
      } catch {
        helpers.setStatus(
          "The profile image could not be saved. Please select it again.",
        );
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    let isCancelled = false;

    if (savedProfile?.profileImageName) {
      void getStoredProfileImageDataUrl()
        .then((savedPreview) => {
          if (!isCancelled && savedPreview) {
            setProfileImagePreview(savedPreview);
            setStoredProfileImageName(savedProfile.profileImageName);
          }
        })
        .catch(() => {
          // Keep the remaining draft data when the optional image is unavailable.
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [savedProfile?.profileImageName]);

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
    if (!file) return;

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setProfileImagePreview(previewUrl);
    void formik.setFieldValue("profileImage", file);
    void formik.setFieldTouched("profileImage", true, false);
    formik.setStatus("");
  };

  const removeProfileImage = async () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setProfileImagePreview("");
    setStoredProfileImageName(null);
    await formik.setFieldValue("profileImage", null);
    await deleteStoredProfileImage();
    await queryClient.invalidateQueries({ queryKey: PROFILE_IMAGE_QUERY_KEY });

    if (savedProfile) {
      writeSessionStorage<StoredDoctorPracticeProfile>(
        PRACTICE_PROFILE_STORAGE_KEY,
        { ...savedProfile, profileImageName: null },
      );
    }

    formik.setStatus("");
  };

  return {
    formik,
    profile: formik.values,
    message: typeof formik.status === "string" ? formik.status : "",
    profileImagePreview,
    updateProfile,
    updateProfileImage,
    removeProfileImage,
  };
}
