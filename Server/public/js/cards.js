const groupBttns = document.getElementById("groups");
const form = document.getElementById("form");
const question_container = document.getElementById("questions");
const question_el = document.getElementById("question");
const answer_el = document.getElementById("answer-input");
const answer_btn = document.getElementById("answer-btn");
const QUESTIONNAIRE = {};

answer_btn.addEventListener("click", e => {
    console.log("YES!");
    const value = answer_el.value.trim();
    if(value != QUESTIONNAIRE.answer) {
        alert("INCORRECT! Correct answer: " + QUESTIONNAIRE.answer);
    } else {
        alert("correct");
    }
    showNextQuestion();
});

const showNextQuestion = function () {
    if(QUESTIONNAIRE.questions.length == 0) {
        groupBttns.style.display = "block";
        question_container.style.display = "none";
        alert("all done!");
        return;
    }
    answer_el.value = "";
    const obj = QUESTIONNAIRE.questions.pop();
    const answer = obj.answer;
    const question = obj.question;
    QUESTIONNAIRE.answer = answer;
    question_el.innerHTML = question;
};


const addGroupButton = (name, group) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", "group-btn");
    console.log("PARSING:", group);
    btn.innerHTML = name;
    btn.addEventListener("click", async e => {
        QUESTIONNAIRE.questions = group.map(g => {
            return { question: g.question, answer: g.answer };
        });
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
    });

    console.log(groups);

    Object.keys(groups).forEach(group => {
        addGroupButton(group, groups[group]);
    });
}).catch(err => { alert(err.message); });


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

    // TODO: re-render group buttons, this results in duplcate useless buttons.
    addGroupButton(response.result.group, response.result);
});