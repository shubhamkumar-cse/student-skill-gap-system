// controllers/skillGapController.js
const { calculateSkillGap } = require("../services/skillGapService");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/skill-gap/:careerId
const getSkillGap = asyncHandler(async (req, res) => {
  const { careerId } = req.params;
  const result = await calculateSkillGap(req.user.id, careerId);
  res.json(result);
});

module.exports = { getSkillGap };
