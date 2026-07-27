const db = require("./database");

/* ==========================================
   CURRENT USER RESULT
========================================== */
exports.getUserResult = (req, res) => {

    console.log("================================");
    console.log("Route Params:", req.params);

    const userId = Number(req.params.userId);

    console.log("Searching User:", userId);

    db.get(
        "SELECT * FROM results WHERE userId=? ORDER BY id DESC LIMIT 1",
        [userId],
        (err, row) => {

            console.log("SQL Error:", err);
            console.log("Database Row:", row);

            if (err) {
                return res.json({
                    success: false,
                    message: err.message
                });
            }

            if (!row) {
                return res.json({
                    success: false,
                    message: "No Result Found"
                });
            }

            res.json({
                success: true,
                result: row
            });

        }
    );

};
/* ==========================================
   QUIZ LEADERBOARD
========================================== */

exports.getLeaderboard = (req, res) => {

    const quizId = req.params.quizid;

    const sql = `
        SELECT

            u.fullname,
            u.studentid,

            r.score,
            r.percentage,

            q.title

        FROM results r

        JOIN users u
            ON u.id = r.userId

        JOIN quiz q
            ON q.id = r.quizId

        WHERE r.quizId = ?

        ORDER BY
            r.percentage DESC,
            r.score DESC,
            r.id ASC
    `;

    db.all(sql, [quizId], (err, rows) => {

        if (err) {

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
db.all("SELECT * FROM results", [], (err, rows) => {

    console.log(rows);

});