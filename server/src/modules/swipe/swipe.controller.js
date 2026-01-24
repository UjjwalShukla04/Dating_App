import { sendSuccess, sendError } from "../../common/response.js";
import {
  getDiscoverProfiles,
  recordSwipe,
  resetSwipes,
} from "./swipe.service.js";
import { logger } from "../../common/logger.js";

const getProfiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const profiles = await getDiscoverProfiles(userId);
    return sendSuccess(res, profiles, "Profiles retrieved successfully");
  } catch (error) {
    logger.error("Error in getProfiles", { error: error.message });
    return sendError(res, error.message, 500);
  }
};

const swipeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { toUserId, action } = req.body;

    if (!toUserId || !action) {
      return sendError(res, "toUserId and action are required", 400);
    }

    if (!["like", "dislike"].includes(action)) {
      return sendError(res, "Action must be 'like' or 'dislike'", 400);
    }

    const result = await recordSwipe(userId, toUserId, action);
    return sendSuccess(res, result, "Swipe recorded successfully");
  } catch (error) {
    logger.error("Error in swipeProfile", { error: error.message });
    if (error.message === "Profile already swiped") {
      return sendError(res, error.message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

const resetUserSwipes = async (req, res) => {
  try {
    const userId = req.user.id;
    await resetSwipes(userId);
    return sendSuccess(res, { success: true }, "Swipes reset successfully");
  } catch (error) {
    logger.error("Error in resetUserSwipes", { error: error.message });
    return sendError(res, error.message, 500);
  }
};

export { getProfiles, swipeProfile, resetUserSwipes };
