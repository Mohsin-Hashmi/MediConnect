import mongoose, { type QueryFilter, type SortOrder } from "mongoose";

import {
  AppointmentModel,
  AppointmentStatusEnum,
} from "../models/appointment.model.js";
import { UserModel } from "../models/auth.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import { ReviewModel, type IReviewDocument } from "../models/review.model.js";
import type {
  CreateReviewInput,
  DoctorReviewsQuery,
  PatientReviewsQuery,
  ReplyToReviewInput,
} from "../schemas/review.schema.js";
import { ServiceError } from "../utils/service-error.util.js";
import {
  formatReview,
  formatReviewAppointment,
  getPagination,
  isDuplicateKeyError,
} from "../utils/review.utils.js";

const escapeRegularExpression = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createReview = async (
  authenticatedPatientId: string | undefined,
  input: CreateReviewInput,
) => {
  if (!authenticatedPatientId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const appointment = await AppointmentModel.findById(input.appointmentId);
  if (!appointment) {
    throw new ServiceError("NOT_FOUND", "Appointment not found");
  }
  if (appointment.patientId.toString() !== authenticatedPatientId) {
    throw new ServiceError(
      "UNAUTHORIZED",
      "You can only review your own appointments",
    );
  }
  if (appointment.status !== AppointmentStatusEnum.COMPLETED) {
    throw new ServiceError(
      "CONFLICT",
      "Only completed appointments can be reviewed",
    );
  }

  const existingReview = await ReviewModel.exists({
    appointmentId: appointment._id,
  });
  if (existingReview) {
    throw new ServiceError(
      "CONFLICT",
      "This appointment has already been reviewed",
    );
  }

  try {
    const review = await ReviewModel.create({
      appointmentId: appointment._id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      rating: input.rating,
      comment: input.comment,
      tags: [...new Set(input.tags)],
    });

    return formatReview(review);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ServiceError(
        "CONFLICT",
        "This appointment has already been reviewed",
      );
    }
    throw error;
  }
};

