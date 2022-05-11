const tbody = document.querySelector("tbody");

async function setAdmin(id, e) {
    const confirmation = confirm("Are you sure you want to set as admin? This action is permanent.");
    if(!confirmation) return;
    const response = await fetch("/admin/set-admin", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    }).then(res => res.json()).catch(err => alert(err.message));
    if (response.error) {
        return alert("something went wrong: " + response.message);
    }
    console.log(response, e);
    document.querySelector(`.admin-row-${id}`).innerHTML = "true";
    e.style.display = "none";
}


const drawTable = (data) => {
    let html = "";
    data.forEach(row => {
        let buttons = "";
        if (!row.is_admin) {
            buttons = `<button onclick="setAdmin('${row._id}', this)">Set as admin</button>`;
        }
        html += `<tr>
        <td>${row._id}</td>
        <td>${row.username}</td>
        <td>${row.email}</td>
        <td class="admin-row-${row._id}">${row.is_admin}</td>
        <td>${buttons}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};


const data = fetch("/admin/user-list").then(res => res.json()).then(data => {
    drawTable(data.result);
    const dataTable = new simpleDatatables.DataTable("table", {

    });
}).catch(err => { alert("UH OH: " + err.message); });



