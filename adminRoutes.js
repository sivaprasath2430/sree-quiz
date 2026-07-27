/* ==========================================
   QuizMaster AI - Admin Routes
========================================== */

const express = require("express");
const router = express.Router();
const db = require("./database");

/* ==========================================
   CREATE QUIZ
========================================== */

router.post("/createQuiz", (req, res) => {

    const {
        title,
        description,
        time,
        totalQuestions
    } = req.body;

    if (!title || !time) {

        return res.json({
            success: false,
            message: "Title and Time are required."
        });

    }

    const sql = `
        INSERT INTO quiz
        (title, description, time, totalQuestions)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [title, description, time, totalQuestions],
        function(err){

            if(err){

                return res.json({
                    success:false,
                    message:"Database Error"
                });

            }

            res.json({
                success:true,
                message:"Quiz Created Successfully",
                quizId:this.lastID
            });

        }
    );

});

/* ==========================================
   ADD QUESTION
========================================== */

router.post("/addQuestion", (req, res) => {

    const {

        quizId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer

    } = req.body;

    const sql = `

    INSERT INTO questions
    (quizId,question,optionA,optionB,optionC,optionD,correctAnswer)

    VALUES(?,?,?,?,?,?,?)

    `;

    db.run(

        sql,

        [

            quizId,

            question,

            optionA,

            optionB,

            optionC,

            optionD,

            correctAnswer

        ],

        function(err){

            if(err){

                return res.json({

                    success:false,

                    message:"Unable to Add Question"

                });

            }

            res.json({

                success:true,

                message:"Question Added Successfully"

            });

        }

    );

});

/* ==========================================
   GET ALL QUIZZES
========================================== */

router.get("/quizzes",(req,res)=>{

    db.all(

        "SELECT * FROM quiz ORDER BY id DESC",

        [],

        (err,rows)=>{

            if(err){

                return res.json({

                    success:false,

                    message:"Database Error"

                });

            }

            res.json({

                success:true,

                quizzes:rows

            });

        }

    );

});

/* ==========================================
   GET QUESTIONS OF A QUIZ
========================================== */

router.get("/questions/:quizId",(req,res)=>{

    db.all(

        "SELECT * FROM questions WHERE quizId=?",

        [req.params.quizId],

        (err,rows)=>{

            if(err){

                return res.json({

                    success:false,

                    message:"Database Error"

                });

            }

            res.json({

                success:true,

                questions:rows

            });

        }

    );

});

/* ==========================================
   DELETE QUESTION
========================================== */

router.delete("/question/:id",(req,res)=>{

    db.run(

        "DELETE FROM questions WHERE id=?",

        [req.params.id],

        function(err){

            if(err){

                return res.json({

                    success:false,

                    message:"Delete Failed"

                });

            }

            res.json({

                success:true,

                message:"Question Deleted"

            });

        }

    );

});

/* ==========================================
   DELETE QUIZ
========================================== */

router.delete("/quiz/:id",(req,res)=>{

    const quizId=req.params.id;

    db.run(

        "DELETE FROM questions WHERE quizId=?",

        [quizId],

        ()=>{

            db.run(

                "DELETE FROM quiz WHERE id=?",

                [quizId],

                function(err){

                    if(err){

                        return res.json({

                            success:false,

                            message:"Delete Failed"

                        });

                    }

                    res.json({

                        success:true,

                        message:"Quiz Deleted Successfully"

                    });

                }

            );

        }

    );

});

/* ==========================================
   EXPORT
========================================== */

router.get("/students", (req, res) => {

    db.all(
        "SELECT studentid, fullname, email, college FROM users",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            res.json({
                success: true,
                students: rows
            });

        }
    );

});
router.delete("/clearLeaderboard", (req, res) => {

    db.run("DELETE FROM results", (err) => {

        if (err) {

            return res.json({

                success: false,

                message: err.message

            });

        }

        db.run(
            "DELETE FROM sqlite_sequence WHERE name='results'",
            () => {

                res.json({

                    success: true,

                    message: "Leaderboard Cleared Successfully"

                });

            }
        );

    });

});
router.get("/analysis",(req,res)=>{

    db.get(

        `SELECT

        COUNT(DISTINCT userId) students,

        COUNT(*) attempts,

        MAX(percentage) highest,

        ROUND(AVG(percentage),2) average

        FROM results`,

        (err,stats)=>{

            if(err){

                return res.json({

                    success:false,

                    message:err.message

                });

            }

            db.all(

                `SELECT fullname,quizId,score,percentage

                FROM results

                ORDER BY id DESC

                LIMIT 10`,

                (err,rows)=>{

                    if(err){

                        return res.json({

                            success:false,

                            message:err.message

                        });

                    }

                    res.json({

                        success:true,

                        statistics:stats,

                        results:rows

                    });

                }

            );

        }

    );

});
module.exports = router;