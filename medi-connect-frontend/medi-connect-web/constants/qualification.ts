export const QUALIFICATIONS_STORAGE_KEY =
  "mediconnect_doctor_qualifications";

export const INITIAL_QUALIFICATIONS = [] as const;

export const GRADUATION_YEARS = Array.from(
  { length: 70 },
  (_, index) => `${new Date().getFullYear() - index}`,
);
