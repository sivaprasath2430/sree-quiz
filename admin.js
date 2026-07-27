/* ==========================================
   QuizMaster AI - Admin Dashboard
   Part 1
========================================== */

let quizQuestions = [];

/* ==========================================
   SIDEBAR MENU
========================================== */

const menuItems = document.querySelectorAll(".sidebar li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

    });

});

/* ==========================================
   DASHBOARD BUTTON
========================================== */

const dashboardBtn = document.getElementById("dashboardBtn");

if (dashboardBtn) {

    dashboardBtn.addEventListener("click", () => {

        alert("Dashboard Opened");

    });

}

/* ==========================================
   QUESTIONS BUTTON
========================================== */

const questionsBtn = document.getElementById("questionsBtn");

if (questionsBtn) {

    questionsBtn.addEventListener("click", () => {

        document.querySelector(".preview").scrollIntoView({

            behavior: "smooth"

        });

    });

}

/* ==========================================
   STUDENTS BUTTON
========================================== */

const studentsBtn = document.getElementById("studentsBtn");

if (studentsBtn) {

    studentsBtn.addEventListener("click", () => {

    window.location.href = "students.html";

    });

}

/* ==========================================
   LEADERBOARD BUTTON
========================================== */
leaderboardBtn.addEventListener("click", () => {

    window.location.href = "leaderboard.html";

});

/* ==========================================
   ANALYTICS BUTTON
========================================== */

analysisBtn.addEventListener("click", () => {

    window.location.href = "analysis.html";

});

/* ==========================================
   SETTINGS BUTTON
========================================== */

const settingsBtn = document.getElementById("settingsBtn");

if (settingsBtn) {

    settingsBtn.addEventListener("click", () => {

        alert("Settings Module");

    });

}

/* ==========================================
   DARK MODE
========================================== */

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            themeBtn.innerHTML = "☀️ Light Mode";

        } else {

            themeBtn.innerHTML = "🌙 Dark Mode";

        }

    });

}

/* ==========================================
   SEARCH QUESTIONS
========================================== */

const searchBox = document.getElementById("searchQuestion");

if (searchBox) {

    searchBox.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const cards = document.querySelectorAll(".questionCard");

        cards.forEach(card => {

            card.style.display =
                card.innerText.toLowerCase().includes(value)
                ? "block"
                : "none";

        });

    });

}

/* ==========================================
   TOAST MESSAGE
========================================== */

function showToast(message, color = "#27ae60") {

    const toast = document.createElement("div");

    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = color;
    toast.style.color = "#fff";
    toast.style.padding = "15px 20px";
    toast.style.borderRadius = "8px";
    toast.style.fontWeight = "bold";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}
/* ==========================================
   PDF UPLOAD & QUESTION PREVIEW
   Part 2
========================================== */

const uploadBtn = document.getElementById("uploadBtn");
const pdfFile = document.getElementById("pdfFile");
const quizSelect = document.getElementById("quizSelect");
const questionList = document.getElementById("questionList");
let uploadedQuizId = null;
/* ==========================================
   UPLOAD PDF
========================================== */

if (uploadBtn) {
    uploadBtn.addEventListener("click", uploadPDF);
}

