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

(async () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(form);
        let input = formData.get("input");
        const cleanInput = input.replaceAll("^", "**");
        console.log(input, cleanInput);
        const result = eval(cleanInput);
        history.inputs.push(input);
        history.results.push(result);
        saveStorage();
    });

})();