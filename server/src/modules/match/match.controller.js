import { sendSuccess, sendError } from "../../common/response.js";
import { getMyMatches } from "./match.service.js";

const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const matches = await getMyMatches(userId);
    return sendSuccess(res, matches, "Matches retrieved successfully");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export { getMatches };
