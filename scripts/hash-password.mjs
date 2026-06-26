#!/usr/bin/env node
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.log("Usage: node scripts/hash-password.mjs <password-to-hash>");
  process.exit(1);
}

async function main() {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  console.log("\n==================================================");
  console.log("Plaintext Password:", password);
  console.log("Generated Bcrypt Hash:", hash);
  console.log("==================================================\n");
}

main().catch((err) => {
  console.error("Error generating hash:", err);
  process.exit(1);
});
