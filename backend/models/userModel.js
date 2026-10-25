// models/userModel.js
const db = require("../config/db");

async function createUser({ name, email, passwordHash, role }) {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function findAllStudents() {
  const [rows] = await db.query(
    "SELECT id, name, email, created_at FROM users WHERE role = 'STUDENT' ORDER BY created_at DESC"
  );
  return rows;
}

module.exports = { createUser, findByEmail, findById, findAllStudents };
