import express from "express";
import cors from "cors";

import { routes } from "./routes/index.js";
import { sendSuccess } from "./common/response.js";
import { errorHandler, notFoundHandler } from "./common/error.handler.js";
import { sendOtp, verifyOtp } from "./modules/auth/auth.controller.js";
import { profileRoutes } from "./modules/profile/profile.routes.js";
import { swipeRoutes } from "./modules/swipe/swipe.routes.js";
import { matchRoutes } from "./modules/match/match.routes.js";
import { messageRoutes } from "./modules/message/message.routes.js";
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

app.use("/profile", profileRoutes);
app.use("/swipe", swipeRoutes);
app.use("/matches", matchRoutes);
app.use("/messages", messageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
