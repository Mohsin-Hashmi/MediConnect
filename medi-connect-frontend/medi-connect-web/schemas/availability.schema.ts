import * as Yup from "yup";

export const availabilitySchema = Yup.object({
  acceptingAppointments: Yup.boolean().required(),
  durationMinutes: Yup.number().integer().min(15).max(120).required(),
  bufferMinutes: Yup.number().integer().min(0).max(60).required(),
  clinicName: Yup.string().trim().required("Clinic name is required."),
  timezone: Yup.string().required(),
  days: Yup.array()
    .of(
      Yup.object({
        day: Yup.string().required(),
        enabled: Yup.boolean().required(),
        ranges: Yup.array()
          .of(
            Yup.object({
              id: Yup.string().required(),
              startTime: Yup.string()
                .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
                .required(),
              endTime: Yup.string()
                .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
                .required(),
              mode: Yup.string().oneOf(["In-person", "Video"]).required(),
            }),
          )
          .required(),
      }),
    )
    .required(),
  blocks: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().required(),
        date: Yup.string()
          .matches(/^\d{4}-\d{2}-\d{2}$/)
          .required(),
        reason: Yup.string().trim().required(),
      }),
    )
    .required(),
});