const getDoctorReviewSummary = async (doctorId: string) => {
  const [result] = await ReviewModel.aggregate<{
    summary: Array<{
      totalReviews: number;
      averageRating: number;
      positiveReviews: number;
      unansweredReviews: number;
    }>;
    distribution: Array<{ _id: number; count: number }>;
  }>([
    { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalReviews: { $sum: 1 },
              averageRating: { $avg: "$rating" },
              positiveReviews: {
                $sum: { $cond: [{ $gte: ["$rating", 4] }, 1, 0] },
              },
              unansweredReviews: {
                $sum: {
                  $cond: [
                    { $eq: [{ $ifNull: ["$doctorReply", null] }, null] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        distribution: [
          { $group: { _id: "$rating", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
        ],
      },
    },
  ]);

  const summary = result?.summary[0];
  const totalReviews = summary?.totalReviews ?? 0;
  const distributionByRating = new Map(
    (result?.distribution ?? []).map((item) => [item._id, item.count]),
  );

  return {
    averageRating: summary?.averageRating ?? 0,
    totalReviews,
    positivePercentage:
      totalReviews === 0
        ? 0
        : ((summary?.positiveReviews ?? 0) / totalReviews) * 100,
    unansweredReviews: summary?.unansweredReviews ?? 0,
    ratingDistribution: [5, 4, 3, 2, 1].map((rating) => {
      const count = distributionByRating.get(rating) ?? 0;
      return {
        rating,
        count,
        percentage: totalReviews === 0 ? 0 : (count / totalReviews) * 100,
      };
    }),
  };
};

const getDoctorReviewFilter = async (
  doctorId: string,
  query: DoctorReviewsQuery,
): Promise<QueryFilter<IReviewDocument>> => {
  const filter: QueryFilter<IReviewDocument> = { doctorId };

  if (query.rating) filter.rating = query.rating;
  if (query.replyStatus === "replied") filter.doctorReply = { $ne: null };
  if (query.replyStatus === "unanswered") filter.doctorReply = null;

  if (query.search) {
    const searchExpression = new RegExp(
      escapeRegularExpression(query.search),
      "i",
    );
    const [patients, appointments] = await Promise.all([
      UserModel.find({ role: "patient", name: searchExpression }).select("_id"),
      AppointmentModel.find({
        doctorId,
        reason: searchExpression,
      }).select("_id"),
    ]);

    filter.$or = [
      { comment: searchExpression },
      { tags: searchExpression },
      { patientId: { $in: patients.map((patient) => patient._id) } },
      {
        appointmentId: {
          $in: appointments.map((appointment) => appointment._id),
        },
      },
    ];
  }

  return filter;
};

export const getDoctorReviews = async (
  authenticatedDoctorUserId: string | undefined,
  query: DoctorReviewsQuery,
) => {
  if (!authenticatedDoctorUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const doctor = await DoctorModel.findOne({
    userId: authenticatedDoctorUserId,
  });
  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  const filter = await getDoctorReviewFilter(doctor._id.toString(), query);
  const sort: Record<string, SortOrder> =
    query.sort === "oldest"
      ? { createdAt: 1 }
      : query.sort === "highest"
        ? { rating: -1, createdAt: -1 }
        : query.sort === "lowest"
          ? { rating: 1, createdAt: -1 }
          : { createdAt: -1 };
  const skip = (query.page - 1) * query.limit;

  const [reviews, total, summary] = await Promise.all([
    ReviewModel.find(filter).sort(sort).skip(skip).limit(query.limit),
    ReviewModel.countDocuments(filter),
    getDoctorReviewSummary(doctor._id.toString()),
  ]);

  const patientIds = [
    ...new Set(reviews.map((review) => review.patientId.toString())),
  ];
  const appointmentIds = [
    ...new Set(reviews.map((review) => review.appointmentId.toString())),
  ];
  const [patients, appointments] = await Promise.all([
    UserModel.find({ _id: { $in: patientIds } }).select(
      "_id name profileImage",
    ),
    AppointmentModel.find({ _id: { $in: appointmentIds } }).select(
      "_id date startTime endTime status reason",
    ),
  ]);
  const patientById = new Map(
    patients.map((patient) => [patient._id.toString(), patient]),
  );
  const appointmentById = new Map(
    appointments.map((appointment) => [
      appointment._id.toString(),
      appointment,
    ]),
  );

  return {
    reviews: reviews.map((review) => {
      const patient = patientById.get(review.patientId.toString());
      const appointment = appointmentById.get(review.appointmentId.toString());

      return {
        review: formatReview(review),
        patient: patient
          ? {
              id: patient._id.toString(),
              name: patient.name,
              profileImage: patient.profileImage ?? null,
            }
          : null,
        appointment: appointment ? formatReviewAppointment(appointment) : null,
      };
    }),
    summary,
    pagination: getPagination(query.page, query.limit, total),
  };
};

export const getPatientReviews = async (
  authenticatedPatientId: string | undefined,
  query: PatientReviewsQuery,
) => {
  if (!authenticatedPatientId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const filter = { patientId: authenticatedPatientId };
  const skip = (query.page - 1) * query.limit;
  const [reviews, total] = await Promise.all([
    ReviewModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit),
    ReviewModel.countDocuments(filter),
  ]);
  const appointmentIds = reviews.map((review) => review.appointmentId);
  const doctorIds = reviews.map((review) => review.doctorId);
  const [appointments, doctors] = await Promise.all([
    AppointmentModel.find({ _id: { $in: appointmentIds } }).select(
      "_id date startTime endTime status reason",
    ),
    DoctorModel.find({ _id: { $in: doctorIds } }).select(
      "_id userId specialization profilePicture isVerified",
    ),
  ]);
  const doctorUserIds = doctors.map((doctor) => doctor.userId);
  const doctorUsers = await UserModel.find({
    _id: { $in: doctorUserIds },
  }).select("_id name profileImage");
  const appointmentById = new Map(
    appointments.map((appointment) => [
      appointment._id.toString(),
      appointment,
    ]),
  );
  const doctorById = new Map(
    doctors.map((doctor) => [doctor._id.toString(), doctor]),
  );
  const doctorUserById = new Map(
    doctorUsers.map((user) => [user._id.toString(), user]),
  );

  return {
    reviews: reviews.map((review) => {
      const appointment = appointmentById.get(review.appointmentId.toString());
      const doctor = doctorById.get(review.doctorId.toString());
      const doctorUser = doctor
        ? doctorUserById.get(doctor.userId.toString())
        : undefined;

      return {
        review: formatReview(review),
        appointment: appointment ? formatReviewAppointment(appointment) : null,
        doctor: doctor
          ? {
              id: doctor._id.toString(),
              userId: doctor.userId.toString(),
              specialization: doctor.specialization,
              profilePicture: doctor.profilePicture ?? null,
              isVerified: doctor.isVerified,
            }
          : null,
        doctorUser: doctorUser
          ? {
              id: doctorUser._id.toString(),
              name: doctorUser.name,
              profileImage: doctorUser.profileImage ?? null,
            }
          : null,
      };
    }),
    pagination: getPagination(query.page, query.limit, total),
  };
};

export const replyToReview = async (
  authenticatedDoctorUserId: string | undefined,
  reviewId: string,
  input: ReplyToReviewInput,
) => {
  if (!authenticatedDoctorUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const [doctor, review] = await Promise.all([
    DoctorModel.findOne({ userId: authenticatedDoctorUserId }),
    ReviewModel.findById(reviewId),
  ]);
  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }
  if (!review) {
    throw new ServiceError("NOT_FOUND", "Review not found");
  }
  if (review.doctorId.toString() !== doctor._id.toString()) {
    throw new ServiceError(
      "UNAUTHORIZED",
      "You can only reply to reviews for your own profile",
    );
  }
  if (review.doctorReply) {
    throw new ServiceError("CONFLICT", "This review already has a reply");
  }

  review.doctorReply = {
    message: input.message,
    repliedAt: new Date(),
  };
  await review.save();

  return formatReview(review);
};
