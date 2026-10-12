import type { AvailabilityValues } from "@/types/availability";

export function getWeeklyCapacity(values: AvailabilityValues) {
  const minutesPerAppointment = values.durationMinutes + values.bufferMinutes;
  if (minutesPerAppointment <= 0) return 0;
  return values.days.reduce((total, day) => {
    if (!day.enabled) return total;
    return total + day.ranges.reduce((dayTotal, range) => {
      const [startHours, startMinutes] = range.startTime.split(":").map(Number);
      const [endHours, endMinutes] = range.endTime.split(":").map(Number);
      const availableMinutes = endHours * 60 + endMinutes - startHours * 60 - startMinutes;
      // A buffer is needed only between appointments, not after the last one.
      return dayTotal + Math.max(0, Math.floor((availableMinutes + values.bufferMinutes) / minutesPerAppointment));
    }, 0);
  }, 0);
}

export function getScheduleIssues(values: AvailabilityValues) {
  const issues: string[] = [];
  values.days.forEach((day) => {
    if (!day.enabled) return;
    if (day.ranges.length === 0) issues.push(`${day.day} needs at least one time range.`);
    const sorted = [...day.ranges].sort((a, b) => a.startTime.localeCompare(b.startTime));
    sorted.forEach((range, index) => {
      if (!range.startTime || !range.endTime || range.startTime >= range.endTime) {
        issues.push(`${day.day} has an invalid time range.`);
      }
      if (index > 0 && sorted[index - 1].endTime > range.startTime) {
        issues.push(`${day.day} has overlapping time ranges.`);
      }
    });
  });
  const dates = values.blocks.map((block) => block.date);
  if (new Set(dates).size !== dates.length) issues.push("A blocked date can only be added once.");
  return issues;
}
