import { v4 as uuidv4 } from "uuid";
import { db } from "../../common/db.js";

const getDiscoverProfiles = async (userId) => {
  const allProfiles = Array.from(db.profiles.values());
  const mySwipes = db.swipes.filter((s) => s.fromUserId === userId);
  const swipedUserIds = new Set(mySwipes.map((s) => s.toUserId));

  // Filter profiles:
  // 1. Not me
  // 2. Not already swiped
  const discoverable = allProfiles.filter((profile) => {
    return profile.userId !== userId && !swipedUserIds.has(profile.userId);
  });

  return discoverable;
};

const recordSwipe = async (fromUserId, toUserId, action) => {
  // Check if already swiped
  const existingSwipe = db.swipes.find(
    (s) => s.fromUserId === fromUserId && s.toUserId === toUserId
  );

  if (existingSwipe) {
    throw new Error("Profile already swiped");
  }

  // Record swipe
  const swipe = {
    id: uuidv4(),
    fromUserId,
    toUserId,
    action,
    createdAt: new Date(),
  };

  db.swipes.push(swipe);

  let match = null;

  // Check for match if it's a like
  if (action === "like") {
    const reverseSwipe = db.swipes.find(
      (s) =>
        s.fromUserId === toUserId &&
        s.toUserId === fromUserId &&
        s.action === "like"
    );

    if (reverseSwipe) {
      // Create match
      // Ensure consistent ordering of user IDs to avoid duplicates if we were checking that strictly
      // But for now, we just create a match record.
      const user1Id = fromUserId < toUserId ? fromUserId : toUserId;
      const user2Id = fromUserId < toUserId ? toUserId : fromUserId;

      // Check if match already exists (shouldn't if swipe logic is correct, but safe to check)
      const existingMatch = db.matches.find(
        (m) => m.user1Id === user1Id && m.user2Id === user2Id
      );

      if (!existingMatch) {
        match = {
          id: uuidv4(),
          user1Id,
          user2Id,
          matchedAt: new Date(),
        };
        db.matches.push(match);
      } else {
        match = existingMatch;
      }
    }
  }

  return { swipe, match };
};

export { getDiscoverProfiles, recordSwipe };
