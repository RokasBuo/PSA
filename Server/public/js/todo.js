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

const todo_list = document.querySelectorAll(".todo-list")[0];
const input = document.querySelectorAll(".todo-list-input")[0];
input.value = '';
const generateTaskHTML = (todo) => {
    const el = document.createElement("li");
    el.classList.add(todo.state);
    el.innerHTML = `
    <div class="form-check">
      <label class="form-check-label">
        <input class="checkbox" type="checkbox" ${todo.state == 'completed' ? 'checked' : ''} />
        ${todo.task}
        <i class="input-helper"></i></label>
    </div>
    <i class="remove fas fa-trash"></i>`;
    el.getElementsByClassName("checkbox")[0].addEventListener('click', async (e) => {
        const state = todo.state == "completed" ? "active" : "completed";
        const response = await postData("/todo/", { id: todo._id, state: state }, "PATCH");
        console.log(response);
        if (response.success) {
            if(state == "completed") {
                el.classList.add('completed');
            } else {
                el.classList.remove('completed');
            }
        }
    });
    el.getElementsByClassName("remove")[0].addEventListener('click', async (e) => {
        const confirmation = confirm("Are you sure you want to delete? This action is permanent.");
        if (!confirmation) return;
        const response = await postData("/todo/", { id: todo._id }, "DELETE");
        if (response.success) {
            el.remove();
            data = data.filter(d => d._id != todo._id);
            create(data, true);
        }
    });
    return el;
};
async function getTodos() {
    return new Promise(async (resolve, reject) => {
        const res = await fetch("/todo-list").then(res => res.json()).catch(err => reject);
        resolve(res.result);
    });
}


document.getElementById("form").addEventListener('submit', async e => {
    e.preventDefault();
    const task = new FormData(e.target).get('task');
    const response = await postData("/todo/", { task }, "POST");
    console.log(response);
    if (response.success) {
        const el = generateTaskHTML(response.result);
        todo_list.appendChild(el);
        data.push(response.result);
        create(data, true);
    } else {
        const errors = Object.values(response.error.errors).map(error => error.message).join("<br>");
        Swal.fire("Error", errors, 'error');
    }
    input.value = '';
});


function renderer(todos) {
    todo_list.innerHTML = "";
    todos.forEach(todo => {
        const el = generateTaskHTML(todo);
        todo_list.appendChild(el);
    });
}

function create(data, destroy = false) {
    console.log("creating", data);
    data = [...data].reverse();
    if (destroy) {
        $('.pagination').jqpaginator('destroy');
    }
    $('.pagination').jqpaginator({
        showButtons: true,
        showInput: false,
        showNumbers: true,
        numberMargin: 1,
        itemsPerPage: 5,
        data: data,
        buttonText: [`<i class="fas fa-arrow-left"></i>`, `<i class="fas fa-arrow-right"></i>`],
        //data: dataFunc,
        render: renderer,
    });
}

let data;

(async function init() {
    data = await getTodos();
    console.log(data);
    create(data, false);
})();
