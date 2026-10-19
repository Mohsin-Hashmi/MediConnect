"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { AXIOS } from "@/lib/axios";
import { mapDoctorAppointmentFromApi } from "@/lib/appointment-api";
import type { ApiErrorResponse } from "@/types/auth";
import type {
  AppointmentMutationResponse,
  CancelAppointmentPayload,
  DoctorAppointmentResponse,
  DoctorAppointmentsResponse,
} from "@/types/appointment";

export function useDoctorAppointments() {
  return useQuery({
    queryKey: ["doctor", "appointments"],
    queryFn: async () => {
      const response = await AXIOS.get<DoctorAppointmentsResponse>(
        "/appointments/doctor",
      );
      return response.data.data.appointments;
    },
    select: (appointments) => appointments.map(mapDoctorAppointmentFromApi),
  });
}

export function useDoctorAppointment(appointmentId?: string) {
  return useQuery({
    queryKey: ["doctor", "appointments", appointmentId ?? ""],
    enabled: Boolean(appointmentId),
    queryFn: async () => {
      const response = await AXIOS.get<DoctorAppointmentResponse>(
        `/appointments/${appointmentId}`,
      );
      return response.data.data;
    },
    select: mapDoctorAppointmentFromApi,
  });
}

function useStatusMutation(endpoint: "confirm" | "complete") {
  const queryClient = useQueryClient();

  return useMutation<
    AppointmentMutationResponse,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: async (appointmentId) => {
      const response = await AXIOS.patch<AppointmentMutationResponse>(
        `/appointments/${appointmentId}/${endpoint}`,
      );
      return response.data;
    },
    onSuccess: async (_data, appointmentId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["doctor", "appointments"],
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: ["doctor", "appointments", appointmentId],
        }),
        queryClient.invalidateQueries({ queryKey: ["doctor", "patients"] }),
      ]);
    },
  });
}

export function useConfirmAppointment() {
  return useStatusMutation("confirm");
}

export function useCompleteAppointment() {
  return useStatusMutation("complete");
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation<
    AppointmentMutationResponse,
    AxiosError<ApiErrorResponse>,
    CancelAppointmentPayload
  >({
    mutationFn: async ({ appointmentId, cancellationReason }) => {
      const response = await AXIOS.patch<AppointmentMutationResponse>(
        `/appointments/${appointmentId}/cancel`,
        { cancellationReason },
      );
      return response.data;
    },
    onSuccess: async (_data, { appointmentId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["doctor", "appointments"],
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: ["doctor", "appointments", appointmentId],
        }),
        queryClient.invalidateQueries({ queryKey: ["doctor", "patients"] }),
      ]);
    },
  });
}
