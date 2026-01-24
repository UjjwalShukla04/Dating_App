import { Router } from "express";
import { authenticate } from "../auth/auth.middleware.js";
import { getMatchMessages, sendMatchMessage } from "./message.controller.js";

const router = Router();

router.get("/:matchId", authenticate, getMatchMessages);
router.post("/:matchId", authenticate, sendMatchMessage);

export { router as messageRoutes };
