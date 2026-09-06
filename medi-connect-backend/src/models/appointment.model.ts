import mongoose, { Schema, type Document, type Model } from "mongoose";

import type { AppointmentStatus, IAppointment } from "../types/appointment.js";

export enum AppointmentStatusEnum {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IAppointmentDocument
  extends Omit<
      IAppointment,
      "_id" | "patientId" | "doctorId" | "availabilityId" | "status"
    >,
    Document {
  _id: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  availabilityId: mongoose.Types.ObjectId;
  status: AppointmentStatus;
}

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    availabilityId: {
      type: Schema.Types.ObjectId,
      ref: "Availability",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatusEnum),
      default: AppointmentStatusEnum.PENDING,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    cancelledBy: {
      type: String,
      enum: ["patient", "doctor"],
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const AppointmentModel: Model<IAppointmentDocument> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointmentDocument>("Appointment", appointmentSchema);
