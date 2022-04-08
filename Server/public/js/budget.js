$("button").click(gather);
$(document).ready(centerme);
$(window).resize(centerme);
const historyContainer = document.getElementById("history-data");
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

async function gather() {
    income = document.getElementById("income").value;
    income = income.replace(/\D/g, '');
    rent = document.getElementById("rent").value;
    rent = rent.replace(/\D/g, '');
    utilities = document.getElementById("utilities").value;
    utilities = utilities.replace(/\D/g, '');
    food = document.getElementById("food").value;
    food = food.replace(/\D/g, '');
    insurance = document.getElementById("insurance").value;
    insurance = insurance.replace(/\D/g, '');
    result = income - rent - utilities - food - insurance;
    savings = Math.round(income * 0.20);
    $(".results-data").empty();
    $(".emoji").empty();
    if (income == "" || rent == "" || utilities == "" || food == "" || insurance == "") {
        $(".results-data").append('<p class="text-danger convert-emoji">Please fill up all the data.</p>');
        $(".emoji").append('<i class="frown">&nbsp;</i>');
        return;
    }
    if (result === 0) {
        $(".results-data").append('<p class="text-danger convert-emoji">You are dead even. You might want to try and reduce your spending this month.</p>');
        $(".emoji").append('<i class="frown">&nbsp;</i>');
    }
    else if (result < 0) {
        $(".results-data").append('<p class="text-danger"> After your expenses you have $' + result + ' left in your budget. You might want to try and reduce your spending this month.</p>');
        $(".emoji").append('<i class="tear">&nbsp;</i>');
    }
    else {
        $(".results-data").append(
            '<p class="text-sucess"> After your expenses you have $' + result + ' left in your budget.</p>', '<p class="text-sucess">But you should save at least $' + savings + '.</p>');
        $(".emoji").append('<i class="happy">&nbsp;</i>');
    }

    const res = await postData('/budget', { income, rent, utilities, food, insurance, result, savings }, "POST");
    if (res.success) {
        data.push(res.result);
        create(data, true);
    }

}


function centerme() {
    boiheight = $(".center-meh-boi").height();
    middle = boiheight / 2;
    $(".center-meh-boi").css("margin-top", "-" + middle + "px");
    console.log(boiheight);
}
const formatDate = (date) => {
    const str = date.toISOString().split("T");
    return `${str[0]} ${str[1].split(".")[0]}`;
};

async function delete_history(id, el) {
    console.log(id, el);
    const confirmation = confirm("Are you sure you want to delete? This action is permanent.");
    if(!confirmation) return;
    const res = await fetch("/budget", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
    }).then(res => res.json());
    console.log(el);
    if (res.success) {
        el.parentElement.parentElement.remove();
        data = data.filter(d => d._id != id);
        create(data, true);
    }
}

function addRowToContainer(data) {
    const html = `<tr>
        <td>
            ${data.income}
        </td>
        <td>
            ${data.rent}
        </td>
        <td>
            ${data.utilities}
        </td>
        <td>
            ${data.food}
        </td>
        <td>
            ${data.insurance}
        </td>
        <td>
            ${data.result}
        </td>
        <td>
            ${data.savings}
        </td>
        <td>
            ${formatDate(new Date(data.date))}
        </td>
        <td>
            <button class="delete-button" onclick="delete_history('${data._id}', this)"><i class="fa fa-trash text-muted"></i></button>
        </td>
    </tr>`;
    historyContainer.innerHTML += html;
}

async function getHistory() {
    return new Promise(async (resolve, reject) => {
        const res = await fetch("/budget-list").then(res => res.json()).catch(err => reject);
        resolve(res.result);
    });
}

function renderer(history) {
    historyContainer.innerHTML = "";
    console.log(history);
    history.forEach(h => addRowToContainer(h));
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
    data = await getHistory();
    create(data, false);
})();