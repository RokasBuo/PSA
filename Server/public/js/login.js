(async () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => response.json());
        console.log(response);
        if(response.success) {
            window.location.replace("/");
        }
        if(response.error) {
            alert(response.message);
            return;
        }
    });
})();