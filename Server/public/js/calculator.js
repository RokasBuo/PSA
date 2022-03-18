const tbody = document.querySelector("tbody");
const form = document.querySelector("form");
const inputEl = document.querySelector("input");
const answerEl = document.getElementById("answer");
const previousPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");
const pageNum = document.getElementById("pageNum");
const perPage = 10;
let currentPage = 1;

nextPage.addEventListener("click", () => {
    if(currentPage+1 > Math.ceil(history.inputs.length / perPage)) {
        return;
    }
    drawTable(++currentPage);
    // show the current page somewhere
});

previousPage.addEventListener("click", () => {
    if(currentPage-1 < 1) {
        return;
    }
    drawTable(--currentPage);
    // show the current page somwhere
});


function getStorage() {
    const json = window.localStorage.getItem("history");
    const data = JSON.parse(json);
    return data;
}

function saveStorage() {
    const json = JSON.stringify(history);
    window.localStorage.setItem("history", json);
    return true;
}

let history = getStorage() || { inputs: [], results: [] };

function generateCellHTML(input, result) {
    return `<tr onclick="tdClickHandler('${input}', '${result}')">
        <td data-label="Input: ">${input} = ${result}</td>
    </tr>`;
}

function generateTableHTML(page) {
    console.log("called", page);
    html = "";
    const inputs = [...history.inputs].reverse();
    const results = [...history.results].reverse();
    console.log((page - 1) * perPage, page * perPage);
    for (let i = (page - 1) * perPage; i < page * perPage; i++) {
        console.log("loop :)");
        const input = inputs[i];
        const result = results[i];
        if (!input) break;
        html += generateCellHTML(input, result);
    }
    return html;
}

function tdClickHandler(input, result) {
    console.log("CALLED");
    inputEl.value = input;
    answerEl.innerHTML = result;
}

function drawTable(page) {
    console.log("page:", page);
    pageNum.innerHTML = page;
    tbody.innerHTML = generateTableHTML(page);
}

drawTable(currentPage);

function resetStorage() {
    history = { inputs: [], results: [] };
    saveStorage();
    drawTable(1);
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(form);
    let input = formData.get("input");
    const cleanInput = input.replaceAll("^", "**");
    console.log(input, cleanInput);
    const result = eval(cleanInput);
    history.inputs.push(input);
    history.results.push(result);
    answer.innerHTML = result;
    drawTable(currentPage);
    saveStorage();
});
