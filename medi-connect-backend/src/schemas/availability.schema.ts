import { z } from "zod";

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format");

const timeToMinutes = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":");

  return Number(hours) * 60 + Number(minutes);
};

export const createAvailabilitySchema = z
  .object({
    date: z.coerce.date().refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date >= today;
    }, "Date cannot be in the past"),
    startTime: timeSchema,
    endTime: timeSchema,
    slotDuration: z.coerce
      .number()
      .int("Slot duration must be a whole number")
      .min(5, "Slot duration must be at least 5 minutes")
      .max(240, "Slot duration must not exceed 240 minutes"),
    isAvailable: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    const startMinutes = timeToMinutes(data.startTime);
    const endMinutes = timeToMinutes(data.endTime);

    if (endMinutes <= startMinutes) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time",
      });
      return;
    }

    if (data.slotDuration > endMinutes - startMinutes) {
      ctx.addIssue({
        code: "custom",
        path: ["slotDuration"],
        message: "Slot duration must fit between start time and end time",
      });
    }
  });

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
