const tbody = document.querySelector("tbody");

const drawTable = (data) => {
    let html = "";
    data.forEach(row => {
        html += `<tr>
        <td>${row._id}</td>
        <td>${row.username}</td>
        <td>${row.email}</td>
        <td>${row.is_admin}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};


const data = fetch("/admin/user-list").then(res => res.json()).then(data => {
    drawTable(data.result);
    const dataTable = new simpleDatatables.DataTable("table", {

    });
}).catch(err => { alert(err.message); });



