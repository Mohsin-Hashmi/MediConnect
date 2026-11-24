import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";
import {
  changePassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  requestPasswordChangeVerification,
} from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", validateSchema(registerSchema), registerUser);
authRouter.post("/login", validateSchema(loginSchema), loginUser);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.post("/logout", logoutUser);

authRouter.post(
  "/password-change/request-verification",
  authMiddleware,
  requestPasswordChangeVerification,
);

authRouter.post(
  "/password-change",
  authMiddleware,
  validateSchema(changePasswordSchema),
  changePassword,
);
