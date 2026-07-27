
/* ==========================================
   QuizMaster AI - Quiz Routes
========================================== */
const express = require("express");
const router = express.Router();
const db = require("./database");
const quizController = require("./quizcontroller");
const upload = require("./upload");
router.delete("/delete/:quizid", quizController.deleteQuiz);

/* ==========================================
   GET ALL QUIZZES
========================================== */

router.get("/", (req, res) => {

    const sql = "SELECT * FROM quiz ORDER BY id DESC";

    db.all(sql, [], (err, rows) => {

        if (err) {

            return res.json({
                success: false,
                message: "Database Error"
            });

        }

        res.json({
            success: true,
            quizzes: rows
        });

    });

});

/* ==========================================
   GET SINGLE QUIZ
========================================== */

router.get("/:id", (req, res) => {

    const sql = "SELECT * FROM quiz WHERE id=?";

    db.get(sql, [req.params.id], (err, quiz) => {

        if (err) {

            return res.json({
                success: false,
                message: "Database Error"
            });

        }

        if (!quiz) {

            return res.json({
                success: false,
                message: "Quiz Not Found"
            });

        }

        db.all(

            "SELECT * FROM questions WHERE quizId=?",

            [req.params.id],

            (err, questions) => {

                if (err) {

                    return res.json({
                        success: false,
                        message: "Question Load Failed"
                    });

                }

                quiz.questions = questions;

                res.json({
                    success: true,
                    quiz: quiz
                });

            }

        );

    });

});

/* ==========================================
   SUBMIT QUIZ
========================================== */
router.post("/submit", (req, res) => {

    const { userId, quizId, answers } = req.body;

    if (!userId || !quizId || !answers) {

        return res.json({

            success: false,

            message: "Missing Required Data"

        });

    }

    db.all(

        "SELECT * FROM questions WHERE quizId = ?",

        [quizId],

        (err, questions) => {

            if (err) {

                return res.json({

                    success: false,

                    message: err.message

                });

            }

            if (questions.length === 0) {

                return res.json({

                    success: false,

                    message: "No Questions Found"

                });

            }

            let score = 0;

            questions.forEach((question, index) => {

                if (
                    answers[index] &&
                    answers[index] === question.correctAnswer
                ) {

                    score++;

                }

            });

            const percentage =
                ((score / questions.length) * 100).toFixed(2);

            db.get(

                "SELECT fullname FROM users WHERE id = ?",

                [userId],

                (err, user) => {

                    if (err || !user) {

                        return res.json({

                            success: false,

                            message: "Student Not Found"

                        });

                    }

                    db.run(

                        `INSERT INTO results
                        (userId, fullname, quizId, score, percentage,totalQuestions)
                        VALUES (?, ?, ?, ?, ?, ? )`,

                        [

                            userId,

                            user.fullname,

                            quizId,

                            score,

                            percentage,

                            questions.length
                            

                            

                        ],

                        function (err) {

                            if (err) {

                                console.log(err);

                                return res.json({

                                    success: false,

                                    message: err.message

                                });

                            }

                            res.json({

                                success: true,

                                score: score,

                                total: questions.length,

                                percentage: percentage

                            });

                        }

                    );

                }

            );

        }

    );

});
/* ==========================================
   UPLOAD PDF
========================================== */

router.post(
    "/upload",
    upload.single("pdf"),
    quizController.uploadQuiz
);

/* ==========================================
   GET QUESTIONS
========================================== */

router.get( "/questions/:quizid",
    quizController.getQuizQuestions
);

module.exports = router;