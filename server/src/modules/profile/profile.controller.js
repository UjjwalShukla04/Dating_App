import { sendSuccess, sendError } from "../../common/response.js";
import { createOrUpdateProfile, getProfileByUserId } from "./profile.service.js";

const upsertProfile = (req, res) => {
  const userId = req.user.id;
  const { fullName, gender, dob, bio } = req.body;

  if (!fullName || !gender || !dob) {
    return sendError(res, "Missing required fields", 400);
  }

  const profile = createOrUpdateProfile(userId, {
    full_name: fullName,
    gender,
    date_of_birth: dob,
    bio,
  });

  return sendSuccess(res, profile, "Profile saved successfully");
};

const getProfile = (req, res) => {
  const userId = req.user.id;
  const profile = getProfileByUserId(userId);

  if (!profile) {
    return sendError(res, "Profile not found", 404);
  }

  return sendSuccess(res, profile, "Profile retrieved successfully");
};

export { upsertProfile, getProfile };
