// models/progressModel.js
const db = require("../config/db");

async function getProgressForItem(roadmapItemId) {
  const [rows] = await db.query(
    "SELECT * FROM progress WHERE roadmap_item_id = ?",
    [roadmapItemId]
  );
  return rows[0] || null;
}

async function createProgress(roadmapItemId, percentage = 0) {
  const [result] = await db.query(
    "INSERT INTO progress (roadmap_item_id, percentage) VALUES (?, ?)",
    [roadmapItemId, percentage]
  );
  return result.insertId;
}

async function setPercentage(roadmapItemId, percentage) {
  const existing = await getProgressForItem(roadmapItemId);
  if (existing) {
    await db.query(
      "UPDATE progress SET percentage = ? WHERE roadmap_item_id = ?",
      [percentage, roadmapItemId]
    );
  } else {
    await createProgress(roadmapItemId, percentage);
  }
}

// Average progress across every item in a roadmap (for the dashboard).
async function getAverageProgressForRoadmap(roadmapId) {
  const [rows] = await db.query(
    `SELECT COALESCE(AVG(COALESCE(p.percentage, 0)), 0) AS average_progress
     FROM roadmap_items ri
     LEFT JOIN progress p ON p.roadmap_item_id = ri.id
     WHERE ri.roadmap_id = ?`,
    [roadmapId]
  );
  return Math.round(rows[0].average_progress);
}

module.exports = {
  getProgressForItem,
  createProgress,
  setPercentage,
  getAverageProgressForRoadmap,
};
