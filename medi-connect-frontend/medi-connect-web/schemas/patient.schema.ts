import * as Yup from "yup";

export const patientSchema = Yup.object({
  name: Yup.string().trim().min(2, "Enter at least 2 characters").max(80).required("Patient name is required"),
  age: Yup.number().typeError("Enter a valid age").integer("Use a whole number").min(0).max(120).required("Age is required"),
  gender: Yup.string().oneOf(["Female", "Male", "Other"]).required("Gender is required"),
  email: Yup.string().trim().email("Enter a valid email address").required("Email is required"),
  careFocus: Yup.string().trim().min(3, "Enter at least 3 characters").max(100).required("Care focus is required"),
  status: Yup.string().oneOf(["active", "inactive"]).required("Status is required"),
});
