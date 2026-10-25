// models/studentSkillModel.js
const db = require("../config/db");

async function getSkillsForUser(userId) {
  const [rows] = await db.query(
    `SELECT ss.id, ss.status, s.id AS skill_id, s.name, s.category
     FROM student_skills ss
     JOIN skills s ON ss.skill_id = s.id
     WHERE ss.user_id = ?
     ORDER BY s.name ASC`,
    [userId]
  );
  return rows;
}

async function addSkillToUser(userId, skillId, status = "AVAILABLE") {
  const [result] = await db.query(
    "INSERT INTO student_skills (user_id, skill_id, status) VALUES (?, ?, ?)",
    [userId, skillId, status]
  );
  return result.insertId;
}

async function updateUserSkillStatus(id, userId, status) {
  await db.query(
    "UPDATE student_skills SET status = ? WHERE id = ? AND user_id = ?",
    [status, id, userId]
  );
}

async function deleteUserSkill(id, userId) {
  await db.query("DELETE FROM student_skills WHERE id = ? AND user_id = ?", [
    id,
    userId,
  ]);
}

module.exports = {
  getSkillsForUser,
  addSkillToUser,
  updateUserSkillStatus,
  deleteUserSkill,
};
