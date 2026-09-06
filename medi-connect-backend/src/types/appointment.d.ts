export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface IAppointment {
  _id: string;
  patientId: string;
  doctorId: string;
  availabilityId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: "patient" | "doctor";
  cancelledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
