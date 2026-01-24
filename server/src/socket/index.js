import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/index.js";
import { logger } from "../common/logger.js";
import { handleChatEvents } from "./chat.socket.js";

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all for MVP/Dev
      methods: ["GET", "POST"],
    },
  });

  // Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: Token required"));
    }

    try {
      const payload = jwt.verify(token, env.jwtSecret);
      socket.user = payload; // Attach user to socket
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.user.id}, Socket ID: ${socket.id}`);

    // Handle Chat Events
    handleChatEvents(io, socket);

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

export { initializeSocket };
