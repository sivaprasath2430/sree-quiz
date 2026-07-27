/* ==========================================
   QuizMaster AI - SQLite Database
========================================== */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "quizmaster.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ SQLite Database Connection Failed:", err.message);
    } else {
        console.log("✅ SQLite Database Connected");
    }
});

db.configure("busyTimeout", 5000);

/* ==========================================
   USERS TABLE
========================================== */

db.run(`

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    fullname TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    mobile TEXT NOT NULL,

    college TEXT NOT NULL,

    studentid TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    role TEXT DEFAULT 'student'

)

`);
// Quiz Table
db.run(`
CREATE TABLE IF NOT EXISTS quiz(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    time INTEGER,
    marks INTEGER,
    published INTEGER DEFAULT 0
)
`);

// Questions Table
db.run(`
CREATE TABLE IF NOT EXISTS questions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quizid INTEGER,
    question TEXT,
    optionA TEXT,
    optionB TEXT,
    optionC TEXT,
    optionD TEXT,
    correctAnswer TEXT
)
`);

// Results Table
db.run(`
CREATE TABLE IF NOT EXISTS results(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    quizId INTEGER,
    score INTEGER,
    percentage REAL
    
)
`);
module.exports = db;