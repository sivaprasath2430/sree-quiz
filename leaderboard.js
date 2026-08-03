/* ==========================================
   QuizMaster AI - Leaderboard
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadLeaderboard();

    document.getElementById("dashboardBtn").addEventListener("click", () => {

        window.location.href = "dashboard.html";

    });
document.getElementById("refreshBtn").addEventListener("click", async () => {

    const table = document.getElementById("leaderboardTable");

    table.innerHTML = `
        <tr>
            <td colspan="4">Refreshing...</td>
        </tr>
    `;

    await loadLeaderboard();

});
    });



/* ==========================================
   LOAD LEADERBOARD
========================================== */
async function loadLeaderboard() {

    const quizId = localStorage.getItem("currentQuizId");

    if (!quizId) {

        alert("No Quiz Selected");

        return;

    }

    try {

        const response = await fetch(

            `https://sree-quiz.onrender.com/api/leaderboard/${quizId}?t=${Date.now()}`

        );

        const data = await response.json();
        console.log("Leaderboard Stats:", data);

        if (!data.success) {

            alert(data.message);

            return;

        }

        displayLeaderboard(data.leaderboard);

    }

    catch (err) {

        console.log(err);

        alert("Unable to Load Leaderboard");

    }

}

/* ==========================================
   DISPLAY LEADERBOARD
========================================== */
function displayLeaderboard(leaderboard) {

    const table = document.getElementById("leaderboardTable");

    table.innerHTML = "";

    if (leaderboard.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="4">No Results Found</td>

        </tr>

        `;

        return;

    }

    leaderboard.forEach((student, index) => {

        let medal = "";

        if(index===0) medal="🥇";
        else if(index===1) medal="🥈";
        else if(index===2) medal="🥉";

        table.innerHTML += `

        <tr>

            <td>${medal} ${index+1}</td>

            <td>${student.fullname}</td>

            <td>${student.score}</td>

            <td>${student.percentage}%</td>

        </tr>

        `;

    });

}

/* ==========================================
   DOWNLOAD LEADERBOARD
========================================== */

document.getElementById("downloadBtn").addEventListener("click", () => {

    window.print();

});

console.log("Leaderboard Loaded Successfully");
const API_URL = "https://sree-quiz.onrender.com/api";

async function loadLeaderboardStats() {

    const response = await fetch(`${API_URL}/leaderboard/stats`);

    const data = await response.json();

    console.log(data);

    document.getElementById("totalStudents").textContent =
        data.totalParticipants;

    document.getElementById("highestScore").textContent =
        data.highestScore + "%";

    document.getElementById("averageScore").textContent =
        data.averageScore + "%";
}

loadLeaderboardStats();