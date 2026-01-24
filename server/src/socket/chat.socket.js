import { logger } from "../common/logger.js";
import { sendMessage } from "../modules/message/message.service.js";
import { db } from "../common/db.js";

const handleChatEvents = (io, socket) => {
  // Join Room Event
  socket.on("join_room", ({ matchId }) => {
    // Validate that the user belongs to this match
    const match = db.matches.find((m) => m.id === matchId);

    if (!match) {
      return socket.emit("error", "Match not found");
    }

    const userId = socket.user.id;
    if (match.user1Id !== userId && match.user2Id !== userId) {
      return socket.emit("error", "Unauthorized to join this room");
    }

    socket.join(matchId);
    logger.info(`User ${userId} joined room ${matchId}`);
  });

  // Send Message Event
  socket.on("send_message", async ({ matchId, content }) => {
    try {
      const userId = socket.user.id;

      // Save message to DB using existing service
      const message = await sendMessage(matchId, userId, content);

      // Emit to room (including sender, or use broadcast.to if we don't want echo)
      // Usually good to emit to everyone in room so sender knows it was processed
      io.to(matchId).emit("receive_message", message);

      logger.info(`Message sent in room ${matchId} by ${userId}`);
    } catch (error) {
      logger.error(`Error sending message: ${error.message}`);
      socket.emit("error", error.message);
    }
  });
};

export { handleChatEvents };
