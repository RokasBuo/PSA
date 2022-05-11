const tbody = document.querySelector("tbody");

async function deleteRow(id, e) {
    const confirmation = confirm("Are you sure you want to delete? This action is permanent.");
    if(!confirmation) return;
    const response = await fetch("/timetable", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
    }).then(res => res.json()).catch(err => alert(err.message));
    if(response.error) {
        return alert(response.message);
    }

    e.parentNode.parentNode.remove();
}

const drawTable = (data) => {
    let html = "";
    data.forEach(row => {
        html += `<tr>
        <td>${row.user}</td>
        <td>${row.title}</td>
        <td>${row.day}</td>
        <td>${row.time}</td>
        <td>${row.color}</td>
        <td><button onclick="deleteRow('${row._id}', this)">
            <i class="fa fa-trash"></i>
        </button></td>
        </tr>`;
    });
    tbody.innerHTML = html;
};


const data = fetch("/admin/timetable-list").then(res => res.json()).then(data => {
    drawTable(data.result);
    const dataTable = new simpleDatatables.DataTable("table", {

    });
}).catch(err => { alert(err.message); });



