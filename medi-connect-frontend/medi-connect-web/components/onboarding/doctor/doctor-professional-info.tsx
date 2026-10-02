"use client";

import { Form, FormikProvider, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseMedical,
  Building2,
  CheckCircle2,
  CircleHelp,
  Headphones,
  Minus,
  Plus,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import { DoctorOnboardingStepper } from "@/components/onboarding/doctor/doctor-onboarding-stepper";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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
import { DOCTOR_SPECIALTIES } from "@/constants/onboarding";
import { professionalInfoSchema } from "@/schemas/doctor-onboarding.schema";
import type { DoctorProfessionalInfoFormValues } from "@/types/professional-info";

const licensePattern = /^PMDC-\d{4,6}-[A-Z]$/i;

export function DoctorProfessionalInfo() {
  const router = useRouter();
  const formik = useFormik<DoctorProfessionalInfoFormValues>({
    initialValues: {
      specialization: DOCTOR_SPECIALTIES[0],
      licenseNumber: "PMDC-84291-P",
      yearsOfExperience: 8,
    },
    validationSchema: professionalInfoSchema,
    onSubmit: (values, helpers) => {
      saveProgress(values);
      helpers.setSubmitting(false);
      router.push("/onboarding/doctor/qualifications");
    },
  });
  const { specialization, licenseNumber, yearsOfExperience: experience } =
    formik.values;
  const licenseIsValid = licensePattern.test(licenseNumber.trim());

  const saveProgress = (values: DoctorProfessionalInfoFormValues) => {
    window.sessionStorage.setItem(
      "mediconnect_doctor_professional_info",
      JSON.stringify({
        specialization: values.specialization,
        licenseNumber: values.licenseNumber.trim().toUpperCase(),
        yearsOfExperience: values.yearsOfExperience,
      }),
    );
  };

  return (
    <main className="flex min-h-svh flex-col bg-[#f8f8ff]">
      <DoctorOnboardingStepper activeStep="professional-info" />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-10">
        <Card className="relative gap-0 overflow-visible border-0 bg-white p-6 shadow-[0_20px_60px_rgba(30,41,59,0.1)] ring-1 ring-slate-200/80 sm:p-10">
          <div
            aria-hidden="true"
            className="absolute top-0 left-2 h-1 w-1/3 rounded bg-primary"
          />

          <CardHeader className="px-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge className="h-auto gap-1.5 border-0 bg-primary/10 px-3 py-1.5 text-xs font-bold tracking-wide text-primary uppercase hover:bg-primary/10">
            <span className="size-1.5 rounded-full bg-primary" />
            Step 1 of 3
          </Badge>
        </div>

        <CardTitle className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Tell us about your medical expertise
        </CardTitle>
        <CardDescription className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Set up your core clinical credentials so patients and healthcare
          partners can identify your specialty.
        </CardDescription>
      </CardHeader>

      <FormikProvider value={formik}>
      <Form className="mt-8" noValidate>
        <CardContent className="space-y-7 px-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="specialization" className="text-[15px]">
              Primary Specialization <span className="text-destructive">*</span>
            </Label>
            <span className="text-sm text-muted-foreground">Primary Field</span>
          </div>
          <Select
            value={specialization}
            onValueChange={(value) => {
              void formik.setFieldValue("specialization", value ?? "");
              void formik.setFieldTouched("specialization", true, false);
            }}
          >
            <SelectTrigger
              id="specialization"
              size="lg"
              className="w-full gap-3 bg-white text-base md:text-base"
              aria-label="Primary specialization"
              aria-invalid={Boolean(formik.touched.specialization && formik.errors.specialization)}
            >
              <Stethoscope className="size-4 text-primary" aria-hidden="true" />
              <SelectValue placeholder="Select your medical specialty" />
            </SelectTrigger>
            <SelectContent
              align="start"
              alignItemWithTrigger={false}
              sideOffset={6}
              className="max-h-72 p-1.5"
            >
              {DOCTOR_SPECIALTIES.map((specialty) => (
                <SelectItem
                  key={specialty}
                  value={specialty}
                  className="cursor-pointer py-1 pr-2 pl-2 text-base"
                >
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.specialization && formik.errors.specialization ? (
            <p className="text-sm text-destructive">{formik.errors.specialization}</p>
          ) : null}
          <p className="text-sm leading-relaxed text-muted-foreground">
            Select your officially licensed medical specialty
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="license-number" className="text-[15px]">
              Medical License / PMDC Registration Number
              <span className="text-destructive">*</span>
            </Label>
            <CircleHelp
              className="size-4 shrink-0 text-muted-foreground"
              aria-label="Use the registration number shown on your PMDC license"
            />
          </div>
          <div className="relative">
            <Building2
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="license-number"
              value={licenseNumber}
              onChange={(event) => {
                void formik.setFieldValue(
                  "licenseNumber",
                  event.target.value.toUpperCase(),
                );
              }}
              onBlur={formik.handleBlur}
              name="licenseNumber"
              placeholder="PMDC-12345-P"
              autoComplete="off"
              aria-invalid={Boolean(
                formik.touched.licenseNumber && formik.errors.licenseNumber,
              )}
              aria-describedby={
                formik.touched.licenseNumber && formik.errors.licenseNumber
                  ? "license-error"
                  : "license-help"
              }
              className="h-12 bg-white pr-32 pl-11 text-base uppercase md:text-base"
              required
            />
            {licenseIsValid ? (
              <Badge className="pointer-events-none absolute top-1/2 right-2.5 h-auto -translate-y-1/2 gap-1 border-0 bg-emerald-100 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                <CheckCircle2 className="size-3" aria-hidden="true" />
                Valid Format
              </Badge>
            ) : null}
          </div>
          {formik.touched.licenseNumber && formik.errors.licenseNumber ? (
            <p id="license-error" className="text-sm text-destructive">
              {formik.errors.licenseNumber}
            </p>
          ) : null}
          <p
            id="license-help"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            Enter your official medical regulatory license number (e.g.,
            PMDC-12345-P)
          </p>
        </div>

        <fieldset className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <legend className="text-[15px] font-medium">
              Years of Clinical Experience
              <span className="ml-1 text-destructive">*</span>
            </legend>
            <span className="text-sm font-medium text-secondary">
              Active Clinical Practice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <BriefcaseMedical
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="years-of-experience"
                type="number"
                min={0}
                max={70}
                value={experience}
                onChange={(event) => {
                  void formik.setFieldValue(
                    "yearsOfExperience",
                    Number(event.target.value),
                  );
                }}
                onBlur={formik.handleBlur}
                name="yearsOfExperience"
                className="h-12 bg-white pr-16 pl-11 text-base md:text-base [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                aria-label="Years of clinical experience"
                aria-invalid={Boolean(formik.touched.yearsOfExperience && formik.errors.yearsOfExperience)}
                required
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                Years
              </span>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-input bg-white shadow-sm">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-12 rounded-none border-r"
                onClick={() => {
                  void formik.setFieldValue(
                    "yearsOfExperience",
                    Math.max(0, experience - 1),
                  );
                }}
                disabled={experience === 0}
                aria-label="Decrease years of experience"
              >
                <Minus aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-12 rounded-none"
                onClick={() => {
                  void formik.setFieldValue(
                    "yearsOfExperience",
                    Math.min(70, experience + 1),
                  );
                }}
                disabled={experience === 70}
                aria-label="Increase years of experience"
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>
          </div>
          {formik.touched.yearsOfExperience && formik.errors.yearsOfExperience ? (
            <p className="text-sm text-destructive">
              {formik.errors.yearsOfExperience}
            </p>
          ) : null}
          <p className="text-sm leading-relaxed text-muted-foreground">
            Total years of clinical practice post-house job
          </p>
        </fieldset>

        <Alert className="flex items-start gap-3.5 border-0 bg-indigo-50 p-5 text-foreground">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-secondary">
            <ShieldCheck className="size-4.5" aria-hidden="true" />
          </span>
          <div>
            <AlertTitle className="text-base font-semibold">
              Regulatory Verification Protocol
            </AlertTitle>
            <AlertDescription className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Your license number will be verified with the official medical
              regulatory authority before your profile becomes publicly
              searchable. Verification typically completes within 4 to 12 hours.
            </AlertDescription>
          </div>
        </Alert>

        </CardContent>
        <CardFooter className="mt-7 flex-col items-stretch gap-4 border-0 bg-transparent p-0 pb-6 sm:pb-10">
        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/onboarding/role"
            onClick={() => saveProgress(formik.values)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted sm:justify-start"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Cancel / Save & Exit
          </Link>
          <Button
            type="submit"
            size="lg"
            className="h-12 px-6 text-sm shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
            disabled={formik.isSubmitting}
          >
            Continue to Qualifications
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>

        <p
          className="min-h-5 text-center text-sm font-medium text-secondary"
          aria-live="polite"
        >
          {typeof formik.status === "string" ? formik.status : ""}
        </p>
        </CardFooter>
          </Form>
          </FormikProvider>
        </Card>

        <footer className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck
              className="size-3.5 text-secondary"
              aria-hidden="true"
            />
            HIPAA & PMDC Compliant
          </span>
          <span
            aria-hidden="true"
            className="hidden size-1 rounded-full bg-border sm:block"
          />
          <span className="inline-flex items-center gap-1.5">
            <Headphones className="size-3.5 text-primary" aria-hidden="true" />
            Instant Support: (021) 111-MED-DOC
          </span>
        </footer>
      </div>
    </main>
  );
}
