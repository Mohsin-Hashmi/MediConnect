import type { PatientRecord } from "@/types/patient";

// Entirely fictional UI fixture. It does not represent appointment or backend records.
export const PATIENTS_REFERENCE_DATE = "2026-10-10";

const sampleNames = [
  "Amina Example", "Bilal Example", "Cora Example", "Danish Example",
  "Eman Example", "Farah Example", "Gul Example", "Haris Example",
  "Iqra Example", "Junaid Example", "Kiran Example", "Lara Example",
  "Mina Example", "Nabil Example", "Omar Example", "Pari Example",
  "Qasim Example", "Rida Example", "Sana Example", "Tariq Example",
  "Uma Example", "Vania Example", "Waleed Example", "Yusra Example",
];

const careFocuses = [
  "Cardiology follow-up", "Blood pressure review", "Preventive consultation",
  "Routine health review", "Medication review", "Wellness consultation",
];

export const mockPatients: PatientRecord[] = sampleNames.map((name, index) => {
  const number = index + 1;
  const day = String((index % 25) + 1).padStart(2, "0");
  return {
    id: `PAT-D${String(number).padStart(3, "0")}`,
    name,
    age: [17, 28, 35, 42, 58, 66][index % 6],
    gender: index % 5 === 4 ? "Other" : index % 2 === 0 ? "Female" : "Male",
    email: `patient${String(number).padStart(2, "0")}@example.test`,
    careFocus: careFocuses[index % careFocuses.length],
    lastVisitDate: index % 7 === 0 ? null : `2026-09-${day}`,
    nextAppointmentDate: index % 3 === 0 ? `2026-10-${String(11 + (index % 7)).padStart(2, "0")}` : null,
    visitCount: index % 7 === 0 ? 0 : 1 + (index % 8),
    registeredAt: index < 7 ? `2026-10-${day}` : `2026-08-${day}`,
    status: index % 9 === 8 ? "inactive" : "active",
  };
});
