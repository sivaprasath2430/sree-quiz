/* ==========================================
   QuizMaster AI - Results Page
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadResult();

    document.getElementById("dashboardBtn")
        .addEventListener("click", () => {

            window.location.href = "dashboard.html";

        });

    document.getElementById("leaderboardBtn")
        .addEventListener("click", () => {

            const quizId = localStorage.getItem("selectedQuiz");

            if (!quizId) {

                alert("No Quiz Selected");

                return;

            }

            window.location.href =
                `leaderboard.html?quizid=${quizId}`;

        });

    document.getElementById("certificateBtn")
        .addEventListener("click", downloadCertificate);

});


/* ==========================================
   LOAD RESULT
========================================== */

async function loadResult() {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        alert("Please Login");

        window.location.href = "login.html";

        return;

    }

    try {

        const response = await fetch(

            `http://localhost:5000/api/result/user/${currentUser.id}`

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        const result = data.result;

        document.getElementById("score").innerHTML =
            result.score;

        document.getElementById("percentage").innerHTML =
            result.percentage + "%";

        document.getElementById("correct").innerHTML =
            result.score;

            document.getElementById("total").innerHTML =
    result.totalQuestions;

document.getElementById("wrong").innerHTML =
    result.totalQuestions - result.score;


        updateResultColor(result.percentage);

        window.currentResult = result;

    }

    catch (err) {

        console.error(err);

        alert("Unable to Load Result");

    }

}


/* ==========================================
   RESULT COLOR
========================================== */

function updateResultColor(percentage) {

    const box =
        document.querySelector(".scoreBox");

    percentage = parseFloat(percentage);

    if (percentage >= 80) {

        box.style.borderColor = "#00B894";

    }

    else if (percentage >= 50) {

        box.style.borderColor = "#F1C40F";

    }

    else {

        box.style.borderColor = "#E74C3C";

    }

}


/* ==========================================
   DOWNLOAD CERTIFICATE
========================================== */

function downloadCertificate() {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!window.currentResult) {

        alert("No Result");

        return;

    }

    const certificate = `

====================================

        QUIZ CERTIFICATE

====================================

Student Name : ${currentUser.fullname}

Student ID   : ${currentUser.studentid}

Quiz         : ${window.currentResult.quizTitle}

Score        : ${window.currentResult.score}

Percentage   : ${window.currentResult.percentage}%

====================================

QuizMaster AI

====================================

`;

    const blob =
        new Blob([certificate], {
            type: "text/plain"
        });

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "Certificate.txt";

    link.click();

}

console.log("Results Page Loaded");