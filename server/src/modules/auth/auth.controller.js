import { sendOtpForPhone, verifyOtpForPhone } from "./auth.service.js";
import { sendError, sendSuccess } from "../../common/response.js";

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
  const { phone, otp } = req.body ?? {};

  if (!phone || typeof phone !== "string" || !otp || typeof otp !== "string") {
    return sendError(res, "Phone and OTP are required", 400);
  }

  const { valid, reason, token } = verifyOtpForPhone(phone, otp);

  if (!valid) {
    return sendError(res, reason || "Invalid OTP", 400);
  }

  return sendSuccess(res, { token }, "OTP verified", 200);
};

export { sendOtp, verifyOtp };

