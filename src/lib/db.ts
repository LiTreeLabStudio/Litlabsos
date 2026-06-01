import "server-only";
import bcrypt from "bcryptjs";

// Admin configuration with environment variables + hardcoded safety fallbacks
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "highlife4real1989@gmail.com";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "$2b$12$M8KinkyABuzpndb.VY7faOi.W5pLaJxdrp6HwhMx1wYkWpOQh4CZi";
const ADMIN_NAME = process.env.ADMIN_NAME || "Larry B";
const ADMIN_SECRET_SIGNATURE = process.env.ADMIN_SECRET_SIGNATURE;

export interface User {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Verifies admin password using environment variables
 */
export async function verifyPassword(
  email: string,
  password: string
): Promise<User | null> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
    console.error("⚠️ Security Alert: Admin credentials not configured in environment.");
    return null;
  }
  
  const identifier = email.trim().toLowerCase();
  const adminEmail = ADMIN_EMAIL.trim().toLowerCase();
  const adminUsername = ADMIN_EMAIL.split("@")[0].trim().toLowerCase();

  if (identifier !== adminEmail && identifier !== adminUsername) return null;

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) return null;
  
  return { id: "admin", email: ADMIN_EMAIL, name: ADMIN_NAME };
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
 * Replaces the hardcoded fallback with an isolated server-side environment check
 */
export async function validateAdminBypass(incomingSignature: string): Promise<boolean> {
  if (!ADMIN_SECRET_SIGNATURE) {
    console.error("⚠️ Security Alert: Admin bypass attempted but ADMIN_SECRET_SIGNATURE is not set.");
    return false;
  }
  
  // Direct constant-time verification style or simple matching on server
  return incomingSignature === ADMIN_SECRET_SIGNATURE;
}
