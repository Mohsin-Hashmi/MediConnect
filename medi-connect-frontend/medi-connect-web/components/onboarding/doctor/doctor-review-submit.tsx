"use client";

import { Form, FormikProvider, type FormikHelpers, useFormik } from "formik";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  GraduationCap,
  LoaderCircle,
  Pencil,
  Save,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { DoctorOnboardingStepper } from "@/components/onboarding/doctor/doctor-onboarding-stepper";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  PROFESSIONAL_INFO_STORAGE_KEY,
  REVIEW_SUBMISSION_STORAGE_KEY,
} from "@/constants/onboarding";
import { PRACTICE_PROFILE_STORAGE_KEY } from "@/constants/practice-profile";
import { QUALIFICATIONS_STORAGE_KEY } from "@/constants/qualification";
import { useCreateDoctor } from "@/hooks/apis/doctor/use-doctor";
import { useDoctorReview } from "@/hooks/onboarding/use-doctor-review";
import { deleteStoredProfileImage } from "@/lib/profile-image-storage";
import { reviewSubmitSchema } from "@/schemas/doctor-onboarding.schema";
import type { ApiErrorResponse } from "@/types/auth";
import type { CreateDoctorPayload } from "@/types/doctor";
import type { ReviewCardHeaderProps, ReviewDetailItemProps, ReviewSubmitFormValues } from "@/types/review-submit";

function ReviewCardHeader({
  number,
  title,
  editHref,
}: ReviewCardHeaderProps) {
  return (
    <CardHeader className="border-b px-5 py-4">
      <CardTitle className="flex items-center gap-2 text-base font-semibold">
        <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
          {number}
        </span>
        {title}
      </CardTitle>
      <CardAction>
        <Button
          render={<Link href={editHref} />}
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/10 hover:text-primary"
        >
          <Pencil aria-hidden="true" />
          Edit
        </Button>
      </CardAction>
    </CardHeader>
  );
}

