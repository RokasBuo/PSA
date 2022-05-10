const tbody = document.querySelector("tbody");

const drawTable = (data) => {
    let html = "";
    data.forEach(row => {
        html += `<tr>
        <td>${row.user}</td>
        <td>${row.task}</td>
        <td>${row.state}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};


const data = fetch("/admin/todo-list").then(res => res.json()).then(data => {
    drawTable(data.result);
    const dataTable = new simpleDatatables.DataTable("table", {

    });
}).catch(err => { alert(err.message); });



