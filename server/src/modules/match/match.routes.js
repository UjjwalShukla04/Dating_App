import { Router } from "express";
import { getMatches } from "./match.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getMatches);

export { router as matchRoutes };
