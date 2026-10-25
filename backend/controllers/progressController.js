// controllers/progressController.js
const progressModel = require("../models/progressModel");
const roadmapItemModel = require("../models/roadmapItemModel");
const asyncHandler = require("../utils/asyncHandler");

// PUT /api/progress/:roadmapItemId   body: { percentage }
// percentage should be one of 0, 25, 50, 75, 100 (but any 0-100 value is accepted).
// When it reaches 100, the roadmap item is automatically marked COMPLETED.
const updateProgress = asyncHandler(async (req, res) => {
  const { percentage } = req.body;
  const itemId = req.params.roadmapItemId;

  if (percentage === undefined || percentage < 0 || percentage > 100) {
    return res.status(400).json({ message: "percentage must be a number between 0 and 100." });
  }

  // Make sure this roadmap item actually belongs to the logged-in student.
  const item = await roadmapItemModel.getItemOwnedByUser(itemId, req.user.id);
  if (!item) {
    return res.status(404).json({ message: "Roadmap item not found." });
  }

  await progressModel.setPercentage(itemId, percentage);

  if (percentage >= 100) {
    await roadmapItemModel.updateStatus(itemId, "COMPLETED");
  } else if (percentage > 0) {
    await roadmapItemModel.updateStatus(itemId, "IN_PROGRESS");
  } else {
    await roadmapItemModel.updateStatus(itemId, "NOT_STARTED");
  }

  res.json({ message: "Progress updated.", percentage });
});

module.exports = { updateProgress };
