export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface DoctorReviewReply {
  message: string;
  repliedAt: Date;
}

export interface IReview {
  _id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  rating: ReviewRating;
  comment: string;
  tags: string[];
  doctorReply?: DoctorReviewReply | null;
  createdAt?: Date;
  updatedAt?: Date;
}
