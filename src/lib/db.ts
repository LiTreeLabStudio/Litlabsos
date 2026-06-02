import "server-only";
import bcrypt from "bcryptjs";

// Admin configuration strictly from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_SECRET_SIGNATURE = process.env.ADMIN_SECRET_SIGNATURE;

// Fail-fast logic for production
if (process.env.NODE_ENV === "production") {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
    throw new Error("❌ Production Error: Missing critical ADMIN_EMAIL or ADMIN_PASSWORD_HASH environment variables.");
  }
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Verifies admin password using environment variables.
 * No hardcoded fallbacks are allowed in production.
 */
export async function verifyPassword(
  email: string,
  password: string
): Promise<User | null> {
  const emailToVerify = ADMIN_EMAIL;
  const hashToVerify = ADMIN_PASSWORD_HASH;

  if (!emailToVerify || !hashToVerify) {
    console.error("⚠️ Security Alert: Admin credentials not configured.");
    return null;
  }
  
  const identifier = email.trim().toLowerCase();
  const adminEmail = emailToVerify.trim().toLowerCase();
  const adminUsername = emailToVerify.split("@")[0].trim().toLowerCase();

  if (identifier !== adminEmail && identifier !== adminUsername) return null;

  const valid = await bcrypt.compare(password, hashToVerify);
  if (!valid) return null;
  
  return { id: "admin", email: emailToVerify, name: ADMIN_NAME };
}

/**
 * Finds admin user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  if (!ADMIN_EMAIL) return null;
  
  const identifier = email.trim().toLowerCase();
  const adminEmail = ADMIN_EMAIL.trim().toLowerCase();
  const adminUsername = ADMIN_EMAIL.split("@")[0].trim().toLowerCase();

  if (identifier === adminEmail || identifier === adminUsername) {
    return { id: "admin", email: ADMIN_EMAIL, name: ADMIN_NAME };
  }
  return null;
}

/**
 * Secure Admin Session Validation
 */
export async function validateAdminBypass(incomingSignature: string): Promise<boolean> {
  if (!ADMIN_SECRET_SIGNATURE) {
    console.error("⚠️ Security Alert: Admin bypass attempted but signature is not set.");
    return false;
  }
  
  return incomingSignature === ADMIN_SECRET_SIGNATURE;
}
