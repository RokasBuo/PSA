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
const notesContainer = document.getElementById("app");
const addNoteButton = document.querySelector(".add-note");

async function getNotes() {
  return new Promise(async (resolve, reject) => {
    const res = await fetch("/notes-list").then(res => res.json()).catch(err => reject);

    resolve(res.result);
  });
}

const formatDate = (date) => {
  const str = date.toISOString().split("T");
  return `${str[0]} ${str[1].split(".")[0]}`;
};

const createNoteElement = (title, text, date, id, hash = false) => {
  const events = 'onclick="clearThis(this)" onblur="blurEvent(this), false"';
  const NoteHtml = `<div class="card-body">
    <h5 class="card-title" id="note-title" contenteditable="true" ${id == 'note-example' ? events : ''}>${title}</h5>
    <p class="card-text" id="note-text" contenteditable="true" ${id == 'note-example' ? events : ''}>${text}</p>
    </div>
    <div class="card-footer text-muted">
    <div class="d-inline-block">
        ${date == 0 ? "Just now" : formatDate(new Date(date))}
    </div>
    <div style="float:right; margin-top: -5px">
        <button class="btn" id="btn-save"><i class="fa fa-check text-muted"></i></button>
        <button class="btn" id="btn-delete"><i class="fa fa-trash text-muted"></i></button>
    </div>
    </div>`;
  const el = document.createElement('div');
  if (hash) {
    el.setAttribute('hash', hash);
  }
  el.id = id;
  el.classList.add('d-inline-block', 'card', 'mb-3');
  el.style.width = '18rem';
  el.style['border-radius'] = '30px';
  el.style['margin-right'] = '2rem';
  el.innerHTML = NoteHtml.trim();
  return el;
};

const INITIAL_VALUES = [];

const clearThis = (el) => {
  const initial = el.innerHTML;
  if (!(initial == "Title" || initial == "Note text")) { return; }
  INITIAL_VALUES[el] = initial;
  console.log(INITIAL_VALUES);
  console.log(initial);
  el.innerHTML = "";
};

const blurEvent = (el) => {
  const initial = el.innerHTML;
  if (initial == "") {
    el.innerHTML = INITIAL_VALUES[el];
  }
};

const deleteProcess = async (event) => {
  const confirmation = confirm("Are you sure you want to delete? This action is permanent.");
  if (!confirmation) return;
  const parent = event.target.offsetParent;
  console.log(parent, parent.id);
  if (parent.id != 'note-example') {
    const res = await postData("/notes", { id: parent.id }, 'DELETE');
    data = data.filter(note => {
      if(note._id == 'note-example') return note;
      if(note._id != parent.id) return note;
    });
    console.log(res);
  } else {
    const hash = parent.getAttribute('hash');
    console.log(parent, hash);
    data = data.filter(note => {
      if (!note.hash) return note;
      if (note.hash != hash) return note;
    });
  }
  parent.remove();
  create(data, true);
};

const saveProcess = async (event) => {
  const parent = event.target.offsetParent;
  console.log(parent);
  const title = parent.querySelector("#note-title").innerText;
  const text = parent.querySelector("#note-text").innerText;
  if (parent.id != 'note-example') {
    const data = await postData("/notes", { id: parent.id, title, text }, 'PATCH');
    if (data.error) {
      const errors = Object.values(data.error.errors).map(error => error.message).join("<br>");
      alert("Error: " + errors);
      console.log(errors);
    }
    console.log(data);
  } else {
    const data = await postData("/notes", { title, text });
    if (data.success) {
      const id = data.result._id;
      parent.id = id;
    } else {
      console.log(data);
      const errors = Object.values(data.error.errors).map(error => error.message).join("<br>");
      alert("Error: " + errors);
      console.log(errors);
    }

  }
};

function renderer(notes) {
  notesContainer.innerHTML = "";
  notes.forEach(note => {
    const el = createNoteElement(note.title, note.text, note.date, note._id, note.hash);
    notesContainer.appendChild(el);
    el.querySelector("#btn-delete").addEventListener('click', async deleteEvent => {
      deleteProcess(deleteEvent);
    });
    el.querySelector("#btn-save").addEventListener('click', async saveEvent => {
      saveProcess(saveEvent);
    });
  });
}

function create(data, destroy = false) {
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
    //data: dataFunc,
    render: renderer,
  });
}
let data;
(async function init() {
  data = await getNotes();
  console.log(data);
  create(data, false);
  addNoteButton.addEventListener("click", () => addNote());

  function addNote() {
    const hash = new Date().getTime();
    const el = createNoteElement("Title", "Note text", 0, "note-example", hash);
    data.push({ _id: "note-example", hash: hash, title: 'Title', text: 'Note text', date: (new Date()).toISOString() });
    el.setAttribute('hash', hash);
    create(data, true);
  }
})();
