// models/roadmapItemModel.js
const db = require("../config/db");

async function createItem({
  roadmapId,
  skillId,
  description,
  priority,
  resourceId,
  stepOrder,
}) {
  const [result] = await db.query(
    `INSERT INTO roadmap_items
       (roadmap_id, skill_id, description, priority, resource_id, step_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [roadmapId, skillId, description, priority, resourceId, stepOrder]
  );
  return result.insertId;
}

async function getItemsForRoadmap(roadmapId) {
  const [rows] = await db.query(
    `SELECT ri.*, s.name AS skill_name,
            lr.title AS resource_title, lr.url AS resource_url,
            COALESCE(p.percentage, 0) AS progress_percentage
     FROM roadmap_items ri
     JOIN skills s ON ri.skill_id = s.id
     LEFT JOIN learning_resources lr ON ri.resource_id = lr.id
     LEFT JOIN progress p ON p.roadmap_item_id = ri.id
     WHERE ri.roadmap_id = ?
     ORDER BY ri.step_order ASC`,
    [roadmapId]
  );
  return rows;
}

async function getItemById(id) {
  const [rows] = await db.query("SELECT * FROM roadmap_items WHERE id = ?", [id]);
  return rows[0] || null;
}

// Confirms a roadmap item belongs to the given user (for authorization).
async function getItemOwnedByUser(itemId, userId) {
  const [rows] = await db.query(
    `SELECT ri.*
     FROM roadmap_items ri
     JOIN roadmaps r ON ri.roadmap_id = r.id
     WHERE ri.id = ? AND r.user_id = ?`,
    [itemId, userId]
  );
  return rows[0] || null;
}

async function updateStatus(itemId, status) {
  await db.query("UPDATE roadmap_items SET status = ? WHERE id = ?", [
    status,
    itemId,
  ]);
}

module.exports = {
  createItem,
  getItemsForRoadmap,
  getItemById,
  getItemOwnedByUser,
  updateStatus,
};
