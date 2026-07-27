const express = require("express");
const router = express.Router();

const leaderboardController = require("./leaderboardcontroller");

router.get("/:quizId", leaderboardController.getLeaderboard);

module.exports = router;