const express = require("express");
const router = express.Router();

const db = require("./database");

/* ===============================
   STUDENT REGISTER
================================ */

router.post("/register", (req, res) => {

    const {
        fullname,
        email,
        mobile,
        college,
        studentid,
        password
    } = req.body;

    const sql = `
        INSERT INTO users
        (fullname, email, mobile, college, studentid, password)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [fullname, email, mobile, college, studentid, password],
        function (err) {

            if (err) {
                return res.json({
                    success: false,
                    message: "Student ID or Email already exists."
                });
            }

            res.json({
                success: true,
                message: "Registration Successful"
            });

        }
    );

});

/* ===============================
   STUDENT LOGIN
================================ */

router.post("/login", (req, res) => {

    const { studentid, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE studentid=? AND password=?",
        [studentid, password],
        (err, row) => {

            if (err) {
                return res.json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (!row) {
                return res.json({
                    success: false,
                    message: "Invalid Student ID or Password"
                });
            }

            res.json({
                success: true,
                user: row
            });

        }
    );

});

/* ===============================
   ADMIN LOGIN
================================ */

router.post("/admin", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {

        return res.json({
            success: true,
            message: "Admin Login Successful"
        });

    }

    res.json({
        success: false,
        message: "Invalid Admin Credentials"
    });

});

module.exports = router;