import type { NextFunction, Request, Response } from "express";

import { UserModel } from "../models/auth.model.js";
import { verifyAccessToken } from "../utils/token.util.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!accessToken) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }

    const tokenPayload = verifyAccessToken(accessToken);

    if (!tokenPayload) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
      return;
    }

    const { userId } = tokenPayload;
    const user = await UserModel.findById(userId).select("_id name email role");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User is not authorized",
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
