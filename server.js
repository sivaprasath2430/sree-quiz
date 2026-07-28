/* ==========================================
   QuizMaster AI - Main Server
========================================== */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Database Connection
require("./database");

// Routes
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const quizRoutes = require("./quizRoutes");
const resultRoutes = require("./resultRoutes");
const leaderboardRoutes = require("./leaderboardRoutes");

// Create Express App
const app = express();

/* ==========================================
   Middleware
========================================== */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ==========================================
   Serve Frontend
========================================== */

app.use(express.static(__dirname));

/* ==========================================
   Upload Folder
========================================== */

app.use("/upload", express.static(path.join(__dirname, "upload")));

/* ==========================================
   API Routes
========================================== */

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/result", resultRoutes);

app.use("/api/leaderboard", leaderboardRoutes);

/* ==========================================
   Home Page
========================================== */

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));

});

/* ==========================================
   404 Page
========================================== */

app.use((req, res) => {

    res.status(404).sendFile(path.join(__dirname, "index.html"));

});

/* ==========================================
   Start Server
========================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

    console.log("=================================");

    console.log("✅ SQLite Database Connected");

    console.log("🚀 QuizMaster AI Server Started");

    console.log(`🌐 Server running on port ${PORT}`);

    console.log("=================================");

});