const tbody = document.querySelector("tbody");
const drawTable = (data) => {
    let html = "";
    data.forEach(row => {
        html += `<tr>
        <td>${row.user}</td>
        <td>${row.title}</td>
        <td>${row.day}</td>
        <td>${row.time}</td>
        <td>${row.color}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};


const data = fetch("/admin/timetable-list").then(res => res.json()).then(data => {
    drawTable(data.result);
    const dataTable = new simpleDatatables.DataTable("table", {

    });
}).catch(err => { alert(err.message); });



