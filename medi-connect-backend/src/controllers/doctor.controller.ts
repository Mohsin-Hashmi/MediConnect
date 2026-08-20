import type { Request, Response } from "express";

import { UserModel } from "../models/auth.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import type {
  CreateDoctorInput,
  UpdateDoctorInput,
} from "../schemas/doctor.schema.js";


;

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

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const queryValue = (value: unknown): string | undefined =>
      typeof value === "string" ? value : undefined;
    const specialization = queryValue(req.query.specialization)?.trim();
    const experienceValue = queryValue(req.query.experience);
    const search = queryValue(req.query.search)?.trim();
    const pageValue = queryValue(req.query.page) ?? "1";
    const limitValue = queryValue(req.query.limit) ?? "10";
    const page = Number(pageValue);
    const limit = Number(limitValue);

    if (
      (experienceValue !== undefined &&
        (!/^\d+(\.\d+)?$/.test(experienceValue) || Number(experienceValue) < 0)) ||
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid filter or pagination parameters",
      });
      return;
    }

    const filter: Record<string, unknown> = {};

    if (specialization) {
      filter.specialization = new RegExp(
        specialization.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
    }

    if (experienceValue !== undefined) {
      filter.experience = Number(experienceValue);
    }

    if (search) {
      const searchRegex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [
        { specialization: searchRegex },
        { hospitalName: searchRegex },
        { bio: searchRegex },
        { "qualification.degree": searchRegex },
        { "qualification.institute": searchRegex },
      ];
    }

    const skip = (page - 1) * limit;
    const [doctors, total] = await Promise.all([
      DoctorModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DoctorModel.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: "Doctor profiles retrieved successfully",
      data: {
        doctors: doctors.map((doctor) => ({
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
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all doctors failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const deleteDoctorProfile = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    const doctor = await DoctorModel.findOneAndDelete({ userId: authenticatedUserId });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    const user = await UserModel.findById(authenticatedUserId);

    if (user && user.role === "doctor") {
      user.role = "patient";
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Doctor profile deleted successfully",
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
    console.error("Delete doctor profile failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateDoctorProfile = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    const payload = req.body as UpdateDoctorInput;

    if (!payload || Object.keys(payload).length === 0) {
      res.status(400).json({
        success: false,
        message: "No doctor profile fields provided for update",
      });
      return;
    }

    const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    if (payload.licenseNumber) {
      const existingLicense = await DoctorModel.findOne({
        licenseNumber: payload.licenseNumber,
        _id: { $ne: doctor._id },
      });

      if (existingLicense) {
        res.status(409).json({
          success: false,
          message: "This license number is already registered",
        });
        return;
      }
    }

    const updatedDoctor = await DoctorModel.findByIdAndUpdate(
      doctor._id,
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: {
        doctor: {
          id: updatedDoctor._id.toString(),
          userId: updatedDoctor.userId.toString(),
          specialization: updatedDoctor.specialization,
          qualification: updatedDoctor.qualification,
          licenseNumber: updatedDoctor.licenseNumber,
          experience: updatedDoctor.experience,
          hospitalName: updatedDoctor.hospitalName,
          consultationFee: updatedDoctor.consultationFee,
          bio: updatedDoctor.bio,
          isVerified: updatedDoctor.isVerified,
          createdAt: updatedDoctor.createdAt,
          updatedAt: updatedDoctor.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Update doctor profile failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};