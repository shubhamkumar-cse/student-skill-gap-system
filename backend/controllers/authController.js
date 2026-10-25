// controllers/authController.js
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const studentProfileModel = require("../models/studentProfileModel");
const { signToken } = require("../utils/jwt");
const asyncHandler = require("../utils/asyncHandler");

const SALT_ROUNDS = 10;

// POST /api/auth/register
// Public registration always creates a STUDENT account.
// Admin accounts are created separately via the create-admin script,
// so a student can never register themselves as an admin.
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are all required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  const existing = await userModel.findByEmail(email);
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = await userModel.createUser({ name, email, passwordHash, role: "STUDENT" });
  await studentProfileModel.createEmptyProfile(userId);

  const token = signToken({ id: userId, role: "STUDENT" });

  res.status(201).json({
    message: "Registration successful.",
    token,
    user: { id: userId, name, email, role: "STUDENT" },
  });
});

// POST /api/auth/login
// Works for both STUDENT and ADMIN — the role comes from the database,
// not from anything the client sends.
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken({ id: user.id, role: user.role });

  res.json({
    message: "Login successful.",
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

module.exports = { register, login };
