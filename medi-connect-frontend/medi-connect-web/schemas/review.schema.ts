import * as Yup from "yup";

export const reviewReplySchema = Yup.object({
  message: Yup.string()
    .trim()
    .min(2, "Enter at least 2 characters.")
    .max(1000, "Use 1000 characters or fewer.")
    .required("A reply is required."),
});
