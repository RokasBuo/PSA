(async () => {
    const form = document.querySelector("form");
    const inputs = [...document.querySelectorAll("input")];
    const errorsEl = document.getElementById("errors");
    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            input.classList.remove("input-error");
        });
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const response = await fetch('/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => response.json());
        console.log(response);
        if(response.success) {
            //better yet show a "success, you can now log in message".
            window.location.replace("/login?register_success");
        }
        if(response.error) {
            errorsEl.innerHTML = response.message;
            response.fields.forEach(field => {
                if(field) { // field can come as null and return an error.
                    document.getElementById(field).classList.add("input-error");
                }
            });
            return;
        }
    });
})();