import bcrypt from "bcrypt";

import { UserModel } from "../models/auth.model.js";
import { PasswordChangeVerificationModel } from "../models/password-change-verification.model.js";
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
} from "../schemas/auth.schema.js";
import { sendPasswordChangeVerificationEmail } from "./email.service.js";
import {
  generateAccessToken,
  generateAuthTokens,
  verifyRefreshToken,
} from "../utils/token.util.js";
import { ServiceError } from "../utils/service-error.util.js";
import { formatAuthUser, BCRYPT_SALT_ROUNDS } from "../utils/auth.utils.js";
import { generateSixDigitVerificationCode } from "../utils/verification-code.util.js";

const PASSWORD_CHANGE_CODE_EXPIRY_MS = 10 * 60 * 1000;
const PASSWORD_CHANGE_RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_PASSWORD_CHANGE_CODE_ATTEMPTS = 5;

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
    authVersion: user.authVersion,
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
    authVersion: user.authVersion,
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

  if (refreshPayload.authVersion !== user.authVersion) {
    throw new ServiceError("UNAUTHENTICATED", "Invalid or expired refresh token");
  }

  return generateAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    authVersion: user.authVersion,
  });
};

/** Sends a time-limited code to verify an authenticated password change. */
export const requestPasswordChangeVerification = async (
  authenticatedUserId: string | undefined,
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const user = await UserModel.findById(authenticatedUserId).select("_id email");

  if (!user) {
    throw new ServiceError("NOT_FOUND", "User not found");
  }

  const existingVerification = await PasswordChangeVerificationModel.findOne({
    userId: user._id,
  }).select("lastSentAt");
  const now = new Date();

  if (
    existingVerification &&
    now.getTime() - existingVerification.lastSentAt.getTime() <
      PASSWORD_CHANGE_RESEND_COOLDOWN_MS
  ) {
    throw new ServiceError(
      "CONFLICT",
      "Please wait before requesting another verification code",
    );
  }

  const verificationCode = generateSixDigitVerificationCode();
  const codeHash = await bcrypt.hash(verificationCode, BCRYPT_SALT_ROUNDS);

  await PasswordChangeVerificationModel.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        codeHash,
        expiresAt: new Date(now.getTime() + PASSWORD_CHANGE_CODE_EXPIRY_MS),
        lastSentAt: now,
        attempts: 0,
      },
    },
    { upsert: true, returnDocument: "after", runValidators: true },
  );

  try {
    await sendPasswordChangeVerificationEmail({
      recipientEmail: user.email,
      verificationCode,
    });
  } catch (error) {
    await PasswordChangeVerificationModel.deleteOne({
      userId: user._id,
      codeHash,
    });
    throw error;
  }
};

/** Verifies a code, changes the password, and invalidates existing sessions. */
export const changePassword = async (
  authenticatedUserId: string | undefined,
  payload: ChangePasswordInput,
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const verification = await PasswordChangeVerificationModel.findOne({
    userId: authenticatedUserId,
  }).select("+codeHash expiresAt attempts");
  const now = new Date();

  if (!verification || verification.expiresAt <= now) {
    if (verification) {
      await PasswordChangeVerificationModel.deleteOne({ _id: verification._id });
    }

    throw new ServiceError(
      "INVALID_INPUT",
      "Verification code is invalid or expired",
    );
  }

  if (verification.attempts >= MAX_PASSWORD_CHANGE_CODE_ATTEMPTS) {
    await PasswordChangeVerificationModel.deleteOne({ _id: verification._id });
    throw new ServiceError(
      "INVALID_INPUT",
      "Verification code is invalid or expired",
    );
  }

  const isVerificationCodeValid = await bcrypt.compare(
    payload.verificationCode,
    verification.codeHash,
  );

  if (!isVerificationCodeValid) {
    await PasswordChangeVerificationModel.updateOne(
      { _id: verification._id },
      { $inc: { attempts: 1 } },
    );
    throw new ServiceError(
      "INVALID_INPUT",
      "Verification code is invalid or expired",
    );
  }

  const consumedVerification = await PasswordChangeVerificationModel.findOneAndDelete({
    _id: verification._id,
    codeHash: verification.codeHash,
    expiresAt: { $gt: now },
  });

  if (!consumedVerification) {
    throw new ServiceError(
      "INVALID_INPUT",
      "Verification code is invalid or expired",
    );
  }

  const password = await bcrypt.hash(payload.newPassword, BCRYPT_SALT_ROUNDS);
  const user = await UserModel.findByIdAndUpdate(
    authenticatedUserId,
    {
      $set: { password },
      $inc: { authVersion: 1 },
    },
    { new: true, runValidators: true },
  ).select("_id");

  if (!user) {
    throw new ServiceError("NOT_FOUND", "User not found");
  }
};
