import mongoose, { Schema, type Document, type Model } from "mongoose";

import type { IAvailability } from "../types/availability.js";

export interface IAvailabilityDocument
  extends Omit<IAvailability, "_id" | "doctorId">,
    Document {
  _id: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
}

const availabilitySchema = new Schema<IAvailabilityDocument>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    slotDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

availabilitySchema.index({ doctorId: 1, date: 1 });

export const AvailabilityModel: Model<IAvailabilityDocument> = mongoose.models.Availability || mongoose.model<IAvailabilityDocument>("Availability", availabilitySchema);
