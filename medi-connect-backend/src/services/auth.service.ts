import bcrypt from "bcrypt";

import { UserModel } from "../models/auth.model.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import {
  generateAccessToken,
  generateAuthTokens,
  verifyRefreshToken,
} from "../utils/token.util.js";
import { ServiceError } from "../utils/service-error.util.js";
import { formatAuthUser, BCRYPT_SALT_ROUNDS } from "../utils/auth.utils.js";

/**
 * - Creates a new user after checking email uniqueness.
 * - Hashes the password and returns auth tokens.
 */
export const registerUser = async (payload: RegisterInput) => {
  const existingUser = await UserModel.findOne({ email: payload.email });

  if (existingUser) {
    throw new ServiceError("CONFLICT", "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    BCRYPT_SALT_ROUNDS,
  );

  const user = await UserModel.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    phone: payload.phone,
    profileImage: payload.profileImage,
    dateOfBirth: payload.dateOfBirth,
    gender: payload.gender,
    address: payload.address,
    role: payload.role,
  });

  const tokens = generateAuthTokens({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: formatAuthUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

/**
 * - Verifies user credentials.
 * - Returns safe user data with auth tokens.
 */
export const loginUser = async (payload: LoginInput) => {
  const user = await UserModel.findOne({ email: payload.email });

  if (!user) {
    throw new ServiceError("UNAUTHENTICATED", "Invalid Credentials");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new ServiceError("UNAUTHENTICATED", "Invalid Credentials");
  }

  const tokens = generateAuthTokens({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: formatAuthUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

/**
 * - Verifies the refresh token before logout.
 * - Throws if the token is missing or invalid.
 */
export const logoutUser = (refreshToken?: string) => {
  if (!refreshToken) {
    throw new ServiceError(
      "UNAUTHENTICATED",
      "Refresh token is required for logout",
    );
  }

  const refreshPayload = verifyRefreshToken(refreshToken);

  if (!refreshPayload) {
    throw new ServiceError("UNAUTHENTICATED", "Invalid refresh token");
  }
};

/**
 * - Verifies the refresh token.
 * - Creates a new access token for the token owner.
 */
export const refreshAccessToken = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new ServiceError(
      "UNAUTHENTICATED",
      "Invalid or expired refresh token",
    );
  }

  const refreshPayload = verifyRefreshToken(refreshToken);

  if (!refreshPayload) {
    throw new ServiceError(
      "UNAUTHENTICATED",
      "Invalid or expired refresh token",
    );
  }

  const user = await UserModel.findById(refreshPayload.userId);

  if (!user) {
    throw new ServiceError("UNAUTHENTICATED", "Invalid refresh token");
  }

  return generateAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });
};
