const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const db = require("./database");

/* ==========================================
   Upload Quiz PDF
========================================== */

exports.uploadQuiz = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF."
            });
        }

        const quizid = Number(req.body.quizid);

        if (!quizid) {

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(400).json({
                success: false,
                message: "Quiz ID is required."
            });
        }

        console.log("==================================");
        console.log("Uploaded File:", req.file.path);
        console.log("Quiz ID:", quizid);
        console.log("==================================");

        /* Read PDF */

        const data = new Uint8Array(
            fs.readFileSync(req.file.path)
        );

        const loadingTask = pdfjsLib.getDocument({ data });

        const pdf = await loadingTask.promise;

        let text = "";

        for (let page = 1; page <= pdf.numPages; page++) {

            const currentPage = await pdf.getPage(page);

            const content = await currentPage.getTextContent();

            text += content.items
                .map(item => item.str)
                .join("\n");

            text += "\n";
        }

        console.log("========== PDF TEXT ==========");
        console.log(text);
        console.log("==============================");

        /* Split Questions */

        const questionBlocks = text
            .split(/(?=\d+\.)/)
            .filter(block => block.trim() !== "");

        console.log(
            "Questions Found:",
            questionBlocks.length
        );

        let inserted = 0;

        for (const block of questionBlocks) {

            const lines = block
                .split("\n")
                .map(line => line.trim())
                .filter(line => line !== "");

            if (lines.length < 6) {

                console.log("Skipped Block:", lines);

                continue;
            }

            const question =
                lines[0].replace(/^\d+\.\s*/, "");

            const optionA =
                lines[1].replace(/^A[\.\)]?\s*/i, "");

            const optionB =
                lines[2].replace(/^B[\.\)]?\s*/i, "");

            const optionC =
                lines[3].replace(/^C[\.\)]?\s*/i, "");

            const optionD =
                lines[4].replace(/^D[\.\)]?\s*/i, "");

            const answer =
                lines[5]
                    .replace(/Answer\s*:/i, "")
                    .trim()
                    .toUpperCase();

            let correctAnswer = "";

            switch (answer) {

                case "A":
                    correctAnswer = optionA;
                    break;

                case "B":
                    correctAnswer = optionB;
                    break;

                case "C":
                    correctAnswer = optionC;
                    break;

                case "D":
                    correctAnswer = optionD;
                    break;

                default:
                    correctAnswer = "";
            }

            await new Promise((resolve, reject) => {

                db.run(
                    `INSERT INTO questions
                    (
                        quizid,
                        question,
                        optionA,
                        optionB,
                        optionC,
                        optionD,
                        correctAnswer
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        quizid,
                        question,
                        optionA,
                        optionB,
                        optionC,
                        optionD,
                        correctAnswer
                    ],
                    function (err) {

                        if (err) {

                            console.log(
                                "Insert Error:",
                                err.message
                            );

                            reject(err);

                        } else {

                            inserted++;

                            console.log(
                                "Inserted Question:",
                                this.lastID
                            );

                            resolve();
                        }
                    }
                );
            });
        }

        /* Delete uploaded PDF after processing */

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.json({
            success: true,
            message: `${inserted} Questions Uploaded Successfully`,
            inserted: inserted,
            quizid: quizid
        });

    } catch (err) {

        console.log("PDF ERROR:", err);

        if (
            req.file &&
            fs.existsSync(req.file.path)
        ) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: "Failed to process PDF.",
            error: err.message
        });
    }
};


/* ==========================================
   Get Quiz Questions
========================================== */

exports.getQuizQuestions = (req, res) => {

    const quizid = Number(req.params.quizid);

    if (!quizid) {

        return res.json({
            success: false,
            message: "Invalid Quiz ID"
        });
    }

    console.log(
        "Loading questions for Quiz ID:",
        quizid
    );

    const sql = `
        SELECT
            id,
            quizid,
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer
        FROM questions
        WHERE quizid = ?
        ORDER BY id ASC
    `;

    db.all(sql, [quizid], (err, rows) => {

        if (err) {

            console.log(
                "Question Load Error:",
                err.message
            );

            return res.json({
                success: false,
                message: err.message
            });
        }

        console.log(
            "Questions Loaded:",
            rows.length
        );

        if (rows.length === 0) {

            return res.json({
                success: false,
                message: "No Questions Found For This Quiz",
                questions: []
            });
        }

        /* Get quiz details */

        db.get(
            `SELECT id, title, time
             FROM quiz
             WHERE id = ?`,
            [quizid],
            (quizErr, quiz) => {

                if (quizErr) {

                    console.log(
                        "Quiz Details Error:",
                        quizErr.message
                    );

                    return res.json({
                        success: false,
                        message: quizErr.message
                    });
                }

                res.json({

                    success: true,

                    quizid: quizid,

                    title: quiz
                        ? quiz.title
                        : "Quiz",

                    time: quiz
                        ? quiz.time
                        : 10,

                    questions: rows

                });

            }
        );

    });
};


/* ==========================================
   Delete Quiz Questions
========================================== */

exports.deleteQuiz = (req, res) => {

    const quizid = Number(req.params.quizid);

    if (!quizid) {

        return res.json({
            success: false,
            message: "Invalid Quiz ID"
        });
    }

    db.run(
        "DELETE FROM questions WHERE quizid = ?",
        [quizid],
        function (err) {

            if (err) {

                return res.json({
                    success: false,
                    message: "Unable to delete questions"
                });
            }

            res.json({
                success: true,
                message:
                    `${this.changes} Questions Deleted Successfully`
            });

        }
    );
};