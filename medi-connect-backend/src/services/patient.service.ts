import {
  AppointmentModel,
  AppointmentStatusEnum,
} from "../models/appointment.model.js";
import { UserModel } from "../models/auth.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import { formatPatient } from "../utils/appointment.utils.js";
import { ServiceError } from "../utils/service-error.util.js";

/**
 * Returns only patients who have an appointment assigned to the authenticated doctor.
 * Patient accounts remain patient-owned; this endpoint is intentionally read-only.
 */
export const getDoctorPatients = async (
  authenticatedUserId: string | undefined,
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });
  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  const appointments = await AppointmentModel.find({
    doctorId: doctor._id,
  }).sort({
    date: -1,
    startTime: -1,
  });
  if (appointments.length === 0) return [];

  const patientIds = [
    ...new Set(appointments.map((item) => item.patientId.toString())),
  ];
  const patients = await UserModel.find({
    _id: { $in: patientIds },
    role: "patient",
  }).select("_id name email role phone profileImage dateOfBirth gender");

  const patientById = new Map(
    patients.map((patient) => [patient._id.toString(), patient]),
  );

  return patientIds.flatMap((patientId) => {
    const patient = patientById.get(patientId);
    if (!patient) return [];

    const patientAppointments = appointments.filter(
      (appointment) => appointment.patientId.toString() === patientId,
    );
    const latest = patientAppointments[0];

    return [
      {
        patient: formatPatient(patient),
        appointmentSummary: {
          total: patientAppointments.length,
          upcoming: patientAppointments.filter(
            (appointment) =>
              appointment.status === AppointmentStatusEnum.PENDING ||
              appointment.status === AppointmentStatusEnum.CONFIRMED,
          ).length,
          completed: patientAppointments.filter(
            (appointment) =>
              appointment.status === AppointmentStatusEnum.COMPLETED,
          ).length,
          latest: {
            date: latest.date,
            status: latest.status,
            reason: latest.reason ?? null,
          },
        },
      },
    ];
  });
};
