import type { AvailabilityValues } from "@/types/availability";

function timeToMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getRangeCapacity(
  startTime: string,
  endTime: string,
  durationMinutes: number,
  bufferMinutes: number,
): number {
  const availableMinutes = timeToMinutes(endTime) - timeToMinutes(startTime);
  const minutesPerAppointment = durationMinutes + bufferMinutes;

  if (availableMinutes <= 0 || minutesPerAppointment <= 0) return 0;

  // A buffer is needed only between appointments, not after the final one.
  return Math.floor((availableMinutes + bufferMinutes) / minutesPerAppointment);
}

export function getWeeklyCapacity(values: AvailabilityValues): number {
  const minutesPerAppointment = values.durationMinutes + values.bufferMinutes;
  if (minutesPerAppointment <= 0) return 0;

  return values.days.reduce((total, day) => {
    if (!day.enabled) return total;

    const dayCapacity = day.ranges.reduce(
      (totalCapacity, range) =>
        totalCapacity +
        getRangeCapacity(
          range.startTime,
          range.endTime,
          values.durationMinutes,
          values.bufferMinutes,
        ),
      0,
    );

    return total + dayCapacity;
  }, 0);
}

export function getScheduleIssues(values: AvailabilityValues): string[] {
  const issues: string[] = [];

  values.days.forEach((day) => {
    if (!day.enabled) return;

    if (day.ranges.length === 0) {
      issues.push(`${day.day} needs at least one time range.`);
    }

    const sorted = [...day.ranges].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    sorted.forEach((range, index) => {
      if (
        !range.startTime ||
        !range.endTime ||
        range.startTime >= range.endTime
      ) {
        issues.push(`${day.day} has an invalid time range.`);
      }
      if (index > 0 && sorted[index - 1].endTime > range.startTime) {
        issues.push(`${day.day} has overlapping time ranges.`);
      }
    });
  });

  const dates = values.blocks.map((block) => block.date);
  if (new Set(dates).size !== dates.length) {
    issues.push("A blocked date can only be added once.");
  }

  return issues;
}
