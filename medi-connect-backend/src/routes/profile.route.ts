import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import { profileUpdateSchema } from "../schemas/auth.schema.js";
import {
  fetchUserProfile,
  editUserProfile,
} from "../services/profile.service.js";

export const profileRouter = Router();

profileRouter.get("/profile", authMiddleware, fetchUserProfile);
profileRouter.patch(
  "/profile",
  authMiddleware,
  validateSchema(profileUpdateSchema),
  editUserProfile
);
