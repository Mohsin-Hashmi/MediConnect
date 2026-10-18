import * as Yup from "yup";

export const cancelAppointmentSchema = Yup.object({
  cancellationReason: Yup.string()
    .trim()
    .min(3, "Enter at least 3 characters.")
    .max(500, "Use 500 characters or fewer.")
    .required("A cancellation reason is required."),
});
