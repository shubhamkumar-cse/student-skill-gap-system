// models/careerRequiredSkillModel.js
const db = require("../config/db");

// All skills required for one career, joined with skill details.
async function getRequiredSkillsForCareer(careerId) {
  const [rows] = await db.query(
    `SELECT crs.id AS mapping_id, crs.priority, s.id AS skill_id, s.name, s.category
     FROM career_required_skills crs
     JOIN skills s ON crs.skill_id = s.id
     WHERE crs.career_id = ?
     ORDER BY FIELD(crs.priority, 'HIGH', 'MEDIUM', 'LOW'), s.name ASC`,
    [careerId]
  );
  return rows;
}

async function assignSkillToCareer(careerId, skillId, priority = "MEDIUM") {
  const [result] = await db.query(
    "INSERT INTO career_required_skills (career_id, skill_id, priority) VALUES (?, ?, ?)",
    [careerId, skillId, priority]
  );
  return result.insertId;
}

async function removeSkillFromCareer(careerId, skillId) {
  await db.query(
    "DELETE FROM career_required_skills WHERE career_id = ? AND skill_id = ?",
    [careerId, skillId]
  );
}

async function updatePriority(careerId, skillId, priority) {
  await db.query(
    "UPDATE career_required_skills SET priority = ? WHERE career_id = ? AND skill_id = ?",
    [priority, careerId, skillId]
  );
}

module.exports = {
  getRequiredSkillsForCareer,
  assignSkillToCareer,
  removeSkillFromCareer,
  updatePriority,
};
