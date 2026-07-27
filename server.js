/* ==========================================
   QuizMaster AI - Main Server
========================================== */

require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Database Connection
const db = require("./database");


const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const quizRoutes = require("./quizRoutes");
const resultRoutes = require("./resultRoutes");
const leaderboardRoutes = require("./leaderboardRoutes");

// Create Express App
const app = express();

// Connect MongoD

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Upload Folder
app.use("/upload", express.static("upload"));

// Home Route
app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "QuizMaster AI Backend Running Successfully"
    });

});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Invalid Route
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });

});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

    console.log("=================================");
    console.log("✅ SQLite Database Connected");
    console.log("🚀 QuizMaster AI Server Started");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("=================================");

});