async function uploadPDF() {

    const pdfFile = document.getElementById("pdfFile");
    const file = pdfFile.files[0];

    if (!file) {
        showToast("Please select a PDF", "#e74c3c");
        return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("quizid", quizSelect.value);

    uploadBtn.disabled = true;
    uploadBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';

    try {

        // Upload PDF
        const response = await fetch(
            "http://localhost:5000/api/quiz/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!data.success) {

            showToast(data.message, "#e74c3c");

            uploadBtn.disabled = false;
            uploadBtn.innerHTML =
                '<i class="fa-solid fa-upload"></i> Upload PDF';

            return;
        }

        uploadedQuizId = quizSelect.value;

        showToast(data.message, "#2ecc71");

        // Load questions from database
        loadQuestions(uploadedQuizId);

    } catch (err) {

        console.log(err);

        showToast("Upload Failed", "#e74c3c");

    }

    uploadBtn.disabled = false;
    uploadBtn.innerHTML =
        '<i class="fa-solid fa-upload"></i> Upload PDF';
}
const deleteBtn = document.getElementById("deleteQuizBtn");

if (deleteBtn) {

    deleteBtn.addEventListener("click", deleteQuizQuestions);

}

async function deleteQuizQuestions() {

    const quizid = document.getElementById("deleteQuizId").value;

    if (!confirm("Delete all questions of this quiz?")) {

        return;

    }

    try {

        const response = await fetch(

            `http://localhost:5000/api/quiz/delete/${quizid}`,

            {

                method: "DELETE"

            }

        );

        const data = await response.json();

        alert(data.message);

        document.getElementById("questionList").innerHTML =
            "<p>No Questions Available</p>";

    }

    catch (err) {

        console.log(err);

        alert("Delete Failed");

    }

}

/* ==========================================
   DISPLAY QUESTIONS
========================================== */

function displayQuestions(questions) {

    questionList.innerHTML = "";

    if (!questions || questions.length === 0) {

        questionList.innerHTML = `

            <p>
                No Questions Found
            </p>

        `;

        return;

    }

    questions.forEach((question, index) => {

        const card = document.createElement("div");

        card.className = "questionCard";

        card.innerHTML = `

            <h3>
                Question ${index + 1}
            </h3>

            <p>
                ${question.question}
            </p>

            <ul>

                <li>A. ${question.optionA}</li>

                <li>B. ${question.optionB}</li>

                <li>C. ${question.optionC}</li>

                <li>D. ${question.optionD}</li>

            </ul>

            <strong>
                Answer:
                ${question.correctAnswer}
            </strong>

        `;

        questionList.appendChild(card);

    });

}

/* ==========================================
   LOAD QUESTIONS FROM SERVER
========================================== */

async function loadQuestions(quizid) {

    try {

        const response = await fetch(

            `http://localhost:5000/api/quiz/questions/${quizid}`

        );

        const data = await response.json();

        if (data.success) {

            displayQuestions(data.questions);

        }

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   QUIZ CHANGE
========================================== */

if (quizSelect) {

    quizSelect.addEventListener("change", () => {

        loadQuestions(quizSelect.value);

    });

}
/* ==========================================
   MANUAL QUESTION MANAGEMENT
   Part 3
========================================== */

/* ==========================================
   ADD QUESTION
========================================== */

const addQuestionBtn = document.getElementById("addQuestionBtn");

if (addQuestionBtn) {

    addQuestionBtn.addEventListener("click", addQuestion);

}

function addQuestion() {

    const question = prompt("Enter Question");

    if (!question) return;

    const optionA = prompt("Option A");
    if (!optionA) return;

    const optionB = prompt("Option B");
    if (!optionB) return;

    const optionC = prompt("Option C");
    if (!optionC) return;

    const optionD = prompt("Option D");
    if (!optionD) return;

    const answer = prompt("Correct Answer (A/B/C/D)");

    if (!answer) return;

    let correctAnswer = "";

    switch (answer.toUpperCase()) {

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
            showToast("Invalid Answer", "#e74c3c");
            return;

    }

    const newQuestion = {

        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer

    };

    quizQuestions.push(newQuestion);

    displayQuestions(quizQuestions);

    showToast("Question Added");

}

/* ==========================================
   DELETE QUESTION
========================================== */

function deleteQuestion(index) {

    if (!confirm("Delete this question?")) {

        return;

    }

    quizQuestions.splice(index, 1);

    displayQuestions(quizQuestions);

    showToast("Question Deleted", "#e74c3c");

}

/* ==========================================
   UPDATE DISPLAY
========================================== */

function displayQuestions(questions) {

    questionList.innerHTML = "";

    if (questions.length === 0) {

        questionList.innerHTML = "<p>No Questions Available</p>";

        return;

    }

    questions.forEach((q, index) => {

        const card = document.createElement("div");

        card.className = "questionCard";

        card.innerHTML = `

            <h3>Question ${index + 1}</h3>

            <p>${q.question}</p>

            <ul>

                <li>A. ${q.optionA}</li>

                <li>B. ${q.optionB}</li>

                <li>C. ${q.optionC}</li>

                <li>D. ${q.optionD}</li>

            </ul>

            <strong>Answer : ${q.correctAnswer}</strong>

            <br><br>

            <button
                onclick="deleteQuestion(${index})"
                style="
                    background:#e74c3c;
                    color:white;
                    border:none;
                    padding:8px 15px;
                    border-radius:5px;
                    cursor:pointer;
                ">

                Delete

            </button>

        `;

        questionList.appendChild(card);

    });

}

/* ==========================================
   SAVE QUESTIONS LOCALLY
========================================== */

function saveQuiz() {

    localStorage.setItem(

        "quizQuestions",

        JSON.stringify(quizQuestions)

    );

    showToast("Quiz Saved");

}

/* ==========================================
   LOAD SAVED QUESTIONS
========================================== */

window.addEventListener("load", () => {

    const saved = localStorage.getItem("quizQuestions");

    if (saved) {

        quizQuestions = JSON.parse(saved);

        displayQuestions(quizQuestions);

    }

});
/* ==========================================
   PUBLISH QUIZ
========================================== */

const publishBtn = document.getElementById("publishBtn");

if (publishBtn) {

    publishBtn.addEventListener("click", publishQuiz);

}

async function publishQuiz() {

    if (quizQuestions.length === 0) {

        showToast("No Questions Available", "#e74c3c");

        return;

    }

    try {

        const response = await fetch(

            "http://localhost:5000/api/quiz/publish",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    quizid: quizSelect.value,

                    title: document.getElementById("quizTitle").value,

                    description: document.getElementById("quizDescription").value,

                    time: document.getElementById("quizTime").value,

                    marks: document.getElementById("quizMarks").value,

                    questions: quizQuestions

                })

            }

        );

        const data = await response.json();

        showToast(data.message);

    }

    catch (err) {

        console.log(err);

        showToast("Publish Failed", "#e74c3c");

    }

}

