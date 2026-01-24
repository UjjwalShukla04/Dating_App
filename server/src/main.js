import { app } from "./app.js";
import { env } from "./config/index.js";
import { logger } from "./common/logger.js";
import { initializeSocket } from "./socket/index.js";

const PORT = env.port;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Initialize Socket.IO
const io = initializeSocket(server);

const shutdown = (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully`);

  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", {
    message: error?.message,
    stack: error?.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", {
    reason,
  });
});
