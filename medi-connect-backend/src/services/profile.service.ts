import { UserModel } from "../models/auth.model.js";
import type { ProfileUpdateInput } from "../schemas/auth.schema.js";
import { ServiceError } from "../utils/service-error.util.js";
import { formatUserProfile } from "../utils/profile.utils.js";

const userProfileSelect =
  "_id name email role phone profileImage dateOfBirth gender address createdAt updatedAt";

/**
 * - Gets the authenticated user's profile.
 * - Throws if the user cannot be found.
 */
export const fetchUserProfile = async (userId: string | undefined) => {
  if (!userId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const user = await UserModel.findById(userId).select(userProfileSelect);

  if (!user) {
    throw new ServiceError("NOT_FOUND", "User profile not found");
  }

  return formatUserProfile(user);
};

/**
 * - Updates the authenticated user's profile fields.
 * - Returns the updated profile data.
 */
export const editUserProfile = async (
  userId: string | undefined,
  updateData: Partial<ProfileUpdateInput>,
) => {
  if (!userId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new ServiceError(
      "INVALID_INPUT",
      "No profile fields provided for update",
    );
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        ...updateData,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).select(userProfileSelect);

  if (!user) {
    throw new ServiceError("NOT_FOUND", "User profile not found");
  }

  return formatUserProfile(user);
};

/**
 * - Deletes the authenticated user's profile.
 * - Throws if the user cannot be found.
 */
export const deleteUserProfile = async (userId: string | undefined) => {
  if (!userId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    throw new ServiceError("NOT_FOUND", "User profile not found");
  }
};
