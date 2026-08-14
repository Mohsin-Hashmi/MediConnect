import jwt, { type SignOptions } from "jsonwebtoken";

import type { UserTokenPayload } from "../types/jwt-payload.js";
import type { UserRoleName } from "../types/user.js";

type TokenUser = {
  id: string;
  email: string;
  role: UserRoleName;
};

export type AuthTokenPayload = UserTokenPayload & {
  tokenType: "access" | "refresh";
};

// Set token expiration times
const ACCESS_TOKEN_EXPIRES_IN: SignOptions["expiresIn"] = "15m";
const REFRESH_TOKEN_EXPIRES_IN: SignOptions["expiresIn"] = "7d";

// Get JWT Secret from environment variables
const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT secret is not configured");
  }

  return jwtSecret;
};

// Generate Access Token
export const generateAccessToken = (user: TokenUser) => {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenType: "access",
  };

  return jwt.sign(payload, getJwtSecret(), { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

// Generate Refresh Token
export const generateRefreshToken = (user: TokenUser) => {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    tokenType: "refresh",
  };

  return jwt.sign(payload, getJwtSecret(), { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};

// Generate Auth Tokens (Access + Refresh)
export const generateAuthTokens = (user: TokenUser) => ({
  accessToken: generateAccessToken(user),
  refreshToken: generateRefreshToken(user),
});

// Verify Refresh Token
export const verifyRefreshToken = (refreshToken: string) => {
  try {
    const payload = jwt.verify(refreshToken, getJwtSecret()) as AuthTokenPayload;

    if (payload.tokenType !== "refresh") {
      return null;
    }

    return payload;
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return null;
    }

    throw error;
  }
};

// Verify Access Token
export const verifyAccessToken = (accessToken: string) => {
  try {
    const payload = jwt.verify(accessToken, getJwtSecret()) as AuthTokenPayload;

    if (payload.tokenType !== "access") {
      return null;
    }

    return payload;
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return null;
    }

    throw error;
  }
};
