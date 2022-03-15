(async () => {
    const form = document.querySelector("form");

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
            window.location.replace("/login");
        }
        if(response.error) {
            alert(response.message);
            return;
        }
    });
})();