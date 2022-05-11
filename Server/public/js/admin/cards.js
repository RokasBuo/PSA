const tbody = document.querySelector("tbody");
const formatDate = (date) => {
    if(typeof date != Date) date = new Date(date);
    const str = date.toISOString().split("T");
    return `${str[0]} ${str[1].split(".")[0]}`;
};

async function deleteRow(id, e) {
    const confirmation = confirm("Are you sure you want to delete? This action is permanent.");
    if(!confirmation) return;
    const response = await fetch("/card", {
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
    console.log(data);
    let html = "";
    data.forEach(row => {
        html += `<tr>
        <td>${row.user}</td>
        <td>${row.group}</td>
        <td>${row.question}</td>
        <td>${row.answer}</td>
        <td>${formatDate(row.date)}</td>
        <td><button onclick="deleteRow('${row._id}', this)">
            <i class="fa fa-trash"></i>
        </button></td>
        </tr>`;
    });
    tbody.innerHTML = html;
};


const data = fetch("/admin/card-list").then(res => res.json()).then(data => {
    drawTable(data.result);
    const dataTable = new simpleDatatables.DataTable("table", {

    });
}).catch(err => { alert(err.message); });



