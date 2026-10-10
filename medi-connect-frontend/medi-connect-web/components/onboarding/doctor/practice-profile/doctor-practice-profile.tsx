"use client";

import { useRef } from "react";
import { Form, FormikProvider } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { DoctorOnboardingStepper } from "@/components/onboarding/doctor/shared/doctor-onboarding-stepper";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PRACTICE_BIOGRAPHY_MAX_LENGTH } from "@/constants/practice-profile";
import { useDoctorPracticeProfile } from "@/hooks/onboarding/use-doctor-practice-profile";
import { cn } from "@/lib/utils";

function OptionalBadge() {
  return (
    <Badge
      variant="secondary"
      className="h-auto rounded-md border-0 bg-indigo-50 px-2 py-1 text-[10px] font-semibold tracking-wide text-indigo-700 uppercase hover:bg-indigo-50"
    >
      Optional
    </Badge>
  );
}

export function DoctorPracticeProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    formik,
    profile,
    message,
    profileImagePreview,
    updateProfile,
    updateProfileImage,
    removeProfileImage,
  } = useDoctorPracticeProfile(() =>
    router.push("/onboarding/doctor/review-submit"),
  );
  const hospitalError =
    formik.touched.hospitalAffiliation && formik.errors.hospitalAffiliation;
  const feeError =
    formik.touched.consultationFee && formik.errors.consultationFee;
  const profileImageError =
    formik.touched.profileImage && formik.errors.profileImage;

  return (
    <main className="flex min-h-svh flex-col bg-[#f8f8ff]">
      <DoctorOnboardingStepper activeStep="practice-profile" />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-10">
        <Card className="relative gap-0 overflow-visible border-0 bg-white p-6 shadow-[0_20px_60px_rgba(30,41,59,0.1)] ring-1 ring-slate-200/80 sm:p-10">
          <div
            aria-hidden="true"
            className="absolute top-0 right-2 left-2 h-1 rounded bg-primary"
          />

          <CardHeader className="px-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge className="h-auto gap-1.5 border-0 bg-primary/10 px-3 py-1.5 text-xs font-bold tracking-wide text-primary uppercase hover:bg-primary/10">
                <span className="size-1.5 rounded-full bg-primary" />
                Step 3 of 3
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <ShieldCheck
                  className="size-4 text-secondary"
                  aria-hidden="true"
                />
                Practitioner Verification
              </span>
            </div>

            <CardTitle className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Practice details &amp; professional bio
            </CardTitle>
            <CardDescription className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Add your primary practice details to help patients understand your
              clinical setting. You can also include a short professional bio.
            </CardDescription>
          </CardHeader>

          <FormikProvider value={formik}>
          <Form className="mt-8" noValidate>
            <CardContent className="space-y-7 px-0">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor="hospital-affiliation" className="text-[15px]">
                    Primary Hospital or Clinic Affiliation
                    <span className="ml-1 text-destructive">*</span>
                  </Label>
                </div>
                <div className="relative">
                  <Building2
                    className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="hospital-affiliation"
                    value={profile.hospitalAffiliation}
                    onChange={(event) =>
                      updateProfile("hospitalAffiliation", event.target.value)
                    }
                    placeholder="e.g. Islamabad Medical Center, Shifa International Hospital"
                    className="h-12 bg-white pl-11 text-base md:text-base"
                    autoComplete="organization"
                    name="hospitalAffiliation"
                    onBlur={formik.handleBlur}
                    required
                    aria-invalid={Boolean(hospitalError)}
                    aria-describedby={hospitalError ? "hospital-affiliation-error" : "hospital-affiliation-help"}
                  />
                </div>
                {hospitalError ? (
                  <p id="hospital-affiliation-error" className="text-sm text-destructive">
                    {hospitalError}
                  </p>
                ) : null}
                <p
                  id="hospital-affiliation-help"
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  The primary clinical facility where you conduct in-person
                  consultations.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor="profile-image" className="text-[15px]">
                    Profile Image
                  </Label>
                  <OptionalBadge />
                </div>
                <div className="flex flex-col gap-5 rounded-xl border border-dashed border-primary/25 bg-primary/2.5 p-5 sm:flex-row sm:items-center">
                  <Avatar className="size-24 bg-white shadow-sm ring-4 ring-white">
                    {profileImagePreview ? (
                      <AvatarImage
                        src={profileImagePreview}
                        alt="Selected doctor profile preview"
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Camera className="size-8" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-3">
                    <Input
                      ref={fileInputRef}
                      id="profile-image"
                      name="profileImage"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) =>
                        updateProfileImage(event.currentTarget.files?.[0] ?? null)
                      }
                      onBlur={formik.handleBlur}
                      aria-invalid={Boolean(profileImageError)}
                      aria-describedby={
                        profileImageError
                          ? "profile-image-error"
                          : "profile-image-help"
                      }
                      className="h-12 cursor-pointer bg-white py-1.5 text-sm leading-8 file:mr-3 file:inline-flex file:h-8 file:items-center file:justify-center file:rounded-md file:bg-primary/10 file:px-4 file:py-0 file:leading-none file:text-primary"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p
                        id="profile-image-help"
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        JPEG, PNG, or WebP. Maximum file size is 5 MB.
                      </p>
                      {profileImagePreview ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            void removeProfileImage();
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          <Trash2 aria-hidden="true" />
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
                {profileImageError ? (
                  <p
                    id="profile-image-error"
                    className="text-sm font-medium text-destructive"
                  >
                    {profileImageError}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor="consultation-fee" className="text-[15px]">
                    Consultation Fee
                    <span className="ml-1 text-destructive">*</span>
                  </Label>
                </div>
                <InputGroup className="h-12 bg-white">
                  <InputGroupInput
                    id="consultation-fee"
                    type="number"
                    min={1}
                    step={100}
                    inputMode="numeric"
                    value={profile.consultationFee}
                    onChange={(event) =>
                      updateProfile("consultationFee", event.target.value)
                    }
                    placeholder="2,500"
                    className="h-full px-4 text-base md:text-base [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    name="consultationFee"
                    onBlur={formik.handleBlur}
                    required
                    aria-invalid={Boolean(feeError)}
                    aria-describedby={feeError ? "consultation-fee-error" : "consultation-fee-help"}
                  />
                  <InputGroupAddon className="border-r border-input px-4">
                    <InputGroupText className="font-semibold text-foreground">
                      PKR
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {feeError ? (
                  <p id="consultation-fee-error" className="text-sm text-destructive">
                    {feeError}
                  </p>
                ) : null}
                <p
                  id="consultation-fee-help"
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  Standard consultation fee for a 15–30 minute session. You can
                  configure tiered slot pricing later.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Label htmlFor="professional-biography" className="text-[15px]">
                      Professional Biography
                    </Label>
                    <OptionalBadge />
                  </div>
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {profile.biography.length} / {PRACTICE_BIOGRAPHY_MAX_LENGTH}{" "}
                    characters
                  </span>
                </div>
                <Textarea
                  id="professional-biography"
                  value={profile.biography}
                  onChange={(event) =>
                    updateProfile("biography", event.target.value)
                  }
                  maxLength={PRACTICE_BIOGRAPHY_MAX_LENGTH}
                  name="biography"
                  onBlur={formik.handleBlur}
                  placeholder="Share your clinical experience, areas of focus, and approach to patient care."
                  className="min-h-40 resize-y bg-white px-4 py-3 text-base leading-relaxed md:text-base"
                  aria-describedby="biography-help"
                />
                <p
                  id="biography-help"
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  A brief summary highlighted on your search card and doctor
                  booking preview.
                </p>
              </div>
            </CardContent>

            <CardFooter className="mt-7 flex-col items-stretch gap-4 border-0 bg-transparent p-0 pb-6 sm:pb-10">
              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  render={<Link href="/onboarding/doctor/qualifications" />}
                  nativeButton={false}
                  variant="outline"
                  className="h-11"
                >
                  <ArrowLeft aria-hidden="true" />
                  Back to Qualifications
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-6 text-sm shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
                  disabled={formik.isSubmitting}
                >
                  Review Profile Summary
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>

              <Button
                type="submit"
                variant="link"
                className="mx-auto h-auto w-fit px-0 text-sm text-muted-foreground"
                disabled={formik.isSubmitting}
              >
                Skip optional fields &amp; review
              </Button>

              <p
                className={cn(
                  "min-h-5 text-center text-sm font-medium",
                  "text-secondary",
                )}
                aria-live="polite"
              >
                {message}
              </p>
            </CardFooter>
          </Form>
          </FormikProvider>
        </Card>
      </div>
    </main>
  );
}
