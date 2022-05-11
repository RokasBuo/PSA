const tbody = document.querySelector("tbody");

async function deleteRow(id, e) {
    const confirmation = confirm("Are you sure you want to delete? This action is permanent.");
    if(!confirmation) return;
    const response = await fetch("/todo", {
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
        <td>${row.task}</td>
        <td>${row.state}</td>
        <td><button onclick="deleteRow('${row._id}', this)">
            <i class="fa fa-trash"></i>
        </button></td>
        </tr>`;
    });
    tbody.innerHTML = html;
};


const data = fetch("/admin/todo-list").then(res => res.json()).then(data => {
    drawTable(data.result);
    const dataTable = new simpleDatatables.DataTable("table", {

    });
}).catch(err => { alert(err.message); });



