// models/studentProfileModel.js
const db = require("../config/db");

async function createEmptyProfile(userId) {
  const [result] = await db.query(
    "INSERT INTO student_profiles (user_id) VALUES (?)",
    [userId]
  );
  return result.insertId;
}

async function getProfileByUserId(userId) {
  const [rows] = await db.query(
    `SELECT sp.*, cr.title AS selected_career_title
     FROM student_profiles sp
     LEFT JOIN career_roles cr ON sp.selected_career_id = cr.id
     WHERE sp.user_id = ?`,
    [userId]
  );
  return rows[0] || null;
}

async function updateProfile(userId, { collegeName, branch, semester, bio }) {
  await db.query(
    `UPDATE student_profiles
     SET college_name = ?, branch = ?, semester = ?, bio = ?
     WHERE user_id = ?`,
    [collegeName, branch, semester, bio, userId]
  );
}

async function setSelectedCareer(userId, careerId) {
  await db.query(
    "UPDATE student_profiles SET selected_career_id = ? WHERE user_id = ?",
    [careerId, userId]
  );
}

module.exports = {
  createEmptyProfile,
  getProfileByUserId,
  updateProfile,
  setSelectedCareer,
};
