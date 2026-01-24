import { v4 as uuidv4 } from "uuid";
import { db } from "../../common/db.js";

const getMessages = async (matchId, userId) => {
  // 1. Verify match exists and user belongs to it
  const match = db.matches.find((m) => m.id === matchId);

  if (!match) {
    throw new Error("Match not found");
  }

  if (match.user1Id !== userId && match.user2Id !== userId) {
    throw new Error("Not authorized to view messages for this match");
  }

  // 2. Get messages
  const messages = db.messages
    .filter((m) => m.matchId === matchId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return messages;
};

const sendMessage = async (matchId, senderId, content) => {
  // 1. Verify match exists and user belongs to it
  const match = db.matches.find((m) => m.id === matchId);

  if (!match) {
    throw new Error("Match not found");
  }

  if (match.user1Id !== senderId && match.user2Id !== senderId) {
    throw new Error("Not authorized to send messages to this match");
  }

  // 2. Create message
  const message = {
    id: uuidv4(),
    matchId,
    senderId,
    content,
    createdAt: new Date().toISOString(),
  };

  db.messages.push(message);

  return message;
};

export { getMessages, sendMessage };
