/* ==========================================
   QuizMaster AI - Dashboard
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    welcomeMessage();
    animateCards();
    animateCounters();
    loadStudent();
    loadStatistics();

    /* Sidebar Navigation */

    const dashboardBtn = document.getElementById("dashboardBtn");
    const quizBtn = document.getElementById("quizBtn");
    const leaderboardBtn = document.getElementById("leaderboardBtn");
    const resultsBtn = document.getElementById("resultsBtn");
    const profileBtn = document.getElementById("profileBtn");
    const logoutBtn = document.getElementById("logout");
   function startQuiz(quizid) {
    window.location.href = `quiz.html?quizid=${quizid}`;
}
let questions = [];
let currentQuestion = 0;
let answers = [];

    if (dashboardBtn) {

        dashboardBtn.addEventListener("click", () => {

            window.location.href = "dashboard.html";

        });

    }

    if (quizBtn) {

        quizBtn.addEventListener("click", () => {

            window.location.href = "quiz.html";

        });

    }

    if (leaderboardBtn) {

        leaderboardBtn.addEventListener("click", () => {

            window.location.href = "leaderboard.html";

        });

    }

    if (resultsBtn) {

        resultsBtn.addEventListener("click", () => {

            window.location.href = "results.html";

        });

    }

    if (profileBtn) {

        profileBtn.addEventListener("click", () => {

            const profileBox = document.getElementById("profileBox");

            if(profileBox){

                profileBox.style.display = "block";

            }

        });

    }

    if (logoutBtn) {

        logoutBtn.addEventListener("click", logout);

    }

    /* Active Sidebar */

    const menu = document.querySelectorAll(".sidebar li");

    menu.forEach(item => {

        item.addEventListener("click", () => {

            menu.forEach(i => i.classList.remove("active"));

            item.classList.add("active");

        });

    });

});


/* ==========================================
   Welcome Message
========================================== */

function welcomeMessage(){

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if(user){

        const title = document.querySelector("header h1");

        if(title){

            title.innerHTML = `Welcome ${user.fullname || user.name} 👋`;

        }

    }

}


/* ==========================================
   Card Animation
========================================== */

function animateCards(){

    const cards = document.querySelectorAll(".card,.quiz-card");

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(40px)";

        setTimeout(()=>{

            card.style.transition=".6s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*150);

    });

}


/* ==========================================
   Counter Animation
========================================== */

function animateCounters(){

    const counters=document.querySelectorAll(".card h2");

    counters.forEach(counter=>{

        const text=counter.innerText;

        const target=parseInt(text);

        if(isNaN(target)) return;

        let count=0;

        const speed=Math.ceil(target/60);

        const timer=setInterval(()=>{

            count+=speed;

            if(count>=target){

                counter.innerText=text;

                clearInterval(timer);

            }else{

                counter.innerText=count;

            }

        },20);

    });

}


/* ==========================================
   Start Quiz
========================================== */
function startQuiz(quizid) {
    

    window.location.href = `quiz.html?quizid=${quizid}`;

}


/* ==========================================
   Student Profile
========================================== */

function loadStudent(){

    const user=JSON.parse(localStorage.getItem("currentUser"));

    console.log(user);

    if(!user){

        return;

    }

    const name=document.getElementById("studentName");
    const id=document.getElementById("studentId");
    const college=document.getElementById("studentCollege");
    const email=document.getElementById("studentEmail");

    if(name) name.innerText=user.fullname || user.name || "";
    if(id) id.innerText=user.studentid || "";
    if(college) college.innerText=user.college || "";
    if(email) email.innerText=user.email || "";

}


/* ==========================================
   Close Profile
========================================== */

function closeProfile(){

    const box=document.getElementById("profileBox");

    if(box){

        box.style.display="none";

    }

}


/* ==========================================
   Statistics
========================================== */

function loadStatistics(){

    const completed=localStorage.getItem("completedQuiz") || "0";
    const score=localStorage.getItem("bestScore") || "0%";
    const rank=localStorage.getItem("studentRank") || "#--";

    const cards=document.querySelectorAll(".card h2");

    if(cards.length>=4){

        cards[1].innerText=completed;
        cards[2].innerText=score;
        cards[3].innerText=rank;

    }

}


/* ==========================================
   Logout
========================================== */

function logout(){

    const ok=confirm("Are you sure you want to logout?");

    if(ok){

        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");

        window.location.href="login.html";

    }

}


/* ==========================================
   Toast
========================================== */

function showToast(message,color){

    const toast=document.createElement("div");

    toast.innerText=message;

    toast.style.position="fixed";
    toast.style.top="30px";
    toast.style.right="30px";
    toast.style.background=color;
    toast.style.color="#fff";
    toast.style.padding="15px 25px";
    toast.style.borderRadius="10px";
    toast.style.fontWeight="600";
    toast.style.zIndex="9999";
    toast.style.opacity="0";
    toast.style.transition=".4s";

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.style.opacity="1";

    },100);

    setTimeout(()=>{

        toast.style.opacity="0";

        setTimeout(()=>{

            toast.remove();

        },400);

    },2000);

}

console.log("Dashboard Loaded Successfully");