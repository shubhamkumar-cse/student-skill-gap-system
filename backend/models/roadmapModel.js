// models/roadmapModel.js
const db = require("../config/db");

async function findRoadmap(userId, careerId) {
  const [rows] = await db.query(
    "SELECT * FROM roadmaps WHERE user_id = ? AND career_id = ?",
    [userId, careerId]
  );
  return rows[0] || null;
}

async function createRoadmap(userId, careerId) {
  const [result] = await db.query(
    "INSERT INTO roadmaps (user_id, career_id) VALUES (?, ?)",
    [userId, careerId]
  );
  return result.insertId;
}

async function deleteRoadmap(roadmapId) {
  // roadmap_items (and their progress rows) are removed automatically
  // via ON DELETE CASCADE in the schema.
  await db.query("DELETE FROM roadmaps WHERE id = ?", [roadmapId]);
}

async function getRoadmapWithCareer(userId) {
  const [rows] = await db.query(
    `SELECT r.*, cr.title AS career_title
     FROM roadmaps r
     JOIN career_roles cr ON r.career_id = cr.id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

module.exports = {
  findRoadmap,
  createRoadmap,
  deleteRoadmap,
  getRoadmapWithCareer,
};
