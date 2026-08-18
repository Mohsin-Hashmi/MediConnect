import mongoose, { Schema, type Document, type Model } from "mongoose";

import type { IDoctor } from "../types/doctor.js";

export interface IDoctorDocument
  extends Omit<IDoctor, "_id" | "userId">,
    Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const qualificationSchema = new Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    institute: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear() + 1,
    },
  },
  {
    _id: false,
  }
);

const doctorSchema = new Schema<IDoctorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    qualification: {
      type: [qualificationSchema],
      required: true,
      default: [],
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 80,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 80,
    },
    hospitalName: {
      type: String,
      trim: true,
      default: null,
    },
    consultationFee: {
      type: Number,
      min: 0,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const DoctorModel: Model<IDoctorDocument> =
  mongoose.models.Doctor || mongoose.model<IDoctorDocument>("Doctor", doctorSchema);
