import { Router } from "express";

import { validateSchema } from "../middlewares/validate-schema.mw.js";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../schemas/auth.schema.js";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  logoutUser,
} from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post("/register", validateSchema(registerSchema), registerUser);
authRouter.post("/login", validateSchema(loginSchema), loginUser);
authRouter.post(
  "/refresh-token",
  validateSchema(refreshTokenSchema),
  refreshAccessToken
);
authRouter.post("/logout", logoutUser);
