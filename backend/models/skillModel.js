// models/skillModel.js
const db = require("../config/db");

async function getAllSkills() {
  const [rows] = await db.query("SELECT * FROM skills ORDER BY name ASC");
  return rows;
}

async function getSkillById(id) {
  const [rows] = await db.query("SELECT * FROM skills WHERE id = ?", [id]);
  return rows[0] || null;
}

async function createSkill({ name, category }) {
  const [result] = await db.query(
    "INSERT INTO skills (name, category) VALUES (?, ?)",
    [name, category]
  );
  return result.insertId;
}

async function updateSkill(id, { name, category }) {
  await db.query("UPDATE skills SET name = ?, category = ? WHERE id = ?", [
    name,
    category,
    id,
  ]);
}

async function deleteSkill(id) {
  await db.query("DELETE FROM skills WHERE id = ?", [id]);
}

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
