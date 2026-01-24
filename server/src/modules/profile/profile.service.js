import { db } from "../../common/db.js";
import { v4 as uuidv4 } from "uuid";

// In-memory mock service for MVP
// In a real app, this would query PostgreSQL

const createOrUpdateProfile = (userId, profileData) => {
  // Check if profile exists
  let profile = db.profiles.get(userId);

  const now = new Date().toISOString();

  if (profile) {
    // Update existing
    profile = {
      ...profile,
      ...profileData,
      updated_at: now,
    };
  } else {
    // Create new
    profile = {
      id: uuidv4(),
      user_id: userId,
      userId: userId,
      ...profileData,
      created_at: now,
      updated_at: now,
    };
  }

  db.profiles.set(userId, profile);
  return profile;
};

const getProfileByUserId = (userId) => {
  return db.profiles.get(userId);
};

const findUserByPhone = (phone) => {
  return db.users.get(phone);
};

const createUser = (phone) => {
  const user = {
    id: uuidv4(),
    phone,
    created_at: new Date().toISOString(),
  };
  db.users.set(phone, user);
  return user;
};

export {
  createOrUpdateProfile,
  getProfileByUserId,
  findUserByPhone,
  createUser,
};
