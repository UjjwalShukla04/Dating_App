import { v4 as uuidv4 } from "uuid";

// Mock database for MVP
const db = {
  users: new Map(), // phone -> user object
  profiles: new Map(), // userId -> profile object
  swipes: [], // Array of { id, fromUserId, toUserId, action, createdAt }
  matches: [], // Array of { id, user1Id, user2Id, matchedAt }
  messages: [], // Array of { id, matchId, senderId, content, createdAt }
};

// Seed some data
const seedData = () => {
  const dummyUsers = [
    {
      phone: "1112223333",
      profile: {
        full_name: "Alice Smith",
        gender: "Female",
        date_of_birth: "1995-05-15T00:00:00.000Z",
        bio: "Loves hiking and coffee. Looking for a travel buddy!",
      },
    },
    {
      phone: "4445556666",
      profile: {
        full_name: "Bob Jones",
        gender: "Male",
        date_of_birth: "1992-08-20T00:00:00.000Z",
        bio: "Tech enthusiast and foodie. Let's grab tacos.",
      },
    },
    {
      phone: "7778889999",
      profile: {
        full_name: "Charlie Brown",
        gender: "Other",
        date_of_birth: "1998-12-10T00:00:00.000Z",
        bio: "Artist and dreamer. Always sketching.",
      },
    },
  ];

  dummyUsers.forEach((u) => {
    const id = uuidv4();
    const user = {
      id,
      phone: u.phone,
      createdAt: new Date(),
    };
    db.users.set(u.phone, user);

    const profile = {
      id: uuidv4(),
      user_id: id, // Ensure this matches what getDiscoverProfiles expects (userId vs user_id)
      userId: id, // Add both for safety as I saw .userId in swipe.service.js
      ...u.profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.profiles.set(id, profile);
  });

  console.log(`Seeded ${dummyUsers.length} users and profiles.`);
};

seedData();

export { db };
