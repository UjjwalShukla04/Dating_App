import { sendOtpForPhone, verifyOtpForPhone } from "./auth.service.js";
import { sendError, sendSuccess } from "../../common/response.js";
import { logger } from "../../common/logger.js";

const sendOtp = (req, res) => {
  const { phone } = req.body ?? {};

  if (!phone || typeof phone !== "string") {
    return sendError(res, "Phone is required", 400);
  }

  const result = sendOtpForPhone(phone);

  return sendSuccess(
    res,
    {
      phone: result.phone,
      otp: result.otp,
      expiresAt: result.expiresAt,
    },
    "OTP sent",
    200,
  );
};

const verifyOtp = (req, res) => {
  try {
    const { phone, otp } = req.body ?? {};
    logger.info("Verifying OTP request received", { phone, otp });

    if (
      !phone ||
      typeof phone !== "string" ||
      !otp ||
      typeof otp !== "string"
    ) {
      logger.warn("Invalid verification request body", { body: req.body });
      return sendError(res, "Phone and OTP are required", 400);
    }

    const { valid, reason, token } = verifyOtpForPhone(phone, otp);

    if (!valid) {
      logger.warn("OTP verification failed in service", { phone, reason });
      return sendError(res, reason || "Invalid OTP", 400);
    }

    logger.info("OTP verified successfully", { phone });
    return sendSuccess(res, { token }, "OTP verified", 200);
  } catch (error) {
    logger.error("Error in verifyOtp controller", {
      error: error.message,
      stack: error.stack,
    });
    return sendError(res, "Internal Server Error", 500);
  }
};

export { sendOtp, verifyOtp };
