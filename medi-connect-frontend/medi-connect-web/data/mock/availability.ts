import type { AvailabilityValues } from "@/types/availability";

export const mockAvailability: AvailabilityValues = {
  acceptingAppointments: true,
  durationMinutes: 30,
  bufferMinutes: 10,
  clinicName: "Al-Hayat Heart Institute",
  timezone: "Asia/Karachi",
  days: [
    { day: "Monday", enabled: true, ranges: [
      { id: "mon-1", startTime: "09:00", endTime: "13:00", mode: "In-person" },
      { id: "mon-2", startTime: "15:00", endTime: "18:00", mode: "Video" },
    ] },
    { day: "Tuesday", enabled: true, ranges: [
      { id: "tue-1", startTime: "09:00", endTime: "13:00", mode: "In-person" },
      { id: "tue-2", startTime: "15:00", endTime: "18:00", mode: "Video" },
    ] },
    { day: "Wednesday", enabled: true, ranges: [
      { id: "wed-1", startTime: "09:00", endTime: "13:00", mode: "In-person" },
      { id: "wed-2", startTime: "15:00", endTime: "18:00", mode: "Video" },
    ] },
    { day: "Thursday", enabled: true, ranges: [
      { id: "thu-1", startTime: "09:00", endTime: "13:00", mode: "In-person" },
      { id: "thu-2", startTime: "15:00", endTime: "18:00", mode: "Video" },
    ] },
    { day: "Friday", enabled: true, ranges: [
      { id: "fri-1", startTime: "09:00", endTime: "13:00", mode: "In-person" },
      { id: "fri-2", startTime: "15:00", endTime: "18:00", mode: "Video" },
    ] },
    { day: "Saturday", enabled: true, ranges: [
      { id: "sat-1", startTime: "10:00", endTime: "14:00", mode: "In-person" },
    ] },
    { day: "Sunday", enabled: false, ranges: [] },
  ],
  blocks: [
    { id: "block-1", date: "2026-10-21", reason: "Practice administration" },
    { id: "block-2", date: "2026-10-29", reason: "Personal leave" },
  ],
};
