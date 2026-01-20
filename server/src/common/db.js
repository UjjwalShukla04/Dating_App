// Mock database for MVP
const db = {
  users: new Map(), // phone -> user object
  profiles: new Map(), // userId -> profile object
};

export { db };
