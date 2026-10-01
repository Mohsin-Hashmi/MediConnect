"use client";

import { Form, Formik, type FormikHelpers } from "formik";
import { ArrowRight, AtSign, LoaderCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthTabs } from "@/components/auth/auth-tabs";
import { FormMessage } from "@/components/auth/form-message";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialLogin } from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/apis/auth/use-auth";
import { loginSchema } from "@/schemas/auth.schema";
import type { LoginFormValues, LoginPayload } from "@/types/auth";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  remember: false,
};

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const handleSubmit = async (
    values: LoginFormValues,
    helpers: FormikHelpers<LoginFormValues>,
  ) => {
    loginMutation.reset();

    const payload: LoginPayload = {
      email: values.email.trim().toLowerCase(),
      password: values.password,
    };

    try {
      await loginMutation.mutateAsync(payload);
      router.replace("/");
    } catch {
      // The mutation exposes the typed error for the form message below.
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const errorMessage = loginMutation.isError
    ? (loginMutation.error.response?.data.message ??
      "Unable to sign in. Please try again.")
    : null;

  return (
    <>
      <AuthTabs active="login" />

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, handleBlur, handleChange, setFieldValue, isSubmitting }) => (
          <Form className="space-y-5" noValidate>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="email">Email Address</Label>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Verified ID
                </span>
              </div>
              <div className="relative">
                <AtSign
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="dr.alexander@mediconnect.org"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                  className="h-11.5 pl-10 text-sm"
                />
              </div>
              {touched.email && errors.email ? (
                <p id="email-error" className="text-xs text-destructive">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.password && errors.password)}
                aria-describedby={touched.password && errors.password ? "password-error" : undefined}
              />
              {touched.password && errors.password ? (
                <p id="password-error" className="text-xs text-destructive">{errors.password}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2.5 text-xs text-muted-foreground">
                <Checkbox
                  name="remember"
                  checked={values.remember}
                  onCheckedChange={(checked) => void setFieldValue("remember", checked)}
                />
                Remember for 30 days
              </label>
              <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Auto-logout enabled
              </span>
            </div>

            {errorMessage ? <FormMessage message={errorMessage} /> : null}
            {loginMutation.isSuccess ? (
              <FormMessage message={loginMutation.data.message} variant="success" />
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="h-11.5 w-full text-sm shadow-sm"
              disabled={isSubmitting || loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <>
                  Sign In
                  <ArrowRight aria-hidden="true" className="size-4" />
                </>
              )}
            </Button>
          </Form>
        )}
      </Formik>

      <SocialLogin />
    </>
  );
}
