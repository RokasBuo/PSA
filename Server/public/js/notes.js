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
const addNoteButton = notesContainer.querySelector(".add-note");

getNotes();

addNoteButton.addEventListener("click", () => addNote());

function addNote() {
  const el = createNoteElement("Title", "Note text", 0, "note-example");
  notesContainer.append(el);
  const saveBtn = el.querySelector("#btn-save");
  const delBtn = el.querySelector("#btn-delete");
  el.addEventListener('input', inputEvent => {

  });
  saveBtn.addEventListener('click', async saveEvent => {
    saveProcess(saveEvent);
  });
  delBtn.addEventListener('click', async deleteEvent => {
    deleteProcess(deleteEvent);
  });
}

async function getNotes() {
  const res = await fetch("/notes-list").then(res => res.json()).then(result => {
    console.log(result);
    const notes = result.result.reverse();
    notes.forEach(note => {
      const el = createNoteElement(note.title, note.text, note.date, note._id);
      notesContainer.appendChild(el);
      el.querySelector("#btn-delete").addEventListener('click', async deleteEvent => {
        deleteProcess(deleteEvent);
      });
      el.querySelector("#btn-save").addEventListener('click', async saveEvent => {
        saveProcess(saveEvent);
      });
    });
  });
}

const formatDate = (date) => {
  const str = date.toISOString().split("T");
  return `${str[0]} ${str[1].split(".")[0]}`; 
};

const createNoteElement = (title, text, date, id) => {
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
  if(!confirmation) return;
  const parent = event.target.offsetParent;
  console.log(parent, parent.id);
  if (parent.id != 'note-example') {
    const data = await postData("/notes", { id: parent.id }, 'DELETE');
    console.log(data);
  }
  parent.remove();
};

const saveProcess = async (event) => {
  const parent = event.target.offsetParent;
  console.log(parent)
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
