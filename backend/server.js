// server.js
// Entry point: wires together middleware, routes and error handling,
// then starts listening for requests.

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const careerRoutes = require("./routes/careerRoutes");
const skillRoutes = require("./routes/skillRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ---------- Global middleware ----------
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(",")
      : "*",
  })
);
app.use(express.json()); // parse JSON request bodies

// ---------- Health check ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Skill Gap API is running." });
});

// ---------- Feature routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ---------- Centralized error handler (must be last) ----------
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Skill Gap API listening on http://localhost:${PORT}`);
});
