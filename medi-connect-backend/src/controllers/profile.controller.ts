import type { Request, Response } from "express";

import { UserModel } from "../models/auth.model.js";
import type { ProfileUpdateInput } from "../schemas/auth.schema.js";

export const fetchUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    const user = await UserModel.findById(userId).select(
      "_id name email role phone profileImage dateOfBirth gender address createdAt updatedAt"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user profile failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    const updateData = req.body as Partial<ProfileUpdateInput>;

    if (!updateData || Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: "No profile fields provided for update",
      });
      return;
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
      }
    ).select("_id name email role phone profileImage dateOfBirth gender address createdAt updatedAt");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Update user profile failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User profile not found",
      });
      return;
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
      data: {
        message: "Your account has been permanently deleted",
      },
    });
  } catch (error) {
    console.error("Delete user profile failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
