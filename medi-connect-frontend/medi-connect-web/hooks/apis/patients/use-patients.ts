"use client";

import { useQuery } from "@tanstack/react-query";

import { AXIOS } from "@/lib/axios";
import { mapDoctorPatientFromApi } from "@/lib/patient-list";
import type { DoctorPatientsResponse } from "@/types/patient";

export function useDoctorPatients() {
  return useQuery({
    queryKey: ["doctor", "patients"],
    queryFn: async () => {
      const response = await AXIOS.get<DoctorPatientsResponse>("/patients/doctor");
      return response.data.data.patients;
    },
    select: (patients) => patients.map(mapDoctorPatientFromApi),
  });
}
