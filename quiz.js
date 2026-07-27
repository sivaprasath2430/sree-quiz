/* ==========================================
   QuizMaster AI - Quiz Page
========================================== */

const API_URL = "http://localhost:5000/api";

/* ==========================================
   GET QUIZ ID
========================================== */

const params = new URLSearchParams(window.location.search);
const quizId = params.get("quizid");

if (!quizId) {

    alert("No Quiz Selected!");

    window.location.href = "dashboard.html";

}

/* ==========================================
   VARIABLES
========================================== */

let quiz = {
    id: quizId,
    title: "",
    time: 10
};

let questions = [];
let answers = [];
let currentQuestion = 0;

let timer = null;
let timeLeft = 0;

/* ==========================================
   LOAD QUIZ
========================================== */

async function loadQuiz() {

    try {

        const response = await fetch(
            `${API_URL}/quiz/questions/${quizId}`
        );

        const data = await response.json();

        console.log("Quiz Response:", data);

        if (!data.success) {

            alert(data.message);

            return;

        }

        questions = data.questions;

        if (questions.length === 0) {

            alert("No Questions Found");

            return;

        }

        answers = new Array(questions.length).fill(null);

        document.getElementById("quizTitle").innerHTML =
            data.title || "Quiz";

        document.getElementById("totalQuestion").innerHTML =
            questions.length;

        document.getElementById("currentQuestion").innerHTML = "1";

        timeLeft = (data.time || 10) * 60;

        currentQuestion = 0;

        loadQuestion();

        startTimer();

    }

    catch(err){

        console.log(err);

        alert("Unable to Load Quiz");

    }

}

/* ==========================================
   LOAD QUESTION
========================================== */

function loadQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("currentQuestion").innerHTML =
        currentQuestion + 1;

    document.getElementById("question").innerHTML =
        q.question;

    const options =
        document.querySelectorAll(".option");

    options[0].innerHTML = q.optionA;
    options[1].innerHTML = q.optionB;
    options[2].innerHTML = q.optionC;
    options[3].innerHTML = q.optionD;

    options.forEach((btn,index)=>{

        btn.classList.remove("selected");

        if(answers[currentQuestion]===index){

            btn.classList.add("selected");

        }

    });

    updateProgress();

}
/* ==========================================
   OPTION SELECTION
========================================== */

const optionButtons = document.querySelectorAll(".option");

optionButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        answers[currentQuestion] = index;

        optionButtons.forEach(btn => {

            btn.classList.remove("selected");

        });

        button.classList.add("selected");

    });

});

/* ==========================================
   NEXT BUTTON
========================================== */

document.getElementById("nextBtn").addEventListener("click", () => {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    } else {

        alert("This is the last question.");

    }

});

/* ==========================================
   PREVIOUS BUTTON
========================================== */

document.getElementById("prevBtn").addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();

    } else {

        alert("This is the first question.");

    }

});

/* ==========================================
   PROGRESS BAR
========================================== */

function updateProgress() {

    const percent =
        ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById("progressBar").style.width =
        percent + "%";

}
/* ==========================================
   TIMER
========================================== */

function startTimer() {

    clearInterval(timer);

    updateTimer();

    timer = setInterval(() => {

        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {

            clearInterval(timer);

            alert("Time Over!");

            submitQuiz();

        }

    }, 1000);

}

function updateTimer() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("time").innerHTML =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

/* ==========================================
   SUBMIT BUTTON
========================================== */

document.getElementById("submitBtn").addEventListener("click", () => {

    if (confirm("Are you sure you want to submit the quiz?")) {

        clearInterval(timer);

        submitQuiz();

    }

});

/* ==========================================
   SUBMIT QUIZ
========================================== */
async function submitQuiz() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        alert("Please Login First");
        window.location.href = "login.html";
        return;

    }

    let selectedAnswers = [];

    questions.forEach((q, index) => {

        let answer = "";

        switch (answers[index]) {

            case 0:
                answer = q.optionA;
                break;

            case 1:
                answer = q.optionB;
                break;

            case 2:
                answer = q.optionC;
                break;

            case 3:
                answer = q.optionD;
                break;

            default:
                answer = "";

        }

        selectedAnswers.push(answer);

    });

    try {

        const response = await fetch(`${API_URL}/quiz/submit`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                userId: currentUser.id,
                quizId: Number(quizId),
                answers: selectedAnswers

            })

        });

        const data = await response.json();

        console.log("Submit Response:", data);

        if (!data.success) {

            alert(data.message);
            return;

        }

        localStorage.setItem("currentQuizId", quizId);

        const wrong = data.total - data.score;

        alert(
            `Quiz Completed!\n\n` +
            `Correct Answers : ${data.score}\n` +
            `Wrong Answers : ${wrong}\n` +
            `Total Questions : ${data.total}\n` +
            `Percentage : ${data.percentage}%`
        );

        clearInterval(timer);

        window.onbeforeunload = null;

        window.location.href = "results.html";

    }

    catch (err) {

        console.error(err);
        alert("Unable to Submit Quiz");

    }

}

/* ==========================================
   PREVENT PAGE REFRESH
========================================== */

window.onbeforeunload = function () {

    return "Your quiz is in progress. Are you sure you want to leave?";

};

/* ==========================================
   START QUIZ
========================================== */

window.onload = () => {

    console.log("=================================");
    console.log("QuizMaster AI Started");
    console.log("Quiz ID:", quizId);
    console.log("=================================");

    loadQuiz();

};