const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const studentid = document.getElementById("studentid").value.trim();
    const password = document.getElementById("password").value;

    // ==========================
    // ADMIN LOGIN
    // ==========================
    if (studentid === "admin" && password === "admin123") {

        alert("Welcome Admin!");

        window.location.href = "admin.html";

        return;
    }

    // ==========================
    // STUDENT LOGIN
    // ==========================
    try {

        const response = await fetch("http://localhost:5000/api/auth/login",
             {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                studentid,
                password
            })

        });
        const data = await response.json();

console.log("Complete Response:", data);
console.log("Success:", data.success);
console.log("User:", data.user);
        if (data.success) {

    alert("Login Successful");


    // Save student details

    localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
    );


    window.location.href = "dashboard.html";

}

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});