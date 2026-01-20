import { Router } from "express";
import { upsertProfile, getProfile } from "./profile.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

router.post("/", authenticate, upsertProfile);
router.get("/me", authenticate, getProfile);

export { router as profileRoutes };
