(async () => {
    const quote_el = document.getElementById("quote");
    const form = document.getElementById("create-quote");
    const quote = await fetch('/quote').then(response => response.json()).catch(e => console.error);
    console.log(quote);
    if (quote.success) {
        quote_el.innerHTML = `${quote.quote} &mdash; ${quote.author}`;
    }

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        console.log(data);
        const response = await fetch('/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => response.json());
        console.log(response);
        
        if(response.success) {
            quote_el.innerHTML = `${response.quote} &mdash; ${response.author}`;
        } else {
            alert(`Something went wrong.\nError: ${response.message}`);
        }

    });
})();