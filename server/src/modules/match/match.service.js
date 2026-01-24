import { db } from "../../common/db.js";

const getMyMatches = async (userId) => {
  const matches = db.matches.filter(
    (m) => m.user1Id === userId || m.user2Id === userId
  );

  const enrichedMatches = matches.map((match) => {
    const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
    const profile = db.profiles.get(otherUserId);
    return {
      id: match.id,
      matchedAt: match.matchedAt,
      profile: profile || null, // Handle case if profile deleted/missing
    };
  }).filter(m => m.profile !== null); // Filter out invalid ones

  return enrichedMatches;
};

export { getMyMatches };
