import type { IAvailabilityDocument } from "../models/availability.model.js";

type Slot = {
  startTime: string;
  endTime: string;
};

type AvailabilityTimeRange = {
  startTime: string;
  endTime: string;
  slotDuration: number;
};

export const timeToMinutes = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":");

  return Number(hours) * 60 + Number(minutes);
};

const minutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const startOfDay = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
};

export const nextDay = (date: Date) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  return nextDate;
};

export const generateAvailabilitySlots = ({
  startTime,
  endTime,
  slotDuration,
}: AvailabilityTimeRange) => {
  const slots: Slot[] = [];
  const startTotalMinutes = timeToMinutes(startTime);
  const endTotalMinutes = timeToMinutes(endTime);

  for (
    let slotStart = startTotalMinutes;
    slotStart + slotDuration <= endTotalMinutes;
    slotStart += slotDuration
  ) {
    const slotEnd = slotStart + slotDuration;

    slots.push({
      startTime: minutesToTime(slotStart),
      endTime: minutesToTime(slotEnd),
    });
  }

  return slots;
};

export const formatAvailability = (availability: IAvailabilityDocument) => ({
  id: availability._id.toString(),
  doctorId: availability.doctorId.toString(),
  date: availability.date,
  startTime: availability.startTime,
  endTime: availability.endTime,
  slotDuration: availability.slotDuration,
  isAvailable: availability.isAvailable,
  createdAt: availability.createdAt,
  updatedAt: availability.updatedAt,
});

export const formatAvailabilityWithSlots = (
  availability: IAvailabilityDocument
) => ({
  id: availability._id.toString(),
  date: availability.date,
  startTime: availability.startTime,
  endTime: availability.endTime,
  slotDuration: availability.slotDuration,
  slots: generateAvailabilitySlots({
    startTime: availability.startTime,
    endTime: availability.endTime,
    slotDuration: availability.slotDuration,
  }),
});
