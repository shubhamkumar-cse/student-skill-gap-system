// controllers/roadmapController.js
const roadmapService = require("../services/roadmapService");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/roadmap  (latest roadmap for the logged-in student)
const getRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.getFullRoadmap(req.user.id);
  if (!roadmap) {
    return res.status(404).json({ message: "No roadmap found yet. Generate one first." });
  }
  res.json(roadmap);
});

// POST /api/roadmap/generate   body: { careerId }
const generateRoadmap = asyncHandler(async (req, res) => {
  const { careerId } = req.body;
  if (!careerId) {
    return res.status(400).json({ message: "careerId is required." });
  }
  const roadmap = await roadmapService.generateRoadmap(req.user.id, careerId);
  res.status(201).json({ message: "Roadmap generated.", roadmap });
});

// PUT /api/roadmap/items/:id   body: { status }
const roadmapItemModel = require("../models/roadmapItemModel");
const updateItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  const item = await roadmapItemModel.getItemOwnedByUser(req.params.id, req.user.id);
  if (!item) {
    return res.status(404).json({ message: "Roadmap item not found." });
  }

  await roadmapItemModel.updateStatus(req.params.id, status);
  res.json({ message: "Roadmap item status updated." });
});

module.exports = { getRoadmap, generateRoadmap, updateItemStatus };