function DetailItem({ label, children }: ReviewDetailItemProps) {
  return (
    <div className="rounded-lg border border-border/80 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

function formatFee(value?: string) {
  const amount = Number(value);
  if (!value || !Number.isFinite(amount) || amount <= 0) return "Not provided";

  return `PKR ${new Intl.NumberFormat("en-PK").format(amount)}`;
}

export function DoctorReviewSubmit() {
  const router = useRouter();
  const createDoctorMutation = useCreateDoctor();
  const { reviewData, profileImagePreview, saveDraft } = useDoctorReview();
  const { professional, qualifications, practiceProfile } = reviewData;
  
  // Handle form submission for doctor profile review and submission
  const handleSubmit = async (
    values: ReviewSubmitFormValues,
    helpers: FormikHelpers<ReviewSubmitFormValues>,
  ) => {
    if (!professional || qualifications.length === 0 || !practiceProfile) {
      toast.error("Complete all required onboarding sections before submitting.");
      helpers.setSubmitting(false);
      return;
    }

    createDoctorMutation.reset();

    const payload: CreateDoctorPayload = {
      specialization: professional.specialization,
      qualification: qualifications.map((qualification) => ({
        degree: qualification.degree.trim(),
        institute: qualification.institution.trim(),
        year: Number(qualification.graduationYear),
      })),
      profilePicture: profileImagePreview || null,
      licenseNumber: professional.licenseNumber.trim().toUpperCase(),
      experience: professional.yearsOfExperience,
      hospitalName: practiceProfile.hospitalAffiliation.trim(),
      consultationFee: Number(practiceProfile.consultationFee),
      bio: practiceProfile.biography.trim() || null,
    };

    try {
      const response = await createDoctorMutation.mutateAsync(payload);

      [
        PROFESSIONAL_INFO_STORAGE_KEY,
        QUALIFICATIONS_STORAGE_KEY,
        PRACTICE_PROFILE_STORAGE_KEY,
        REVIEW_SUBMISSION_STORAGE_KEY,
      ].forEach((key) => window.sessionStorage.removeItem(key));

      try {
        await deleteStoredProfileImage();
      } catch {
        // Profile creation succeeded, so stale local image cleanup is non-blocking.
      }

      toast.success(
        response.message || "Doctor profile submitted for verification.",
      );
      router.replace("/");
    } catch (error) {
      const message = isAxiosError<ApiErrorResponse>(error)
        ? (error.response?.data.message ??
          "Unable to create the doctor profile. Please try again.")
        : "Unable to create the doctor profile. Please try again.";
      toast.error(message);
    } finally {
      helpers.setSubmitting(false);
    }
  };
  const formik = useFormik<ReviewSubmitFormValues>({
    initialValues: { confirmed: false },
    validationSchema: reviewSubmitSchema,
    onSubmit: handleSubmit,
  });
  const confirmationError =
    formik.touched.confirmed && formik.errors.confirmed;
  const hasRequiredData = Boolean(
    professional &&
      qualifications.length > 0 &&
      practiceProfile?.hospitalAffiliation &&
      practiceProfile.consultationFee,
  );

  return (
    <main className="flex min-h-svh flex-col bg-[#f8f8ff]">
      <DoctorOnboardingStepper activeStep="review-submit" />

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Card className="relative gap-0 overflow-visible border-0 bg-white p-6 shadow-[0_20px_60px_rgba(30,41,59,0.1)] ring-1 ring-slate-200/80 sm:p-10">
          <div
            aria-hidden="true"
            className="absolute top-0 right-2 left-2 h-1 rounded bg-secondary"
          />

          <div>
            <Badge className="h-auto gap-1.5 border-0 bg-emerald-50 px-3 py-1.5 text-xs font-bold tracking-wide text-secondary uppercase hover:bg-emerald-50">
              <span className="size-1.5 rounded-full bg-secondary" />
              Step 4 of 4 &middot; Final Verification
            </Badge>
            <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Review Application &amp; Credentials
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Verify your clinical details, academic accreditations, and
              practice setup before submitting your profile to the regulatory
              desk.
            </p>
          </div>

        <Alert className="mt-7 flex items-start gap-3.5 border-primary/15 bg-indigo-50/60 p-5 text-foreground shadow-sm">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <AlertTitle className="flex flex-wrap items-center gap-2 text-base font-semibold">
              System Verification Notice
              <Badge className="h-auto border-0 bg-indigo-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-indigo-700 uppercase hover:bg-indigo-100">
                Protocol
              </Badge>
            </AlertTitle>
            <AlertDescription className="mt-1.5 leading-relaxed">
              Your profile will be reviewed by the clinical verification team.
              While it is under review, you can still access your dashboard and
              configure your clinic schedule. PMDC verification typically takes
              4 to 12 hours.
            </AlertDescription>
          </div>
        </Alert>

        {!hasRequiredData ? (
          <Alert variant="destructive" className="mt-5 p-4">
            <AlertTitle>Required onboarding information is missing</AlertTitle>
            <AlertDescription>
              Use the Edit actions below to complete every required section
              before submitting for verification.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-6 space-y-5">
          <Card className="relative gap-0 overflow-hidden bg-white py-0 shadow-[0_8px_24px_rgba(30,41,59,0.08)] ring-slate-200/90">
            <ReviewCardHeader
              number="01"
              title="Professional Identity"
              editHref="/onboarding/doctor/professional-info"
            />
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-col gap-4 rounded-xl bg-indigo-50/70 p-4 sm:flex-row sm:items-center">
                <Avatar className="size-12 bg-white ring-2 ring-white">
                  {profileImagePreview ? (
                    <AvatarImage
                      src={profileImagePreview}
                      alt="Doctor profile"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <UserRound className="size-5" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">Doctor Applicant</p>
                  <p className="mt-0.5 text-xs font-semibold tracking-wide text-secondary uppercase">
                    Registered Medical Practitioner
                  </p>
                  {practiceProfile?.profileImageName ? (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      Profile image selected: {practiceProfile.profileImageName}
                    </p>
                  ) : null}
                </div>
                <Badge variant="secondary" className="w-fit bg-white text-primary">
                  <Stethoscope aria-hidden="true" />
                  {professional?.specialization ?? "Specialty pending"}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <DetailItem label="Specialization">
                  {professional?.specialization ?? "Not provided"}
                </DetailItem>
                <DetailItem label="Medical License Number">
                  {professional?.licenseNumber ?? "Not provided"}
                </DetailItem>
                <DetailItem label="Clinical Experience">
                  {professional
                    ? `${professional.yearsOfExperience} years practice`
                    : "Not provided"}
                </DetailItem>
              </div>
            </CardContent>
          </Card>

          <Card className="relative gap-0 overflow-hidden bg-white py-0 shadow-[0_8px_24px_rgba(30,41,59,0.08)] ring-slate-200/90">
            <ReviewCardHeader
              number="02"
              title="Education & Qualifications"
              editHref="/onboarding/doctor/qualifications"
            />
            <CardContent className="space-y-3 p-5">
              {qualifications.length > 0 ? (
                qualifications.map((qualification) => (
                  <div
                    key={qualification.id}
                    className="flex items-start gap-3 rounded-xl bg-indigo-50/70 p-4"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                      <GraduationCap className="size-4.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {qualification.degree}
                        </p>
                        <Badge className="h-auto border-0 bg-white px-2 py-0.5 text-[10px] font-semibold text-primary hover:bg-white">
                          {qualification.graduationYear}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {qualification.institution}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                  No qualifications have been saved yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="relative gap-0 overflow-hidden bg-white py-0 shadow-[0_8px_24px_rgba(30,41,59,0.08)] ring-slate-200/90">
            <ReviewCardHeader
              number="03"
              title="Practice & Profile Setup"
              editHref="/onboarding/doctor/practice-profile"
            />
            <CardContent className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex gap-3 rounded-xl bg-indigo-50/70 p-4">
                  <Building2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Hospital / Clinic
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {practiceProfile?.hospitalAffiliation ?? "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl bg-indigo-50/70 p-4">
                  <Banknote className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Consultation Fee
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatFee(practiceProfile?.consultationFee)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary/10 bg-primary/2.5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    Professional Bio
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Public profile preview
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80 italic">
                  {practiceProfile?.biography ||
                    "No professional biography was provided."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <FormikProvider value={formik}>
          <Form className="mt-6" noValidate>
            <div className="rounded-xl border border-primary/15 bg-indigo-50/40 p-5 shadow-sm">
              <Label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed font-normal text-foreground/80">
                <Checkbox
                  name="confirmed"
                  checked={formik.values.confirmed}
                  onCheckedChange={(checked) => {
                    void formik.setFieldValue("confirmed", checked);
                    void formik.setFieldTouched("confirmed", true, false);
                  }}
                  aria-invalid={Boolean(confirmationError)}
                  aria-describedby={
                    confirmationError ? "confirmation-error" : undefined
                  }
                  className="mt-0.5"
                />
                <span>
                  I confirm that all provided medical qualifications, license
                  details, and practice information are accurate and up to date.
                  I understand that profile activation is subject to independent
                  clinical desk approval and automated regulatory validation.
                </span>
              </Label>
              {confirmationError ? (
                <p
                  id="confirmation-error"
                  className="mt-3 text-sm font-medium text-destructive"
                >
                  {confirmationError}
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                render={<Link href="/onboarding/doctor/practice-profile" />}
                variant="outline"
                className="h-11"
              >
                <ArrowLeft aria-hidden="true" />
                Back to Step 3
              </Button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  onClick={() => saveDraft(formik.values.confirmed)}
                  disabled={formik.isSubmitting || createDoctorMutation.isPending}
                >
                  <Save aria-hidden="true" />
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 px-6 shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
                  disabled={
                    formik.isSubmitting ||
                    createDoctorMutation.isPending ||
                    !hasRequiredData
                  }
                >
                  {createDoctorMutation.isPending ? (
                    <>
                      <LoaderCircle className="animate-spin" aria-hidden="true" />
                      Submitting Profile...
                    </>
                  ) : (
                    <>
                      Submit Profile for Verification
                      <ArrowRight aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
          </FormikProvider>
        </Card>
      </div>
    </main>
  );
}
