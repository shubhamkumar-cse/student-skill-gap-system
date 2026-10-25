// models/careerModel.js
const db = require("../config/db");

async function getAllCareers() {
  const [rows] = await db.query("SELECT * FROM career_roles ORDER BY title ASC");
  return rows;
}

async function getCareerById(id) {
  const [rows] = await db.query("SELECT * FROM career_roles WHERE id = ?", [id]);
  return rows[0] || null;
}

async function createCareer({ title, description }) {
  const [result] = await db.query(
    "INSERT INTO career_roles (title, description) VALUES (?, ?)",
    [title, description]
  );
  return result.insertId;
}

async function updateCareer(id, { title, description }) {
  await db.query(
    "UPDATE career_roles SET title = ?, description = ? WHERE id = ?",
    [title, description, id]
  );
}

async function deleteCareer(id) {
  await db.query("DELETE FROM career_roles WHERE id = ?", [id]);
}

module.exports = {
  getAllCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
};
