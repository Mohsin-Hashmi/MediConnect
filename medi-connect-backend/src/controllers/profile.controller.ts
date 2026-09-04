import type { Request, Response } from "express";

import type { ProfileUpdateInput } from "../schemas/auth.schema.js";
import {
  deleteUserProfile as deleteUserProfileService,
  editUserProfile as editUserProfileService,
  fetchUserProfile as fetchUserProfileService,
} from "../services/profile.service.js";
import { sendControllerError } from "../utils/http-response.util.js";

const clearRefreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

/**
 * - Reads the authenticated user from the request.
 * - Sends the user's profile data.
 */
export const fetchUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await fetchUserProfileService(req.user?.id);

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Get user profile failed:");
  }
};

/**
 * - Reads profile update data from the request body.
 * - Sends the updated profile response.
 */
export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const updateData = req.body as Partial<ProfileUpdateInput>;
    const user = await editUserProfileService(req.user?.id, updateData);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Update user profile failed:");
  }
};

/**
 * - Reads the authenticated user from the request.
 * - Deletes the profile and clears the refresh cookie.
 */
export const deleteUserProfile = async (req: Request, res: Response) => {
  try {
    await deleteUserProfileService(req.user?.id);

    res.clearCookie("token", clearRefreshCookieOptions);

    res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
      data: {
        message: "Your account has been permanently deleted",
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Delete user profile failed:");
  }
};
