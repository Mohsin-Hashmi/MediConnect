"use client";

import { Form, FormikProvider, getIn } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  GraduationCap,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { DoctorOnboardingStepper } from "@/components/onboarding/doctor/shared/doctor-onboarding-stepper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADUATION_YEARS } from "@/constants/qualification";
import { useDoctorQualifications } from "@/hooks/onboarding/use-doctor-qualifications";
import { cn } from "@/lib/utils";

export function DoctorQualifications() {
  const router = useRouter();
  const {
    formik,
    qualifications,
    message,
    setMessage,
    updateQualification,
    saveQualifications,
    addQualification,
    removeQualification,
  } = useDoctorQualifications(() =>
    router.push("/onboarding/doctor/practice-profile"),
  );

  return (
    <main className="flex min-h-svh flex-col bg-[#f8f8ff]">
      <DoctorOnboardingStepper activeStep="qualifications" />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-10">
        <Card className="relative gap-0 overflow-visible border-0 bg-white p-6 shadow-[0_20px_60px_rgba(30,41,59,0.1)] ring-1 ring-slate-200/80 sm:p-10">
          <div
            aria-hidden="true"
            className="absolute top-0 left-2 h-1 w-1/2 rounded bg-primary"
          />

          <CardHeader className="px-0">
            <Badge className="h-auto gap-1.5 border-0 bg-primary/10 px-3 py-1.5 text-xs font-bold tracking-wide text-primary uppercase hover:bg-primary/10">
              <span className="size-1.5 rounded-full bg-primary" />
              Step 2 of 3
            </Badge>
            <CardTitle className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Add your academic & clinical qualifications
            </CardTitle>
            <CardDescription className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
              List your medical degrees, fellowships, and post-graduate
              certifications in reverse chronological order for regulatory
              compliance.
            </CardDescription>
          </CardHeader>

          <Alert className="mt-6 flex items-start gap-3.5 border-0 bg-indigo-50 p-5 text-foreground">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-secondary shadow-sm">
              <ShieldCheck className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <AlertTitle className="text-base font-semibold">
                PMDC Credential Registry Requirement
              </AlertTitle>
              <AlertDescription className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                At least one certified basic qualification (for example, MBBS,
                BDS, or a recognized foreign equivalent) is mandatory to
                activate clinical booking.
              </AlertDescription>
            </div>
          </Alert>

          <FormikProvider value={formik}>
            <Form className="mt-7" noValidate>
              <CardContent className="space-y-6 px-0">
                <div className="space-y-5">
                  {qualifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/25 bg-primary/2.5 px-6 py-10 text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <GraduationCap className="size-6" aria-hidden="true" />
                      </span>
                      <h2 className="mt-4 text-base font-semibold">
                        No qualifications added yet
                      </h2>
                      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                        Add your primary medical degree first. You can then
                        include fellowships, specializations, and other
                        certifications.
                      </p>
                    </div>
                  ) : null}

                  {qualifications.map((qualification, index) => {
                    const degreePath = `qualifications.${index}.degree`;
                    const institutionPath = `qualifications.${index}.institution`;
                    const yearPath = `qualifications.${index}.graduationYear`;
                    const showSubmittedErrors = formik.submitCount > 0;
                    const degreeValidationError = getIn(
                      formik.errors,
                      degreePath,
                    );
                    const institutionValidationError = getIn(
                      formik.errors,
                      institutionPath,
                    );
                    const yearValidationError = getIn(formik.errors, yearPath);
                    const degreeError =
                      (showSubmittedErrors ||
                        getIn(formik.touched, degreePath)) &&
                      typeof degreeValidationError === "string"
                        ? degreeValidationError
                        : "";
                    const institutionError =
                      (showSubmittedErrors ||
                        getIn(formik.touched, institutionPath)) &&
                      typeof institutionValidationError === "string"
                        ? institutionValidationError
                        : "";
                    const yearError =
                      (showSubmittedErrors ||
                        getIn(formik.touched, yearPath)) &&
                      typeof yearValidationError === "string"
                        ? yearValidationError
                        : "";

                    return (
                      <fieldset
                        key={qualification.id}
                        className="rounded-xl border border-border/80 bg-slate-50/35 p-4 sm:p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {index + 1}
                            </span>
                            <legend className="text-sm font-semibold sm:text-base">
                              {qualification.heading}
                            </legend>
                            <Badge className="h-auto rounded-md border-0 bg-indigo-100 px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100">
                              {qualification.tier}
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              removeQualification(qualification.id)
                            }
                          >
                            <Trash2 aria-hidden="true" />
                            Remove
                          </Button>
                        </div>

                        <div className="mt-5 flex flex-col gap-4 sm:gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor={`${qualification.id}-degree`}
                              className="text-[15px]"
                            >
                              Degree / Title{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <GraduationCap
                                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                              />
                              <Input
                                id={`${qualification.id}-degree`}
                                value={qualification.degree}
                                name={degreePath}
                                onChange={(event) =>
                                  updateQualification(
                                    qualification.id,
                                    "degree",
                                    event.target.value,
                                  )
                                }
                                onBlur={formik.handleBlur}
                                placeholder="e.g. MBBS or FCPS"
                                className="h-12 bg-white pl-11 text-base md:text-base"
                                required
                                aria-invalid={Boolean(degreeError)}
                                aria-describedby={
                                  degreeError
                                    ? `${qualification.id}-degree-error`
                                    : undefined
                                }
                              />
                            </div>
                            {degreeError ? (
                              <p
                                id={`${qualification.id}-degree-error`}
                                className="text-sm font-medium text-destructive"
                              >
                                {degreeError}
                              </p>
                            ) : null}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor={`${qualification.id}-institution`}
                              className="text-[15px]"
                            >
                              Institution / University
                              <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <Building2
                                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                              />
                              <Input
                                id={`${qualification.id}-institution`}
                                value={qualification.institution}
                                name={institutionPath}
                                onChange={(event) =>
                                  updateQualification(
                                    qualification.id,
                                    "institution",
                                    event.target.value,
                                  )
                                }
                                onBlur={formik.handleBlur}
                                placeholder="Enter the awarding institution"
                                className="h-12 bg-white pl-11 text-base md:text-base"
                                required
                                aria-invalid={Boolean(institutionError)}
                                aria-describedby={
                                  institutionError
                                    ? `${qualification.id}-institution-error`
                                    : undefined
                                }
                              />
                            </div>
                            {institutionError ? (
                              <p
                                id={`${qualification.id}-institution-error`}
                                className="text-sm font-medium text-destructive"
                              >
                                {institutionError}
                              </p>
                            ) : null}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor={`${qualification.id}-year`}
                              className="text-[15px]"
                            >
                              Graduation Year
                              <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={qualification.graduationYear}
                              onValueChange={(value) => {
                                updateQualification(
                                  qualification.id,
                                  "graduationYear",
                                  value ?? "",
                                );
                                void formik.setFieldTouched(
                                  yearPath,
                                  true,
                                  false,
                                );
                              }}
                            >
                              <SelectTrigger
                                id={`${qualification.id}-year`}
                                size="lg"
                                className="w-full gap-3 bg-white text-base md:text-base"
                                aria-label={`Graduation year for ${qualification.heading}`}
                                aria-invalid={Boolean(yearError)}
                                aria-describedby={
                                  yearError
                                    ? `${qualification.id}-year-error`
                                    : undefined
                                }
                              >
                                <CalendarDays
                                  className="size-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent
                                align="start"
                                alignItemWithTrigger={false}
                                sideOffset={6}
                                className="max-h-64 p-1.5"
                              >
                                {GRADUATION_YEARS.map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year}
                                    className="cursor-pointer px-3 py-2 text-base"
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {yearError ? (
                              <p
                                id={`${qualification.id}-year-error`}
                                className="text-sm font-medium text-destructive"
                              >
                                {yearError}
                              </p>
                            ) : null}
                          </div>

                          {/* <div className="flex items-end">
                    <div className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-primary/10 bg-white px-4 py-2">
                      <span className="inline-flex items-center gap-2 text-sm leading-snug text-muted-foreground">
                        <StatusIcon
                          className={cn(
                            "size-4 shrink-0",
                            qualification.status === "indexed"
                              ? "text-secondary"
                              : "text-primary",
                          )}
                          aria-hidden="true"
                        />
                        {verification.label}
                      </span>
                      <Badge
                        className={cn(
                          "h-auto rounded-md border-0 px-2 py-1 text-[10px] font-bold tracking-wide uppercase",
                          qualification.status === "indexed" &&
                            "bg-emerald-100 text-emerald-700",
                          qualification.status === "pending" &&
                            "bg-amber-100 text-amber-700",
                          qualification.status === "new" &&
                            "bg-blue-100 text-blue-700",
                        )}
                      >
                        {verification.badge}
                      </Badge>
                    </div>
                  </div> */}
                        </div>
                      </fieldset>
                    );
                  })}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full border-dashed border-primary/25 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={addQualification}
                >
                  <Plus aria-hidden="true" />
                  {qualifications.length === 0
                    ? "Add Qualification"
                    : "Add Another Qualification"}
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>
                    {qualifications.length} qualification
                    {qualifications.length === 1 ? "" : "s"} added
                  </span>
                  <span className="font-medium text-secondary">
                    All entered qualifications reflect publicly on your profile
                  </span>
                </div>
              </CardContent>
              <CardFooter className="mt-6 flex-col items-stretch gap-4 border-0 bg-transparent p-0 pb-6 sm:pb-10">
                <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    render={
                      <Link href="/onboarding/doctor/professional-info" />
                    }
                    variant="outline"
                    className="h-11"
                  >
                    <ArrowLeft aria-hidden="true" />
                    Back to Expertise
                  </Button>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11"
                      onClick={() => {
                        saveQualifications();
                        setMessage("Draft saved on this device.");
                      }}
                    >
                      <Save aria-hidden="true" />
                      Save Draft
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-11 px-6 shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
                      disabled={formik.isSubmitting}
                    >
                      Continue to Practice & Profile
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <p
                  className={cn(
                    "min-h-5 text-center text-sm font-medium",
                    typeof formik.errors.qualifications === "string"
                      ? "text-destructive"
                      : "text-secondary",
                  )}
                  aria-live="polite"
                >
                  {typeof formik.errors.qualifications === "string" &&
                  formik.submitCount > 0
                    ? formik.errors.qualifications
                    : message}
                </p>
              </CardFooter>
            </Form>
          </FormikProvider>
        </Card>
      </div>
    </main>
  );
}
