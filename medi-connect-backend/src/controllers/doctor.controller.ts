import type { Request, Response } from "express";

import { UserModel } from "../models/auth.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import type { CreateDoctorInput } from "../schemas/doctor.schema.js";



export const createDoctorProfile = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    const payload = req.body as CreateDoctorInput;

    if (payload.userId && payload.userId !== authenticatedUserId) {
      res.status(400).json({
        success: false,
        message: "Doctor profile must be created for the authenticated user",
      });
      return;
    }

    const user = await UserModel.findById(authenticatedUserId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const existingDoctor = await DoctorModel.findOne({ userId: authenticatedUserId });

    if (existingDoctor) {
      res.status(409).json({
        success: false,
        message: "Doctor profile already exists for this user",
      });
      return;
    }

    const existingLicense = await DoctorModel.findOne({
      licenseNumber: payload.licenseNumber.trim(),
    });

    if (existingLicense) {
      res.status(409).json({
        success: false,
        message: "This license number is already registered",
      });
      return;
    }

    const doctor = await DoctorModel.create({
      userId: authenticatedUserId,
      specialization: payload.specialization,
      qualification: payload.qualification,
      licenseNumber: payload.licenseNumber,
      experience: payload.experience,
      hospitalName: payload.hospitalName ?? null,
      consultationFee: payload.consultationFee ?? null,
      bio: payload.bio ?? null,
      isVerified: payload.isVerified ?? false,
    });

    if (user.role !== "doctor") {
      user.role = "doctor";
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      data: {
        doctor: {
          id: doctor._id.toString(),
          userId: doctor.userId.toString(),
          specialization: doctor.specialization,
          qualification: doctor.qualification,
          licenseNumber: doctor.licenseNumber,
          experience: doctor.experience,
          hospitalName: doctor.hospitalName,
          consultationFee: doctor.consultationFee,
          bio: doctor.bio,
          isVerified: doctor.isVerified,
          createdAt: doctor.createdAt,
          updatedAt: doctor.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Create doctor profile failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctorIdParam = req.params.doctorId;
    const doctorId = Array.isArray(doctorIdParam) ? doctorIdParam[0] : doctorIdParam;

    if (!doctorId || !/^[a-fA-F0-9]{24}$/.test(doctorId)) {
      res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
      return;
    }

    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    const user = await UserModel.findById(doctor.userId).select(
      "_id name email role phone profileImage"
    );

    res.status(200).json({
      success: true,
      message: "Doctor profile retrieved successfully",
      data: {
        doctor: {
          id: doctor._id.toString(),
          userId: doctor.userId.toString(),
          specialization: doctor.specialization,
          qualification: doctor.qualification,
          licenseNumber: doctor.licenseNumber,
          experience: doctor.experience,
          hospitalName: doctor.hospitalName,
          consultationFee: doctor.consultationFee,
          bio: doctor.bio,
          isVerified: doctor.isVerified,
          createdAt: doctor.createdAt,
          updatedAt: doctor.updatedAt,
        },
        user: user
          ? {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
              profileImage: user.profileImage,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get doctor profile failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};