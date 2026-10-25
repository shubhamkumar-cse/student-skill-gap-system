// models/learningResourceModel.js
const db = require("../config/db");

async function getAllResources() {
  const [rows] = await db.query(
    `SELECT lr.*, s.name AS skill_name
     FROM learning_resources lr
     JOIN skills s ON lr.skill_id = s.id
     ORDER BY lr.created_at DESC`
  );
  return rows;
}

async function getResourcesForSkill(skillId) {
  const [rows] = await db.query(
    "SELECT * FROM learning_resources WHERE skill_id = ? ORDER BY created_at DESC",
    [skillId]
  );
  return rows;
}

async function getBestResourceForSkill(skillId) {
  const [rows] = await db.query(
    "SELECT * FROM learning_resources WHERE skill_id = ? ORDER BY created_at ASC LIMIT 1",
    [skillId]
  );
  return rows[0] || null;
}

async function createResource({ skillId, title, url, type }) {
  const [result] = await db.query(
    "INSERT INTO learning_resources (skill_id, title, url, type) VALUES (?, ?, ?, ?)",
    [skillId, title, url, type]
  );
  return result.insertId;
}

async function updateResource(id, { skillId, title, url, type }) {
  await db.query(
    "UPDATE learning_resources SET skill_id = ?, title = ?, url = ?, type = ? WHERE id = ?",
    [skillId, title, url, type, id]
  );
}

async function deleteResource(id) {
  await db.query("DELETE FROM learning_resources WHERE id = ?", [id]);
}

module.exports = {
  getAllResources,
  getResourcesForSkill,
  getBestResourceForSkill,
  createResource,
  updateResource,
  deleteResource,
};
