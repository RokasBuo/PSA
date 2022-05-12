const groupBttns = document.getElementById("groups");
const form = document.getElementById("form");
const question_container = document.getElementById("questions");
const question_el = document.getElementById("question");
const answer_el = document.getElementById("answer-input");
const answer_btn = document.getElementById("answer-btn");
const QUESTIONNAIRE = {
    all_questions: {},
    index: 0,
};
let r = 0;
const formatDate = (date) => {
    if (typeof date != Date) date = new Date(date);
    const str = date.toISOString().split("T");
    return `${str[0]} ${str[1].split(".")[0]}`;
};
answer_btn.addEventListener("click", e => {
    console.log("YES!");
    const value = answer_el.value.trim();
    if (value != QUESTIONNAIRE.answer) {
        alert("INCORRECT! Correct answer: " + QUESTIONNAIRE.answer);
    } else {
        alert(`correct ${r++}`);
    }
    showNextQuestion();
});


async function deleteQuestion(id, group, e) {
    const response = await fetch("/card", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    }).then(response => response.json()).catch(err => alert(err.message));
    if (response.error) {
        return alert(reponse.message);
    }
    console.log(QUESTIONNAIRE, QUESTIONNAIRE.all_questions[group], id);
    QUESTIONNAIRE.all_questions[group] = QUESTIONNAIRE.all_questions[group].filter(q => q._id != id);
    if (QUESTIONNAIRE.all_questions[group].length === 0) {
        document.getElementById(`groupbtn-${group}`).remove(); // remove buttons of empty groups.
    }
    showNextQuestion();
}


const showNextQuestion = function () {
    const index = QUESTIONNAIRE.index;
    if (QUESTIONNAIRE.questions.length < index + 1) {
        console.log("LOWER", QUESTIONNAIRE.questions.length, index + 1);
        groupBttns.style.display = "block";
        question_container.style.display = "none";
        alert(`all done! ${r++}`);
        return;
    }
    answer_el.value = "";
    const obj = QUESTIONNAIRE.questions[index];
    const answer = obj.answer;
    const question = obj.question;
    console.log(obj);
    QUESTIONNAIRE.answer = answer;
    question_el.innerHTML = `
    <div id="${obj._id}" class="d-inline-block card mb-3" style="width: 18rem; border-radius: 30px; margin-right: 2rem;"><div class="card-body">
        <h5 class="card-title" id="note-title" contenteditable="true">${question}</h5>
    </div>
    <div class="card-footer text-muted">
        <div class="d-inline-block">
            ${formatDate(obj.date)}
        </div>
        <div style="float:right; margin-top: -5px">
            <button class="btn" id="btn-delete" onclick="deleteQuestion('${obj._id}', '${obj.group}', this)"><i class="fa fa-trash text-muted" aria-hidden="true"></i></button>
        </div>
    </div>
    
    `;
    QUESTIONNAIRE.index++;
};


const addGroupButton = (name, group) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", "group-btn");
    console.log("PARSING:", group);
    btn.innerHTML = name;
    btn.id = `groupbtn-${name}`;
    btn.addEventListener("click", async e => {
        QUESTIONNAIRE.index = 0;
        QUESTIONNAIRE.questions = QUESTIONNAIRE.all_questions[name];
        groupBttns.style.display = "none";
        question_container.style.display = "block";
        showNextQuestion();
    });
    groupBttns.appendChild(btn);
};


fetch("/card-list").then(res => res.json()).then(data => {
    console.log(data);
    const groups = {};
    data.result.forEach(item => {
        if (!groups[item.group]) {
            groups[item.group] = [];
        }
        groups[item.group].push(item);
        if (!QUESTIONNAIRE.all_questions[item.group]) {
            QUESTIONNAIRE.all_questions[item.group] = [];
        }
        QUESTIONNAIRE.all_questions[item.group].push(item);
    });

    console.log(groups);

    Object.keys(groups).forEach(group => {
        addGroupButton(group, groups[group]);
    });
}).catch(err => { alert("uh oh:" + err.message); });


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const response = await fetch("/cards", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(res => res.json()).catch(err => { alert(err.message); });
    if (response.error) {
        return alert(response.message);
    }
    console.log(response);

    if (!QUESTIONNAIRE.all_questions[response.result.group]) {
        QUESTIONNAIRE.all_questions[response.result.group] = [];
    }
    // since empty question group buttons are removed we need to recreate it.
    // if above returns FALSE if the group exists but is empty (e.g. after deleting the last question in a group)
    if (QUESTIONNAIRE.all_questions[response.result.group].length == 0) {
        // only add button if doesn't exist
        addGroupButton(response.result.group, response.result);
    }
    QUESTIONNAIRE.all_questions[response.result.group].push(response.result);
});