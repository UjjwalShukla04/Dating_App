import { Router } from "express";

import { sendSuccess } from "../common/response.js";
import { authRoutes } from "../modules/auth/auth.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  sendSuccess(res, { status: "OK" }, "Server is running");
});

router.use("/auth", authRoutes);

export { router as routes };
