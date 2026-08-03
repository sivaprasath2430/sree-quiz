const express = require("express");
const router = express.Router();
const db = require("./database");

const leaderboardController = require("./leaderboardcontroller");



router.get("/stats", (req, res) => {

    db.get(
        `
        SELECT
            COUNT(DISTINCT userId) AS totalParticipants,
            MAX(percentage) AS highestScore,
            AVG(percentage) AS averageScore
        FROM results
        `,
        [],
        (err, row) => {

            if (err) {
                return res.json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                totalParticipants: row.totalParticipants || 0,
                highestScore: row.highestScore || 0,
                averageScore: row.averageScore
                    ? Number(row.averageScore).toFixed(2)
                    : "0.00"
            });

        }
    );

});
router.get("/:quizId", leaderboardController.getLeaderboard);

module.exports = router;