import { Router } from "express";
import { getDiscover, swipeProfile } from "./swipe.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

router.get("/discover", authenticate, getDiscover);
router.post("/", authenticate, swipeProfile);

export { router as swipeRoutes };
