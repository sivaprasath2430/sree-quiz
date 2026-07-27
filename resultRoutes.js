/* ==========================================
   QuizMaster AI - Result Routes
========================================== */

const express = require("express");
const router = express.Router();

const resultcontroller = require("./resultcontroller");

/* ==========================================
   CURRENT STUDENT RESULT
========================================== */

router.get(
    "/user/:userId",
    resultcontroller.getUserResult
);

/* ==========================================
   QUIZ LEADERBOARD
========================================== */

router.get(
    "/leaderboard/:quizid",
    resultcontroller.getLeaderboard
);

module.exports = router;