/* ==========================================
   BACKUP QUIZ
========================================== */

const downloadBtn = document.getElementById("downloadBtn");

if (downloadBtn) {

    downloadBtn.addEventListener("click", backupQuiz);

}

function backupQuiz() {

    if (quizQuestions.length === 0) {

        showToast("Nothing to Backup", "#e74c3c");

        return;

    }

    const blob = new Blob(

        [

            JSON.stringify(quizQuestions, null, 2)

        ],

        {

            type: "application/json"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Quiz_Backup.json";

    a.click();

    URL.revokeObjectURL(url);

    showToast("Backup Downloaded");

}

/* ==========================================
   IMPORT QUIZ
========================================== */

const importBtn = document.getElementById("importBtn");

const importFile = document.getElementById("importFile");

if (importBtn) {

    importBtn.addEventListener("click", () => {

        importFile.click();

    });

}

if (importFile) {

    importFile.addEventListener("change", importQuiz);

}

function importQuiz(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        try {

            quizQuestions = JSON.parse(e.target.result);

            displayQuestions(quizQuestions);

            saveQuiz();

            showToast("Quiz Imported");

        }

        catch {

            showToast("Invalid JSON File", "#e74c3c");

        }

    };

    reader.readAsText(file);

}

/* ==========================================
   RESET QUIZ
========================================== */

const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {

    resetBtn.addEventListener("click", resetQuiz);

}

function resetQuiz() {

    if (!confirm("Delete all questions?")) {

        return;

    }

    quizQuestions = [];

    displayQuestions(quizQuestions);

    localStorage.removeItem("quizQuestions");

    showToast("Quiz Reset", "#e74c3c");

}
/* ==========================================
   STUDENTS | LEADERBOARD | ANALYTICS
   Part 5
========================================== */

/* ==========================================
   LOAD DASHBOARD STATISTICS
========================================== */

async function loadStatistics() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/statistics"
        );

        const data = await response.json();

        if (!data.success) return;

        const cards = document.querySelectorAll(".card h2");

        if (cards.length >= 4) {

            cards[0].innerText = data.totalStudents;
            cards[1].innerText = data.totalQuestions;
            cards[2].innerText = data.totalQuiz;
            cards[3].innerText = data.averageScore + "%";

        }

    }

    catch (err) {

        console.log(err);

    }

}

/* ==========================================
   LOAD STUDENTS
========================================== */

async function loadStudents() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/students"
        );

        const data = await response.json();

        if (!data.success) return;

        console.table(data.students);

        showToast(

            data.students.length +

            " Students Loaded"

        );

    }

    catch (err) {

        console.log(err);

    }

}

/* ==========================================
   LOAD LEADERBOARD
========================================== */

async function loadLeaderboard() {

    try {

        const response = await fetch(

            "http://localhost:5000/api/result/leaderboard"

        );

        const data = await response.json();

        if (!data.success) return;

        console.table(data.leaderboard);

        showToast(

            "Leaderboard Loaded"

        );

    }

    catch (err) {

        console.log(err);

    }

}

/* ==========================================
   ANALYTICS
========================================== */

async function loadAnalytics() {

    try {

        const response = await fetch(

            "http://localhost:5000/api/admin/analytics"

        );

        const data = await response.json();

        if (!data.success) return;

        console.log(data);

        showToast(

            "Analytics Updated"

        );

    }

    catch (err) {

        console.log(err);

    }

}

/* ==========================================
   BUTTON EVENTS
========================================== */

