import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email address is required"),
  password: Yup.string().required("Password is required"),
  remember: Yup.boolean().defined(),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must not exceed 80 characters")
    .required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must not exceed 72 characters")
    .required("Password is required"),
  acceptTerms: Yup.boolean()
    .oneOf([true], "You must accept the Terms of Care and HIPAA consent")
    .required(),
});
