import { sendSuccess, sendError } from "../../common/response.js";
import { getDiscoverProfiles, recordSwipe } from "./swipe.service.js";
import { logger } from "../../common/logger.js";

const getDiscover = async (req, res) => {
  try {
    const userId = req.user.id;
    const profiles = await getDiscoverProfiles(userId);
    return sendSuccess(
      res,
      profiles,
      "Discover profiles retrieved successfully",
    );
  } catch (error) {
    logger.error("Error in getDiscover", {
      error: error.message,
      stack: error.stack,
    });
    return sendError(res, error.message, 500);
  }
};

const swipeProfile = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId, action } = req.body;

    logger.info("Swipe request received", { fromUserId, toUserId, action });

    if (!toUserId || !["like", "dislike"].includes(action)) {
      return sendError(res, "Invalid request parameters", 400);
    }

    if (fromUserId === toUserId) {
      return sendError(res, "Cannot swipe yourself", 400);
    }

    const result = await recordSwipe(fromUserId, toUserId, action);
    return sendSuccess(res, result, "Swipe recorded successfully");
  } catch (error) {
    logger.error("Error in swipeProfile", {
      error: error.message,
      stack: error.stack,
    });
    if (error.message === "Profile already swiped") {
      return sendError(res, error.message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export { getDiscover, swipeProfile };
