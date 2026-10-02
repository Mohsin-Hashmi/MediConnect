import { DOCTOR_ONBOARDING_STEPS } from "@/constants/onboarding";
import type { DoctorOnboardingStepId } from "@/constants/onboarding";
import { cn } from "@/lib/utils";

interface DoctorOnboardingStepperProps {
  activeStep: DoctorOnboardingStepId;
}

export function DoctorOnboardingStepper({
  activeStep,
}: DoctorOnboardingStepperProps) {
  return (
    <nav
      aria-label="Doctor onboarding progress"
      className="shrink-0 border-b border-primary/5 bg-[#f1f3ff] px-4 sm:px-6"
    >
      <ol className="mx-auto grid max-w-5xl grid-cols-4">
        {DOCTOR_ONBOARDING_STEPS.map((step, index) => {
          const isActive = step.id === activeStep;

          return (
            <li
              key={step.id}
              aria-current={isActive ? "step" : undefined}
              aria-label={`${index + 1}. ${step.label}`}
              className={cn(
                "relative flex min-h-16 items-center justify-center gap-2 px-1 text-center text-xs font-medium text-muted-foreground sm:min-h-20 sm:px-4 sm:text-sm",
                isActive && "font-semibold text-primary",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/7 text-xs font-semibold text-foreground/70",
                  isActive && "bg-primary/10 text-primary",
                )}
              >
                {index + 1}
              </span>
              <span className="hidden leading-tight sm:inline">{step.label}</span>
              {isActive ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
