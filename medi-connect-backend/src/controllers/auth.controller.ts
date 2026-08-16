import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import { UserModel } from "../models/auth.model.js";
import type {
  LoginInput,
  RegisterInput,
} from "../schemas/auth.schema.js";
import {
  generateAccessToken,
  generateAuthTokens,
  verifyRefreshToken,
} from "../utils/token.util.js";

const BCRYPT_SALT_ROUNDS = 10;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, profileImage, dateOfBirth, gender, address } = req.body as RegisterInput;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      profileImage,
      dateOfBirth,
      gender,
      address,
      role,
    });

    const tokens = generateAuthTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie("token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.error("Register request failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
      return;
    }

    const tokens = generateAuthTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie("token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.error("Login request failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Invalidate the refresh token on the client side by removing it from storage
    const refreshToken = req.cookies.token as string;
    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "Refresh token is required for logout",
      });
      return;
    }
    const isValidRefreshToken = await verifyRefreshToken(refreshToken); // Verify the refresh token before logout

    if (!isValidRefreshToken) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
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
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout request failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.token as string;
    const refreshPayload = verifyRefreshToken(refreshToken);

    if (!refreshPayload) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
      return;
    }

    const user = await UserModel.findById(refreshPayload.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
      return;
    }

    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Access token generated successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.error("Refresh token request failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
