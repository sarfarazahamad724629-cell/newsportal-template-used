import { ID } from "appwrite";
import { account, databases, DATABASE_ID, Query } from "./appwriteClient";

const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

const normalizeUsernameBase = (value) => {
  const base = value
    .split("@")[0]
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .trim()
    .slice(0, 24);
  return base || "user";
};

const buildUserPayload = (authUser, overrides = {}) => ({
  userId: authUser.$id,
  name: overrides.name?.trim() || authUser.name || "",
  username: overrides.username?.trim() || "",
  avatar: overrides.avatar || "",
  role: "user",
  status: "active",
  isVerified: false,
  joinedAt: authUser.$createdAt || new Date().toISOString(),
  email: overrides.email?.trim() || authUser.email || "",
});

export const ensureUniqueUsername = async (value, currentUserId) => {
  const trimmed = value.trim();
  if (!trimmed) return;
  const res = await databases.listDocuments(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    [Query.equal("username", trimmed)]
  );
  const match = res.documents.find((doc) => doc.userId !== currentUserId);
  if (match) {
    throw new Error("Username is already taken.");
  }
};

const buildUniqueUsername = async (seed) => {
  const base = normalizeUsernameBase(seed || "user");
  let candidate = base;
  let suffix = 0;
  while (true) {
    const res = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("username", candidate)]
    );
    if (res.documents.length === 0) {
      return candidate;
    }
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
};

export const ensureUserDocument = async (authUser, overrides = {}) => {
  if (!USERS_COLLECTION_ID) {
    throw new Error("Users collection id is missing.");
  }
  const existing = await databases.listDocuments(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    [Query.equal("userId", authUser.$id)]
  );
  if (existing.documents.length > 0) {
    return existing.documents[0];
  }
  let username = overrides.username?.trim() || "";
  if (!username) {
    username = await buildUniqueUsername(overrides.email || authUser.email || "user");
  }
  await ensureUniqueUsername(username, authUser.$id);
  const payload = buildUserPayload(authUser, {
    ...overrides,
    username,
  });
  return databases.createDocument(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    ID.unique(),
    payload
  );
};

export const resolveIdentifierToEmail = async (identifier) => {
  const value = identifier.trim();
  if (!value) {
    throw new Error("Email or username is required.");
  }
  if (value.includes("@")) {
    return value;
  }
  const res = await databases.listDocuments(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    [Query.equal("username", value)]
  );
  if (res.documents.length === 0) {
    throw new Error("Username not found.");
  }
  const email = res.documents[0].email || "";
  if (!email) {
    throw new Error("Email for username is missing.");
  }
  return email;
};

export { account, databases };
