const tbody = document.querySelector("tbody");
const form = document.querySelector("form");
const inputEl = document.querySelector("input");
const answerEl = document.getElementById("answer");
const previousPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");
const pageNum = document.getElementById("pageNum");
const okBttn = document.getElementById("ok");
const neverBttn = document.getElementById("never");
const todayBttn = document.getElementById("today");
const perPage = 10;
let currentPage = 1;

function resetStorage() {
    history = { inputs: [], results: [] };
    saveStorage("history", history);
    drawTable(1);
}

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


let history = getStorage("history") || { inputs: [], results: [] };

let modalPrefs = getStorage("modalPrefs") || { hide: 0 };

okBttn.addEventListener('click', e => {
    hideModal();
});

todayBttn.addEventListener('click', e => {
    //get start of next day
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    modalPrefs.hide = now.getTime();
    saveStorage("modalPrefs", modalPrefs);
    hideModal();
});

neverBttn.addEventListener('click', e => {
    const now = new Date();
    now.setYear(9999);

    modalPrefs.hide = now.getTime();
    saveStorage("modalPrefs", modalPrefs);
    hideModal();
});

inputEl.addEventListener("paste", e => {
    console.log("pasted!");
    console.log(modalPrefs.hide, Date(), modalPrefs.hide > Date());
    if (modalPrefs.hide < (new Date()).getTime()) {

        showModal();
        e.preventDefault();
    }
});


nextPage.addEventListener("click", () => {
    if (currentPage + 1 > Math.ceil(history.inputs.length / perPage)) {
        return;
    }
    drawTable(++currentPage);
    // show the current page somewhere
});

previousPage.addEventListener("click", () => {
    if (currentPage - 1 < 1) {
        return;
    }
    drawTable(--currentPage);
    // show the current page somwhere
});

if (history.inputs.length > 0) {
    drawTable(currentPage);
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
    saveStorage("history", history);
});
