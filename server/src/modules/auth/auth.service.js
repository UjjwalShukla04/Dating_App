import { randomInt } from "crypto";

import { OTP_EXPIRY_MS, OTP_LENGTH } from "./auth.constants.js";
import { logger } from "../../common/logger.js";
import { env } from "../../config/index.js";
import jwt from "jsonwebtoken";

const otpStore = new Map();

const generateOtp = () => {
  const max = 10 ** OTP_LENGTH;
  const value = randomInt(0, max);
  return value.toString().padStart(OTP_LENGTH, "0");
};

const sendOtpForPhone = (phone) => {
  const otp = generateOtp();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  otpStore.set(phone, { otp, expiresAt });

  logger.info("Generated OTP for phone", {
    phone,
    otp:
      env.nodeEnv === "production"
        ? "hidden"
        : otp,
  });

  return {
    phone,
    otp: env.nodeEnv === "production" ? undefined : otp,
    expiresAt,
  };
};

const verifyOtpForPhone = (phone, otp) => {
  const entry = otpStore.get(phone);

  if (!entry) {
    return { valid: false, reason: "OTP not found" };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return { valid: false, reason: "OTP expired" };
  }

  if (entry.otp !== otp) {
    return { valid: false, reason: "OTP invalid" };
  }

  otpStore.delete(phone);

  const payload = { phone };

  const token = jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  return { valid: true, token, payload };
};

export { sendOtpForPhone, verifyOtpForPhone };

