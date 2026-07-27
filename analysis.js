const API="http://localhost:5000/api/admin/analysis";

async function loadAnalysis(){

    const response=await fetch(API);

    const data=await response.json();

    if(!data.success){

        alert(data.message);

        return;

    }

    document.getElementById("students").innerText=data.statistics.students;

    document.getElementById("attempts").innerText=data.statistics.attempts;

    document.getElementById("highest").innerText=data.statistics.highest+"%";

    document.getElementById("average").innerText=data.statistics.average+"%";

    let html="";

    data.results.forEach(r=>{

        html+=`

        <tr>

            <td>${r.fullname}</td>

            <td>${r.quizId}</td>

            <td>${r.score}</td>

            <td>${r.percentage}%</td>

        </tr>

        `;

    });

    document.getElementById("resultTable").innerHTML=html;

}

loadAnalysis();