// scripts/createAdmin.js
// One-time helper to create the very first ADMIN account.
// Public registration (POST /api/auth/register) always creates STUDENT
// accounts on purpose, so this script is the only way to create an admin.
//
// Usage (from the backend/ folder, after setting up .env and the database):
//   node scripts/createAdmin.js "Admin Name" "admin@example.com" "yourPassword123"
// or just:
//   npm run create-admin
// (edit the DEFAULT_* values below first if you use the npm script form)

require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const userModel = require("../models/userModel");

const DEFAULT_NAME = "Admin";
const DEFAULT_EMAIL = "admin@example.com";
const DEFAULT_PASSWORD = "Admin@123";

async function main() {
  const [name, email, password] = [
    process.argv[2] || DEFAULT_NAME,
    process.argv[3] || DEFAULT_EMAIL,
    process.argv[4] || DEFAULT_PASSWORD,
  ];

  const existing = await userModel.findByEmail(email);
  if (existing) {
    console.log(`A user with email "${email}" already exists (role: ${existing.role}).`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = await userModel.createUser({ name, email, passwordHash, role: "ADMIN" });

  console.log("Admin account created successfully:");
  console.log(`  id:       ${id}`);
  console.log(`  name:     ${name}`);
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}  (change this after first login if needed)`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});
