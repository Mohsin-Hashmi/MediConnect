"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseMedical,
  CalendarDays,
  CheckCircle2,
  Headphones,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { OnboardingRole } from "@/types/auth";
import { RoleOption } from "@/types/role";



const roleOptions: RoleOption[] = [
  {
    value: "patient",
    eyebrow: "Seeking consultations",
    title: "I am a Patient",
    description:
      "Find trusted doctors, compare clinical credentials, and book verified appointments.",
    icon: CalendarDays,
    features: [
      "Search and compare PMDC-verified medical specialists",
      "Book in-clinic and telehealth appointments instantly",
      "Access your records and receive digital care updates",
      "Transparent booking with no hidden consultation fees",
    ],
    recommendation: "Recommended for individuals & families",
    accent: "primary",
  },
  {
    value: "doctor",
    eyebrow: "Clinical practice",
    title: "I am a Licensed Doctor",
    description:
      "Manage your clinical schedule, patient flow, and secure telemedicine services.",
    icon: BriefcaseMedical,
    features: [
      "Manage clinic schedules, buffer windows, and hospital shifts",
      "Accept direct patient appointments and HD video visits",
      "Automate digital queue tokens and reduce no-shows",
      "Receive direct weekly settlements with full autonomy",
    ],
    recommendation: "Requires active registration & PMDC ID",
    accent: "secondary",
  },
];

const trustItems = [
  { icon: BadgeCheck, label: "National Practitioner Registry" },
  { icon: ShieldCheck, label: "Strict Privacy & PHI Protection" },
  { icon: Headphones, label: "24/7 Clinical & Patient Help Desk" },
];

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<OnboardingRole>("patient");
  const [savedRole, setSavedRole] = useState<OnboardingRole | null>(null);

  const selectedOption = roleOptions.find(
    (option) => option.value === selectedRole,
  )!;

  const handleContinue = () => {
    window.sessionStorage.setItem("mediconnect_onboarding_role", selectedRole);
    setSavedRole(selectedRole);
  };

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[#f8f8ff] px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(37,99,235,0.08),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.75),rgba(238,242,255,0.65))]"
      />

      <section
        className="relative z-10 mx-auto w-full max-w-5xl"
        aria-labelledby="role-selection-title"
      >
        <header className="mx-auto mb-8 max-w-2xl text-center">
          <h1
            id="role-selection-title"
            className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Join MediConnect as a patient or doctor
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Choose how you would like to experience trusted healthcare
            scheduling today.
          </p>
        </header>

        <RadioGroup
          value={selectedRole}
          onValueChange={(value) => {
            setSelectedRole(value as OnboardingRole);
            setSavedRole(null);
          }}
          className="grid gap-5 md:grid-cols-2"
          aria-label="Choose your MediConnect role"
        >
          {roleOptions.map((option) => {
            const isSelected = selectedRole === option.value;
            const Icon = option.icon;

            return (
              <label key={option.value} className="group cursor-pointer">
                <Card
                  className={cn(
                    "h-full gap-0 rounded-2xl bg-white p-6 transition-all duration-200 sm:p-7",
                    "hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(30,41,59,0.1)]",
                    isSelected
                      ? option.accent === "primary"
                        ? "ring-2 ring-primary shadow-[0_18px_45px_rgba(37,99,235,0.12)]"
                        : "ring-2 ring-secondary shadow-[0_18px_45px_rgba(13,148,136,0.12)]"
                      : "ring-1 ring-border",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-xl",
                        option.accent === "primary"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary",
                      )}
                    >
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <RadioGroupItem
                      value={option.value}
                      aria-label={option.title}
                      className={cn(
                        "size-5",
                        option.accent === "secondary" &&
                          "data-checked:border-secondary data-checked:bg-secondary dark:data-checked:bg-secondary",
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <p
                      className={cn(
                        "text-[11px] font-bold tracking-[0.08em] uppercase",
                        option.accent === "primary"
                          ? "text-primary"
                          : "text-secondary",
                      )}
                    >
                      {option.eyebrow}
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold tracking-tight">
                      {option.title}
                    </h2>
                    <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">
                      {option.description}
                    </p>
                  </div>

                  <Separator className="my-5" />

                  <ul
                    className="flex-1 space-y-3"
                    aria-label={`${option.title} benefits`}
                  >
                    {option.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm leading-snug text-foreground/85"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-secondary"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Separator className="my-5" />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">
                      {option.recommendation}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-semibold",
                        option.accent === "primary"
                          ? "text-primary"
                          : "text-secondary",
                      )}
                    >
                      Select {option.value}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Card>
              </label>
            );
          })}
        </RadioGroup>

        <div className="mx-auto mt-7 max-w-sm text-center">
          <Button
            type="button"
            size="lg"
            onClick={handleContinue}
            className="h-12 w-full px-6 text-sm shadow-[0_10px_25px_rgba(37,99,235,0.2)]"
          >
            Continue as {selectedOption.title.replace("I am a ", "")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
          <p
            className="mt-2 min-h-5 text-xs font-medium text-secondary"
            aria-live="polite"
          >
            {savedRole
              ? `${selectedOption.title.replace("I am a ", "")} selected. Your onboarding steps will appear here next.`
              : ""}
          </p>
        </div>

        <footer className="mt-8 border-t pt-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-foreground/70">
            {trustItems.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon className="size-4 text-secondary" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Your role can be confirmed during profile verification
          </div>
        </footer>
      </section>
    </main>
  );
}
