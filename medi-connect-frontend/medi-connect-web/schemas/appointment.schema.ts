import * as Yup from "yup";

import { APPOINTMENTS_DEMO_DATE } from "@/data/mock/appointments";

export const newAppointmentSchema = Yup.object({
  patientName: Yup.string().trim().min(2, "Enter the patient name.").required("Patient name is required."),
  patientAge: Yup.number().typeError("Enter a valid age.").integer().min(1).max(120).required("Age is required."),
  reason: Yup.string().trim().min(3, "Add a short reason for the visit.").required("Reason is required."),
  date: Yup.string().required("Date is required.").test("demo-date", "Choose the demo date or later.", (value) => !value || value >= APPOINTMENTS_DEMO_DATE),
  time: Yup.string().required("Time is required."),
  visitType: Yup.string().oneOf(["Video", "In-person"]).required("Select a visit type."),
  feePkr: Yup.number().typeError("Enter a valid fee.").min(0).required("Fee is required."),
});

export const editAppointmentSchema = Yup.object({
  patientName: Yup.string().trim().min(2, "Enter at least 2 characters.").max(100, "Use 100 characters or fewer.").required("Patient name is required."),
  patientAge: Yup.number().typeError("Enter a valid age.").integer("Age must be a whole number.").min(1, "Age must be at least 1.").max(120, "Age cannot exceed 120.").required("Age is required."),
  reason: Yup.string().trim().min(3, "Enter at least 3 characters.").max(250, "Use 250 characters or fewer.").required("Reason is required."),
  date: Yup.string().required("Date is required.").matches(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
  time: Yup.string().required("Time is required.").matches(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a valid time."),
  durationMinutes: Yup.number().typeError("Enter a valid duration.").integer("Duration must be a whole number.").min(5, "Duration must be at least 5 minutes.").max(240, "Duration cannot exceed 240 minutes.").required("Duration is required."),
  visitType: Yup.string().oneOf(["Video", "In-person"]).required("Visit type is required."),
  status: Yup.string().oneOf(["confirmed", "pending", "completed", "cancelled"]).required("Status is required."),
  feePkr: Yup.number().typeError("Enter a valid fee.").min(0, "Fee cannot be negative.").max(1000000, "Fee is too high.").required("Fee is required."),
});
