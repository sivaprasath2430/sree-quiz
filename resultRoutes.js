/* ==========================================
   QuizMaster AI - Result Routes
========================================== */

const express = require("express");
const router = express.Router();
const db = require("./database");

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

router.get("/dashboard/:userId", (req, res) => {

    const userId = req.params.userId;

    db.get(
        `
        SELECT
            COUNT(*) AS completed,
            MAX(percentage) AS bestScore
        FROM results
        WHERE userId = ?
        `,
        [userId],
        (err, result) => {

            if (err) {
                return res.json({
                    success: false,
                    message: err.message
                });
            }

            db.get(
                "SELECT COUNT(*) AS totalQuizzes FROM quiz",
                [],
                (err, quiz) => {

                    if (err) {
                        return res.json({
                            success: false,
                            message: err.message
                        });
                    }

                    db.all(
                        "SELECT userId, MAX(percentage) AS score FROM results GROUP BY userId ORDER BY score DESC",
                        [],
                        (err, rows) => {

                            let rank = "-";

                            rows.forEach((r, index) => {

                                if (r.userId == userId) {
                                    rank = index + 1;
                                }

                            });

                            res.json({

                                success: true,

                                totalQuizzes: quiz.totalQuizzes,

                                completed: result.completed || 0,

                                bestScore: result.bestScore || 0,

                                rank: rank

                            });

                        }
                    );

                }
            );

        }
    );

});

module.exports = router;