if (studentsBtn) {

    studentsBtn.addEventListener(

        "click",

        loadStudents

    );

}

if (leaderboardBtn) {

    leaderboardBtn.addEventListener(

        "click",

        loadLeaderboard

    );

}

if (analyticsBtn) {

    analyticsBtn.addEventListener(

        "click",

        loadAnalytics

    );

}

/* ==========================================
   LIVE CLOCK
========================================== */

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString();

    document.title =

        "QuizMaster AI | " +

        time;

}

setInterval(

    updateClock,

    1000

);

/* ==========================================
   LOAD DASHBOARD
========================================== */

window.addEventListener(

    "load",

    () => {

        loadStatistics();

    }

);
/* ==========================================
   FINAL POLISH & OPTIMIZATION
   Part 6
========================================== */

/* ==========================================
   CARD ANIMATION
========================================== */

function animateCards() {

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(40px)";

        setTimeout(() => {

            card.style.transition =
                "0.5s ease";

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0px)";

        }, index * 150);

    });

}

/* ==========================================
   BUTTON LOADING
========================================== */

function buttonLoading(button, state) {

    if (state) {

        button.disabled = true;

        button.dataset.old = button.innerHTML;

        button.innerHTML =

            '<i class="fa-solid fa-spinner fa-spin"></i> Please Wait';

    }

    else {

        button.disabled = false;

        button.innerHTML = button.dataset.old;

    }

}

/* ==========================================
   COUNTER ANIMATION
========================================== */

function animateCounter(element, target) {

    let count = 0;

    const speed = target / 60;

    const timer = setInterval(() => {

        count += speed;

        if (count >= target) {

            count = target;

            clearInterval(timer);

        }

        element.innerText =

            Math.floor(count);

    }, 20);

}

/* ==========================================
   ANIMATE DASHBOARD
========================================== */

function animateDashboard() {

    const cards = document.querySelectorAll(".card h2");

    if (cards.length >= 4) {

        animateCounter(cards[0], parseInt(cards[0].innerText) || 0);

        animateCounter(cards[1], parseInt(cards[1].innerText) || 0);

        animateCounter(cards[2], parseInt(cards[2].innerText) || 0);

    }

}

/* ==========================================
   AUTO SAVE
========================================== */

setInterval(() => {

    localStorage.setItem(

        "quizQuestions",

        JSON.stringify(quizQuestions)

    );

}, 10000);

/* ==========================================
   PDF FILE NAME
========================================== */

if (pdfFile) {

    pdfFile.addEventListener("change", () => {

        if (pdfFile.files.length > 0) {

            showToast(

                "Selected : " +

                pdfFile.files[0].name

            );

        }

    });

}

/* ==========================================
   CONFIRM BEFORE EXIT
========================================== */

window.addEventListener(

    "beforeunload",

    function (e) {

        if (quizQuestions.length > 0) {

            e.preventDefault();

            e.returnValue = "";

        }

    }

);

/* ==========================================
   KEYBOARD SHORTCUTS
========================================== */

document.addEventListener(

    "keydown",

    function (e) {

        if (e.ctrlKey && e.key === "s") {

            e.preventDefault();

            saveQuiz();

        }

        if (e.ctrlKey && e.key === "u") {

            e.preventDefault();

            uploadBtn.click();

        }

    }

);

/* ==========================================
   PAGE LOADED
========================================== */

window.onload = () => {

    animateCards();

    animateDashboard();

    loadStatistics();

    if (quizSelect) {

        loadQuestions(

            quizSelect.value

        );

    }

    showToast(

        "Welcome Admin"

    );

};

console.log(
    "QuizMaster AI Admin Dashboard Loaded Successfully"
);
document.getElementById("publishBtn").addEventListener("click", publishQuiz);

async function publishQuiz() {

    if (!uploadedQuizId) {

        alert("Please upload a quiz first.");

        return;

    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/quiz/publish",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    quizId: uploadedQuizId
                })
            }
        );

        const data = await response.json();

        alert(data.message);

    }

    catch (err) {

        console.log(err);

        alert("Unable to publish quiz.");

    }

}
document.getElementById("clearLeaderboardBtn").addEventListener("click", async () => {

    const ok = confirm(
        "Are you sure?\n\nThis will delete ALL leaderboard results."
    );

    if (!ok) return;

    try {

        const response = await fetch(

            "http://localhost:5000/api/admin/clearLeaderboard",

            {

                method: "DELETE"

            }

        );

        const data = await response.json();

        alert(data.message);

    }

    catch (err) {

        console.log(err);

        alert("Unable to Clear Leaderboard");

    }

});