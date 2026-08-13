import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IUser, UserRoleName } from "../types/user.js";

export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
}

export interface IUserDocument extends Omit<IUser, "_id" | "role">, Document {
  _id: mongoose.Types.ObjectId;
  role: UserRoleName;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PATIENT,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);


