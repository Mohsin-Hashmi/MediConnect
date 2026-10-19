import * as Yup from "yup";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const availabilitySchema = Yup.object({
  date: Yup.string().required("Date is required."),
  startTime: Yup.string()
    .matches(timePattern, "Choose a valid start time.")
    .required("Start time is required."),
  endTime: Yup.string()
    .matches(timePattern, "Choose a valid end time.")
    .required("End time is required.")
    .test(
      "after-start",
      "End time must be after start time.",
      function (value) {
        return Boolean(
          value && this.parent.startTime && value > this.parent.startTime,
        );
      },
    ),
  slotDuration: Yup.number()
    .typeError("Slot duration is required.")
    .integer("Use a whole number of minutes.")
    .min(5, "Use at least 5 minutes.")
    .max(240, "Use no more than 240 minutes.")
    .test(
      "fits-window",
      "Slot duration must fit inside the time window.",
      function (value) {
        if (!value || !this.parent.startTime || !this.parent.endTime)
          return true;
        const toMinutes = (time: string) => {
          const [hours, minutes] = time.split(":").map(Number);
          return hours * 60 + minutes;
        };
        return (
          value <=
          toMinutes(this.parent.endTime) - toMinutes(this.parent.startTime)
        );
      },
    )
    .required("Slot duration is required."),
  isAvailable: Yup.boolean().required(),
});
