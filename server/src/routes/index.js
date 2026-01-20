import { Router } from "express";

import { sendSuccess } from "../common/response.js";

const router = Router();

router.get("/health", (req, res) => {
  sendSuccess(res, { status: "OK" }, "Server is running");
});

export { router as routes };
