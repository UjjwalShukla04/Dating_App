import { Router } from "express";
import { authenticate } from "../auth/auth.middleware.js";
import {
  getProfiles,
  swipeProfile,
  resetUserSwipes,
} from "./swipe.controller.js";

const router = Router();

router.get("/discover", authenticate, getProfiles);
router.post("/action", authenticate, swipeProfile);
router.post("/reset", authenticate, resetUserSwipes); // Dev only

export { router as swipeRoutes };
