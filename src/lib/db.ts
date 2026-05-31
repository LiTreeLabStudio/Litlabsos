import bcrypt from "bcryptjs";

// Strictly hardcoded credentials to bypass incorrect Vercel env vars
const ADMIN_EMAIL = "highlife4real1989@gmail.com";
const ADMIN_PASSWORD_HASH = "$2b$12$M8KinkyABuzpndb.VY7faOi.W5pLaJxdrp6HwhMx1wYkWpOQh4CZi";
const ADMIN_NAME = "Larry B";

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export async function verifyPassword(
  email: string,
  password: string
): Promise<User | null> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) return null;
  const identifier = email.trim().toLowerCase();
  const adminEmail = ADMIN_EMAIL.trim().toLowerCase();
  const adminUsername = ADMIN_EMAIL.split("@")[0].trim().toLowerCase();

  if (identifier !== adminEmail && identifier !== adminUsername) return null;

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) return null;
  return { id: "admin", email: ADMIN_EMAIL, name: ADMIN_NAME };
}

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
