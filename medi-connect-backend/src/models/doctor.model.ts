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
    subspecialty: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    qualification: {
      type: [qualificationSchema],
      required: true,
      default: [],
    },
    profilePicture: {
      type: String,
      trim: true,
      default: null,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 80,
    },
    licensingAuthority: {
      type: String,
      trim: true,
      maxlength: 150,
      default: null,
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
    languages: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      default: [],
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
