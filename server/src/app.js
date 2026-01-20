import express from "express";
import cors from "cors";

import { sendSuccess } from "./common/response.js";
import { errorHandler, notFoundHandler } from "./common/error.handler.js";
import { sendOtp, verifyOtp } from "./modules/auth/auth.controller.js";
import { logger } from "./common/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info("Incoming request", { method: req.method, path: req.path });
  next();
});

app.get("/health", (req, res) => {
  sendSuccess(res, { status: "OK" }, "Server is running");
});

app.post("/auth/send-otp", sendOtp);
app.post("/auth/verify-otp", verifyOtp);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
