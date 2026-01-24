import { sendSuccess, sendError } from "../../common/response.js";
import { getMessages, sendMessage } from "./message.service.js";
import { logger } from "../../common/logger.js";

const getMatchMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId } = req.params;

    const messages = await getMessages(matchId, userId);
    return sendSuccess(res, messages, "Messages retrieved successfully");
  } catch (error) {
    logger.error("Error in getMatchMessages", { error: error.message });
    if (error.message === "Not authorized to view messages for this match") {
      return sendError(res, error.message, 403);
    }
    return sendError(res, error.message, 500);
  }
};

const sendMatchMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return sendError(res, "Message content is required", 400);
    }

    const message = await sendMessage(matchId, userId, content);
    return sendSuccess(res, message, "Message sent successfully");
  } catch (error) {
    logger.error("Error in sendMatchMessage", { error: error.message });
    if (error.message === "Not authorized to send messages to this match") {
      return sendError(res, error.message, 403);
    }
    return sendError(res, error.message, 500);
  }
};

export { getMatchMessages, sendMatchMessage };
