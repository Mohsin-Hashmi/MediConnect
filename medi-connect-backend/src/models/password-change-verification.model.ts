import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPasswordChangeVerificationDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  codeHash: string;
  expiresAt: Date;
  lastSentAt: Date;
  attempts: number;
}

const passwordChangeVerificationSchema =
  new Schema<IPasswordChangeVerificationDocument>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },
      codeHash: {
        type: String,
        required: true,
        select: false,
      },
      expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
      },
      lastSentAt: {
        type: Date,
        required: true,
      },
      attempts: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
    },
    { timestamps: true },
  );

export const PasswordChangeVerificationModel: Model<IPasswordChangeVerificationDocument> =
  mongoose.models.PasswordChangeVerification ||
  mongoose.model<IPasswordChangeVerificationDocument>(
    "PasswordChangeVerification",
    passwordChangeVerificationSchema,
  );
