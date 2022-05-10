const tbody = document.querySelector("tbody");
const formatDate = (date) => {
    if(typeof date != Date) date = new Date(date);
    const str = date.toISOString().split("T");
    return `${str[0]} ${str[1].split(".")[0]}`;
};

const drawTable = (data) => {
    console.log(data);
    let html = "";
    data.forEach(row => {
        html += `<tr>
        <td>${row.user}</td>
        <td>${formatDate(row.date)}</td>
        <td> 
        <audio controls>
            <source src="/uploads/audio/${row.user}/${row.filename}" type="${row.filetype}">
        </audio>
        </td>
        </tr>`;
    });
    tbody.innerHTML = html;
};


const data = fetch("/admin/audio-list").then(res => res.json()).then(data => {
    drawTable(data.list);
    const dataTable = new simpleDatatables.DataTable("table", {

    });
}).catch(err => { alert(err.message); });



