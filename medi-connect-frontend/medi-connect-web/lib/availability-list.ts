import type {
  AvailabilityFilters,
  AvailabilityRecord,
} from "@/types/availability";

function localDateKey(value: string): string {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getFilteredAvailabilities(
  availabilities: readonly AvailabilityRecord[],
  filters: AvailabilityFilters,
): AvailabilityRecord[] {
  const query = filters.search.trim().toLowerCase();
  return availabilities
    .filter((availability) => {
      const status = availability.isAvailable ? "available" : "paused";
      const searchable = [
        availability.id,
        availability.startTime,
        availability.endTime,
        `${availability.slotDuration} minutes`,
        status,
      ];
      return (
        (!query ||
          searchable.some((value) => value.toLowerCase().includes(query))) &&
        (!filters.date || localDateKey(availability.date) === filters.date) &&
        (filters.status === "all" || status === filters.status)
      );
    })
    .sort((first, second) => {
      const firstDateTime = `${localDateKey(first.date)}T${first.startTime}`;
      const secondDateTime = `${localDateKey(second.date)}T${second.startTime}`;
      return filters.sort === "newest"
        ? secondDateTime.localeCompare(firstDateTime)
        : firstDateTime.localeCompare(secondDateTime);
    });
}
