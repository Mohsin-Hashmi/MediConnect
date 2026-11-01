import mongoose, { Schema, type Document, type Model } from "mongoose";

import type { IReview } from "../types/review.js";

export interface IReviewDocument
  extends Omit<
      IReview,
      "_id" | "appointmentId" | "patientId" | "doctorId"
    >,
    Document {
  _id: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
}

const doctorReplySchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },
    repliedAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
);

const reviewSchema = new Schema<IReviewDocument>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
      index: true,
    },
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: Number.isInteger,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    tags: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 40,
        },
      ],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 5,
        message: "A review can contain at most 5 tags",
      },
    },
    doctorReply: {
      type: doctorReplySchema,
      default: null,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ doctorId: 1, createdAt: -1 });
reviewSchema.index({ doctorId: 1, rating: 1, createdAt: -1 });
reviewSchema.index({ patientId: 1, createdAt: -1 });

export const ReviewModel: Model<IReviewDocument> =
  mongoose.models.Review ||
  mongoose.model<IReviewDocument>("Review", reviewSchema);
