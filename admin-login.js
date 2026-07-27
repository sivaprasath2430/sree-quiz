const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const form = document.getElementById("adminLoginForm");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value.trim();

    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){

        alert("Welcome Admin!");

        window.location.href = "admin.html";

    }

    else{

        alert("Invalid Username or Password");

    }

});