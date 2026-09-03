import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "ID must be a valid Mongo ObjectId");

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format");

const timeToMinutes = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":");

  return Number(hours) * 60 + Number(minutes);
};

export const createAppointmentSchema = z
  .object({
    availabilityId: objectIdSchema,
    doctorId: objectIdSchema,
    startTime: timeSchema,
    endTime: timeSchema,
    reason: z
      .string()
      .trim()
      .max(500, "Reason must not exceed 500 characters")
      .optional(),
    notes: z
      .string()
      .trim()
      .max(1000, "Notes must not exceed 1000 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (timeToMinutes(data.endTime) <= timeToMinutes(data.startTime)) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time",
      });
    }
  });

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
