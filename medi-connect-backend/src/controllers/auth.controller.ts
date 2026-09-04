import type { Request, Response } from "express";

import type {
  LoginInput,
  RegisterInput,
} from "../schemas/auth.schema.js";
import {
  loginUser as loginUserService,
  logoutUser as logoutUserService,
  refreshAccessToken as refreshAccessTokenService,
  registerUser as registerUserService,
} from "../services/auth.service.js";
import { sendControllerError } from "../utils/http-response.util.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearRefreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

/**
 * - Reads registration data from the request body.
 * - Stores refresh token cookie and sends created user response.
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await registerUserService(req.body as RegisterInput);

    res.cookie("token", result.refreshToken, refreshCookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Register request failed:");
  }
};

/**
 * - Reads login credentials from the request body.
 * - Stores refresh token cookie and sends access token response.
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await loginUserService(req.body as LoginInput);

    res.cookie("token", result.refreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Login request failed:");
  }
};

/**
 * - Reads refresh token from cookies.
 * - Validates logout and clears the refresh token cookie.
 */
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.token as string;

    logoutUserService(refreshToken);

    res.clearCookie("token", clearRefreshCookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    sendControllerError(res, error, "Logout request failed:");
  }
};

/**
 * - Reads refresh token from cookies.
 * - Sends a newly generated access token.
 */
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.token as string;
    const accessToken = await refreshAccessTokenService(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token generated successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Refresh token request failed:");
  }
};
