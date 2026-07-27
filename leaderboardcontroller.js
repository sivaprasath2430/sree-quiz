const db = require("./database");

/* ==========================================
   GET LEADERBOARD
========================================== */

exports.getLeaderboard = (req, res) => {

    const quizId = req.params.quizId;

    const sql = `

        SELECT
            r.fullname,
            r.score,
            r.percentage,
            r.submittedAt

        FROM results r

        INNER JOIN (

            SELECT
                userId,
                quizId,
                MAX(id) AS lastResultId

            FROM results

            WHERE quizId = ?

            GROUP BY userId, quizId

        ) latest

        ON r.id = latest.lastResultId

        ORDER BY
            r.percentage DESC,
            r.score DESC,
            r.submittedAt ASC

    `;

    db.all(sql, [quizId], (err, rows) => {

        if (err) {

            console.log("Leaderboard Error:", err);

            return res.json({

                success: false,

                message: err.message

            });

        }

        res.json({

            success: true,

            leaderboard: rows

        });

    });

};