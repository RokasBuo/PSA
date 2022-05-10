const tbody = document.querySelector("tbody");
const formatDate = (date) => {
    if(typeof date != Date) date = new Date(date);
    const str = date.toISOString().split("T");
    return `${str[0]} ${str[1].split(".")[0]}`;
};
const drawTable = (data) => {
    let html = "";
    data.forEach(row => {
        html += `<tr>
        <td>${row.user}</td>
        <td>${row.quote}</td>
        <td>${formatDate(row.date)}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
};


const data = fetch("/admin/quote-list").then(res => res.json()).then(data => {
    drawTable(data.result);
    const dataTable = new simpleDatatables.DataTable("table", {

    });
}).catch(err => { alert(err.message); });



