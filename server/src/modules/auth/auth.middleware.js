import jwt from "jsonwebtoken";

import { env } from "../../config/index.js";
import { sendError } from "../../common/response.js";

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return sendError(res, "Unauthorized", 401);
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (error) {
    return sendError(res, "Invalid or expired token", 401);
  }
};

export { authenticate };

