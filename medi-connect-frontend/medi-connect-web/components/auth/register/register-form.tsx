"use client";

import { Form, Formik, type FormikHelpers } from "formik";
import { isAxiosError } from "axios";
import {
  AtSign,
  KeyRound,
  LoaderCircle,
  UserRoundPlus,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PasswordInput } from "@/components/auth/shared/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRegister } from "@/hooks/apis/auth/use-auth";
import { saveAccessToken } from "@/lib/auth-storage";
import { registerSchema } from "@/schemas/auth.schema";
import type {
  ApiErrorResponse,
  RegisterFormValues,
  RegisterPayload,
} from "@/types/auth";

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  acceptTerms: false,
};

function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 6,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (!password) return { score: 0, label: "Enter password" };
  if (score <= 1) return { score: 1, label: "Weak" };
  if (score === 2) return { score: 2, label: "Fair" };
  if (score === 3) return { score: 3, label: "Good" };
  return { score: 4, label: "Strong" };
}

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const handleSubmit = async (
    values: RegisterFormValues,
    helpers: FormikHelpers<RegisterFormValues>,
  ) => {
    registerMutation.reset();

    const payload: RegisterPayload = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      role: "patient",
    };

    try {
      const response = await registerMutation.mutateAsync(payload);
      saveAccessToken(response.data.accessToken);
      toast.success(response.message || "Account created successfully.");
      helpers.resetForm();
      router.replace("/onboarding/role");
    } catch (error) {
      const message = isAxiosError<ApiErrorResponse>(error)
        ? (error.response?.data.message ??
          "Unable to create your account. Please try again.")
        : "Unable to create your account. Please try again.";
      toast.error(message);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <>
      <Tabs
        value="register"
        onValueChange={(value) => {
          if (value === "login") router.push("/login");
        }}
        className="mb-6 gap-0"
      >
        <TabsList
          aria-label="Authentication"
          className="grid w-full grid-cols-2 rounded-xl bg-primary/8 p-1.5 group-data-horizontal/tabs:h-13"
        >
          <TabsTrigger
            value="login"
            className="h-10 rounded-lg px-3 py-2.5 text-sm font-semibold"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="h-10 rounded-lg px-3 py-2.5 text-sm font-semibold data-active:bg-white data-active:text-primary data-active:shadow-sm data-active:ring-1 data-active:ring-black/5"
          >
            Create Account
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          isSubmitting,
        }) => {
          const strength = getPasswordStrength(values.password);

          return (
            <Form className="space-y-5" noValidate>
              <div className="space-y-2.5">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Sarah Jenkins"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.name && errors.name)}
                    aria-describedby={
                      touched.name && errors.name ? "name-error" : undefined
                    }
                     className="h-11.5 pl-10 text-sm"
                  />
                </div>

                {touched.name && errors.name ? (
                  <p id="name-error" className="text-xs text-destructive">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="register-email">Email Address</Label>
                <div className="relative">
                  <AtSign
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="sarah.jenkins@patient.org"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.email && errors.email)}
                    aria-describedby={
                      touched.email && errors.email
                        ? "register-email-error"
                        : undefined
                    }
                    className="h-11.5 pl-10 text-sm"
                  />
                </div>
                {touched.email && errors.email ? (
                  <p
                    id="register-email-error"
                    className="text-xs text-destructive"
                  >
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="register-password">Password</Label>
                <PasswordInput
                  id="register-password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.password && errors.password)}
                  aria-describedby={
                    touched.password && errors.password
                      ? "register-password-error"
                      : undefined
                  }
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Complexity:</span>
                  <span>{strength.label}</span>
                </div>
                <div
                  className="grid grid-cols-4 gap-1"
                  aria-label={`Password strength: ${strength.label}`}
                >
                  {[1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={
                        level <= strength.score
                          ? "h-1 rounded-full bg-primary"
                          : "h-1 rounded-full bg-muted"
                      }
                    />
                  ))}
                </div>
                {touched.password && errors.password ? (
                  <p
                    id="register-password-error"
                    className="text-xs text-destructive"
                  >
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <div>
                <Label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/35 p-3.5 text-[13px] leading-relaxed font-normal text-muted-foreground">
                  <Checkbox
                    name="acceptTerms"
                    checked={values.acceptTerms}
                    onCheckedChange={(checked) =>
                      void setFieldValue("acceptTerms", checked)
                    }
                    aria-invalid={Boolean(
                      touched.acceptTerms && errors.acceptTerms,
                    )}
                    className="mt-0.5"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="font-medium text-primary hover:underline"
                    >
                      Terms of Care
                    </Link>{" "}
                    and consent to{" "}
                    <Link
                      href="#"
                      className="font-medium text-primary hover:underline"
                    >
                      HIPAA Data Processing
                    </Link>
                  </span>
                </Label>
                {touched.acceptTerms && errors.acceptTerms ? (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.acceptTerms}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-11.5 w-full text-sm shadow-sm"
                disabled={isSubmitting || registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    <UserRoundPlus aria-hidden="true" />
                    Create Account
                  </>
                )}
              </Button>

              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <KeyRound
                  className="size-3.5 text-secondary"
                  aria-hidden="true"
                />
                Your password is encrypted before storage
              </p>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
