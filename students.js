async function loadStudents() {

    try {

        const response = await fetch("http://localhost:5000/api/admin/students");
        const data = await response.json();

        const table = document.getElementById("studentTable");
        table.innerHTML = "";

        if (!data.success) {

            table.innerHTML = "<tr><td colspan='4'>No students found</td></tr>";
            return;

        }

        data.students.forEach(student => {

            table.innerHTML += `
                <tr>
                    <td>${student.studentid}</td>
                    <td>${student.fullname}</td>
                    <td>${student.email}</td>
                    <td>${student.college}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

        document.getElementById("studentTable").innerHTML =
            "<tr><td colspan='4'>Unable to load students.</td></tr>";

    }

}

loadStudents();