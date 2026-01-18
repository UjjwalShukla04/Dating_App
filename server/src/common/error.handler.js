import { logger } from "./logger.js";
import { sendError } from "./response.js";

const notFoundHandler = (req, res, next) => {
  sendError(res, "Route not found", 404);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled error", {
    message: err?.message,
    stack: err?.stack,
  });

  const statusCode = err?.statusCode && Number.isInteger(err.statusCode)
    ? err.statusCode
    : 500;

  const message = statusCode === 500 ? "Internal server error" : err?.message;

  sendError(res, message ?? "Internal server error", statusCode);
};

export { notFoundHandler, errorHandler };

