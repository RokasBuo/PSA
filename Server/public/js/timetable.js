async function postData(url = '', data = {}, method = 'POST') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

let lastClick = null;
const divs = [...document.querySelectorAll(".schedule div")];
const addModal = new Modal(document.getElementById("add-modal"));
const selectionModal = new Modal(document.getElementById("selection-modal"));
const editModal = new Modal(document.getElementById("edit-modal"));
const editTitle = document.getElementById("edit-event-title");
const editInput = document.getElementById("edit-title-input");




function selectEditEvent(e, ev) {
    const color = e.target.classList[1].split("-")[1];
    console.log(color);
    editModal.showModal();
    editTitle.innerHTML = e.target.innerText;
    editInput.value = e.target.innerText;
    document.querySelector(`.edit-option[value='${color}']`).selected = 'selected';
    ev.target.removeEventListener('click', selectEditEvent);
}

function selectAddEvent(ev) {
    console.log('add');
    addModal.showModal();
    ev.target.removeEventListener('click', selectAddEvent);
}

function generateEventDiv(data) {
    const div = document.createElement("div");
    div.classList.add(`event`, `accent-${data.color}-gradient`);
    div.innerText = data.title;
    div.id = data._id;
    div.addEventListener("click", e => {
        lastClick = e.target;
        if (e.target.classList.contains("event")) {
            selectionModal.showModal();
            document.getElementById("select-edit").addEventListener('click', ev => selectEditEvent(e, ev), false);
            document.getElementById("select-add").addEventListener('click', ev => selectAddEvent(ev), false);
            return;
        }
        addModal.showModal();
    });
    return div;
}

document.getElementById("edit-modal-form").addEventListener("submit", async e => {
    e.preventDefault();
    const id = lastClick.parentElement.id;
    const split = id.split("-");
    const day = split[0];
    const time = split[1];
    let formData = new FormData(e.target);
    formData.append("day", day);
    formData.append("time", time);
    formData.append("id", lastClick.id);
    const data = Object.fromEntries(formData);
    const res = await postData('/timetable', data, "PATCH");
    if (res.error) {
        alert(`Something went wrong: ${res.message}`);
    } else if (res.success) {
        editModal.hideModal();
        if (!res.result.modifiedCount) {
            return;
        }
        lastClick.innerHTML = `<div id="${lastClick.id}" class="accent-${data.color}-gradient event">${data.title}</div>`;
    } else {
        alert("Something went wrong. Please try again.");
    }
});

document.getElementById("add-modal-form").addEventListener("submit", async e => {
    e.preventDefault();
    let id = lastClick.id;
    if (!lastClick.id) {
        id = lastClick.parentElement.id;
    }

    const split = id.split("-");
    const day = split[0];
    const time = split[1];
    let formData = new FormData(e.target);
    formData.append("day", day);
    formData.append("time", time);
    const data = Object.fromEntries(formData);
    const res = await postData('/timetable', data, "POST");
    if (res.error) {
        alert(`Something went wrong: ${res.message}`);
    } else if (res.success) {
        // do things
        addModal.hideModal();
        document.getElementById(id).appendChild(generateEventDiv(res.result));
    } else {
        alert("Something went wrong. Please try again.");
    }
});


fetch("/timetable-list").then(res => res.json()).then(data => {
    console.log(data);
    data.result.forEach(event => {
        const parent = document.getElementById(`${event.day}-${event.time}`);
        const div = generateEventDiv(event);
        parent.appendChild(div);
    });
});


divs.forEach(div => {
    div.addEventListener("click", e => {
        lastClick = e.target;
        console.log(e.target, e.target.classList);
        if (e.target.classList.contains("event")) {
            selectionModal.showModal();
            document.getElementById("select-edit").addEventListener('click', ev => {
                selectEditEvent(e, ev);
            }, false);
            document.getElementById("select-add").addEventListener('click', selectAddEvent, false);
            return;
        }
        addModal.showModal();
    }, false);
});

